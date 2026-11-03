const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Configure reliable DNS servers to prevent Windows querySrv ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore if custom dns servers cannot be set
}

let dbInstance = null;
let clientInstance = null;
let isInMemoryFallback = false;

// In-memory / file-persisted store fallback in case remote MongoDB is unreachable
class MemoryCollection {
  constructor(name, dataFile) {
    this.name = name;
    this.dataFile = dataFile;
    this.items = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const raw = fs.readFileSync(this.dataFile, 'utf-8');
        this.items = JSON.parse(raw);
      }
    } catch {
      this.items = [];
    }
  }

  save() {
    try {
      const dir = path.dirname(this.dataFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.dataFile, JSON.stringify(this.items, null, 2));
    } catch (err) {
      console.error(`Error persisting ${this.name}:`, err.message);
    }
  }

  find(query = {}) {
    let result = this.items.filter((item) => {
      for (const key of Object.keys(query)) {
        if (key === '_id') {
          const qVal = query[key]?.toString();
          const iVal = item._id?.toString();
          if (qVal !== iVal) return false;
        } else if (key === 'eventDate' && typeof query[key] === 'object') {
          const itemDate = new Date(item.eventDate).getTime();
          if (query[key].$gte && itemDate < new Date(query[key].$gte).getTime()) return false;
          if (query[key].$lte && itemDate > new Date(query[key].$lte).getTime()) return false;
        } else if (query[key] instanceof RegExp) {
          if (!query[key].test(item[key] || '')) return false;
        } else if (query[key] && typeof query[key] === 'object' && query[key].$regex) {
          const reg = new RegExp(query[key].$regex, query[key].$options || 'i');
          if (!reg.test(item[key] || '')) return false;
        } else if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    const cursor = {
      _data: result,
      sort(sortObj = {}) {
        const sortKeys = Object.keys(sortObj);
        if (sortKeys.length > 0) {
          const key = sortKeys[0];
          const dir = sortObj[key] === -1 || sortObj[key] === 'desc' ? -1 : 1;
          this._data.sort((a, b) => {
            const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
            const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
          });
        }
        return this;
      },
      limit(n) {
        if (typeof n === 'number' && n > 0) {
          this._data = this._data.slice(0, n);
        }
        return this;
      },
      async toArray() {
        return this._data;
      },
    };

    return cursor;
  }

  async findOne(query = {}) {
    const cursor = this.find(query);
    const arr = await cursor.toArray();
    return arr[0] || null;
  }

  async insertOne(doc) {
    const newDoc = {
      ...doc,
      _id: doc._id || new ObjectId().toString(),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    };
    this.items.push(newDoc);
    this.save();
    return { acknowledged: true, insertedId: newDoc._id };
  }

  async insertMany(docs) {
    const insertedIds = {};
    const createdDocs = docs.map((doc, idx) => {
      const id = doc._id || new ObjectId().toString();
      insertedIds[idx] = id;
      return {
        ...doc,
        _id: id,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString(),
      };
    });
    this.items.push(...createdDocs);
    this.save();
    return { acknowledged: true, insertedCount: docs.length, insertedIds };
  }

  async updateOne(filter, update) {
    const item = await this.findOne(filter);
    if (!item) return { matchedCount: 0, modifiedCount: 0 };
    const updates = update.$set || update;
    Object.assign(item, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteOne(filter) {
    const initialLen = this.items.length;
    const item = await this.findOne(filter);
    if (!item) return { deletedCount: 0 };
    this.items = this.items.filter((i) => i._id.toString() !== item._id.toString());
    this.save();
    return { deletedCount: initialLen - this.items.length };
  }

  async deleteMany(filter) {
    const initialLen = this.items.length;
    const toDelete = await this.find(filter).toArray();
    const deleteIds = new Set(toDelete.map((i) => i._id.toString()));
    this.items = this.items.filter((i) => !deleteIds.has(i._id.toString()));
    this.save();
    return { deletedCount: initialLen - this.items.length };
  }

  async countDocuments(query = {}) {
    const cursor = this.find(query);
    const arr = await cursor.toArray();
    return arr.length;
  }
}

class MemoryDatabase {
  constructor() {
    const storageDir = process.env.VERCEL
      ? path.join('/tmp', '.data')
      : path.join(__dirname, '../.data');
    this.collections = {
      users: new MemoryCollection('users', path.join(storageDir, 'users.json')),
      events: new MemoryCollection('events', path.join(storageDir, 'events.json')),
      joined_events: new MemoryCollection('joined_events', path.join(storageDir, 'joined_events.json')),
    };
  }

  collection(name) {
    if (!this.collections[name]) {
      const storageDir = process.env.VERCEL
        ? path.join('/tmp', '.data')
        : path.join(__dirname, '../.data');
      this.collections[name] = new MemoryCollection(name, path.join(storageDir, `${name}.json`));
    }
    return this.collections[name];
  }
}

async function connectDB() {
  if (dbInstance) {
    return dbInstance;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'kindredpulse';

  if (!uri || uri.includes('username:password') || uri.includes('<db_username>') || uri.includes('<db_password>') || uri.includes('abcde.mongodb.net')) {
    console.log('⚡ Atlas cluster configured (cluster0.a7wsplt.mongodb.net), but awaiting your database username & password. Using local store in the meantime...');
    dbInstance = new MemoryDatabase();
    isInMemoryFallback = true;
    return dbInstance;
  }

  try {
    console.log('Connecting to MongoDB Atlas / Remote...');
    clientInstance = new MongoClient(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    await clientInstance.connect();
    dbInstance = clientInstance.db(dbName);
    console.log(`✅ MongoDB connected successfully to database: "${dbName}"`);
    isInMemoryFallback = false;
    return dbInstance;
  } catch (err) {
    console.warn(`⚠️ Remote MongoDB connection failed (${err.message}). Using local persisted database store.`);
    dbInstance = new MemoryDatabase();
    isInMemoryFallback = true;
    return dbInstance;
  }
}

function getDB() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Please call connectDB() first.');
  }
  return dbInstance;
}

module.exports = {
  connectDB,
  getDB,
  ObjectId,
  isFallback: () => isInMemoryFallback,
};
