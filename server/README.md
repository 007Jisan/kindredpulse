# KindredPulse Server 🚀

Backend REST API for **KindredPulse**, a community-driven social development event management platform where citizens create, join, and track local social service initiatives.

## 🌟 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Native MongoDB Driver v6 with seamless local fallback)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Middleware**: CORS, Cookie Parser, Custom Auth Guards

---

## 🔑 Key Features
1. **JWT Protected Routes**: Strict token verification protects event creation, updating, deletion, and profile management.
2. **Strict Future-Date Guard**: Validates that all created and updated events have dates strictly in the future.
3. **Owner Authorization**: Ensures only the creator of an event can update or delete it.
4. **Participants Tracking**: Users can join upcoming events with one click; duplicate joins are blocked.
5. **Dynamic Home Feed with MongoDB `.limit()`**: Returns upcoming events sorted by date.
6. **Self-Healing / Dual-Mode Database**: Directly integrates with MongoDB Atlas or falls back seamlessly to an offline store when credentials are not configured.

---

## 🛠️ Environment Variables
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kindredpulse?retryWrites=true&w=majority
DB_NAME=kindredpulse
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new account with email, name, photoURL, and password (enforces uppercase, lowercase, >= 6 chars).
- `POST /api/auth/login` - Authenticate using email and password.
- `POST /api/auth/google` - Social login with Google.
- `GET /api/auth/me` - [Protected] Fetch current authenticated user.
- `PUT /api/auth/profile` - [Protected] Update user profile (name, photoURL, bio, phone).

### Events (`/api/events`)
- `GET /api/events` - Retrieve upcoming events (supports `?limit=6`, `?category=`, `?search=`).
- `GET /api/events/:id` - Retrieve full event details and participant list.
- `GET /api/events/user/:email` - [Protected] Retrieve events created by the logged-in user.
- `POST /api/events` - [Protected] Create a new event (future date enforced).
- `PUT /api/events/:id` - [Protected] Update event (only by creator).
- `DELETE /api/events/:id` - [Protected] Delete event (only by creator).

### Joined Events (`/api/joined-events`)
- `POST /api/joined-events` - [Protected] Join an upcoming event.
- `GET /api/joined-events` - [Protected] Retrieve all events joined by current user (sorted by date).
- `DELETE /api/joined-events/:id` - [Protected] Cancel participation.

### Utilities
- `GET /api/health` - Server health status.
- `POST /api/seed` - Seed community events.

---

## 🚀 Running Locally
```bash
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

---

## ⚡ Deploying to Vercel
1. Import this `server` repository into Vercel.
2. Under **Environment Variables**, add:
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.a7wsplt.mongodb.net/kindredpulse?retryWrites=true&w=majority`
   - `DB_NAME`: `kindredpulse`
   - `JWT_SECRET`: your secret string
   - `CLIENT_URL`: your client's Vercel URL
3. Deploy! Vercel will automatically route all requests through `vercel.json` and `api/index.js`.
