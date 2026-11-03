# Assignment 8: KindredPulse — Social Development Events Platform
**Batch**: B14 | **Assignment**: A8 | **Category**: Hermione

> A community-driven event management platform where users create, join, and track social service events in their local area (e.g., Winter Clothes Distribution – Mirpur 10, Blanket Distribution for the Needy – Mohammadpur).

---

## 🔗 Submission Details

- **Live Site Link**: [https://kindredpulse-client.vercel.app](https://kindredpulse-client.vercel.app)
- **GitHub Repository (Client)**: [https://github.com/jisan/kindredpulse-client](https://github.com/jisan/kindredpulse-client)
- **GitHub Repository (Server)**: [https://github.com/jisan/kindredpulse-server](https://github.com/jisan/kindredpulse-server)

---

## 📁 Repository Structure
```
Assignment 8/
├── client/          # Next.js App Router (15+ Git Commits)
│   ├── app/         # App router pages (Home, Events, Details, Create, Manage, Joined, Profile, Auth)
│   ├── components/  # Navbar, Footer, EventCard, Skeletons, ThemeToggle, AuthGuard
│   ├── context/     # AuthContext, ThemeProvider
│   ├── lib/         # API Client, TypeScript Interfaces
│   └── README.md    # Client documentation & live site link
└── server/          # Express.js REST API (8+ Git Commits)
    ├── src/         # DB layer, Auth middleware, Seed data, Modular routes
    ├── index.js     # Express application entrypoint
    └── README.md    # API documentation & endpoints guide
```

---

## 🌟 Highlighted Highlights & Assignment Compliance

- ✅ **No Lorem Ipsum**: 100% authentic, meaningful community service copy throughout.
- ✅ **No Default Alerts**: Replaced entirely with SweetAlert2 modals and React Hot Toast notifications.
- ✅ **SPA Route Persistence**: Preserves session state on reload of all private routes without premature redirection to login.
- ✅ **Theme Customization**: Dark / Light mode toggle affecting the entire interface with local persistence.
- ✅ **Password Validation**: Enforces uppercase, lowercase, and minimum 6 characters with real-time visual feedback and toasts.
- ✅ **MongoDB `.limit(6)`**: Home page dynamically loads 6 recent upcoming events from the database.
- ✅ **Strict Temporal Guard**: Create and update forms enforce that event dates must strictly be in the future.
- ✅ **Owner Authorization**: Users can only update or delete their own created events (checked frontend and backend via JWT).
- ✅ **Sorted Joined Events**: Displays events joined by the logged-in user, sorted chronologically by event date.
- ✅ **Optional Features Completed**:
  1. Shimmer loading skeletons across all pages.
  2. Volunteer Profile view & update feature.
  3. Live search, category filtering, and one-click social sharing (with official new X logo).
- ✅ **GitHub Commits**: 15+ notable commits on client, 8+ notable commits on server.
