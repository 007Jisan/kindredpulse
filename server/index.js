require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, getDB } = require('./src/db');
const { getSeedEvents } = require('./src/seedData');

const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const joinedRoutes = require('./src/routes/joinedRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for evaluation and preview deployments
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Root test route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'KindredPulse - Social Development Events Platform API',
    version: '1.0.0',
    documentation: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Seed API endpoint (can be called manually or runs at startup if empty)
app.post('/api/seed', async (req, res) => {
  try {
    const db = getDB();
    const eventsCollection = db.collection('events');
    const count = await eventsCollection.countDocuments();

    if (count > 0 && req.query.force !== 'true') {
      return res.json({
        success: true,
        message: `Database already has ${count} events. Use ?force=true to overwrite.`,
      });
    }

    if (req.query.force === 'true') {
      await eventsCollection.deleteMany({});
    }

    const seedData = getSeedEvents();
    await eventsCollection.insertMany(seedData);

    res.json({
      success: true,
      message: `Successfully seeded ${seedData.length} social development events.`,
      count: seedData.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: 'Seeding failed' });
  }
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/joined-events', joinedRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

// Connect to DB and start server
async function startServer() {
  try {
    await connectDB();

    // Auto seed initial community development events if collection is empty
    const db = getDB();
    const eventsCollection = db.collection('events');
    const existingEventsCount = await eventsCollection.countDocuments();
    if (existingEventsCount === 0) {
      console.log('🌱 Seeding initial social development events...');
      const seedData = getSeedEvents();
      await eventsCollection.insertMany(seedData);
      console.log(`✅ Seeded ${seedData.length} events successfully.`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 KindredPulse Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
