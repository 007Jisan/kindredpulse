# KindredPulse — Community Social Development & Service Platform 🌍

**Live Application URL**: [https://kindredpulse-client.vercel.app](https://kindredpulse-client.vercel.app)  
*(Deployed on Vercel)*

KindredPulse is a modern, community-driven social development event management platform where everyday citizens unite to initiate, organize, and participate in grassroots humanitarian and environmental service events across their local neighborhoods.

---

## 🌟 Top 5 Core Features

1. **Hyper-Local Social Event Discovery & Creation**:
   Local volunteers and organizers can browse and publish localized initiatives—such as winter jacket drives in Mirpur 10, nighttime fleece blanket distribution in Mohammadpur, tree planting at Dhanmondi Lake, and riverbank cleanups—with automatic organizer verification and rich event previews.

2. **Strict Chronological Date Guard**:
   An intelligent temporal validation system on both client and server ensures events can only be scheduled in the future, automatically preventing past dates from being submitted and keeping the upcoming event feed 100% relevant and actionable.

3. **Role-Aware Self-Service Organizer Dashboard**:
   Organizers enjoy full self-service authority to view, update, and delete only their own hosted events through secure JWT authorization checks, while participants can track their volunteer commitments on a dedicated dashboard sorted by event date.

4. **One-Click Volunteer Participation & Live Attendee Tracking**:
   Authenticated users can commit to joining any upcoming social initiative with a single click, instantly viewing their name and avatar added to the live attendee roster and avoiding duplicate signups.

5. **Universal Theme Engine & Responsive Adaptive UI**:
   Seamless dark and light theme toggle that switches the entire application aesthetics with persistent user preference, accompanied by custom shimmer loading skeletons across every route, zero default browser alerts (replaced with SweetAlert2 & Toast notifications), and compliance with modern branding including the official X logo.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables & animations
- **State & Context**: React Context API (`AuthContext`, `ThemeProvider`)
- **Theme Engine**: `next-themes` (Dark/Light mode support)
- **Alerts & Modals**: `react-hot-toast` & `SweetAlert2`
- **Icons**: `lucide-react` + Custom SVG brand marks (New X Logo)
- **Deployment**: Vercel

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=KindredPulse
```

---

## 📦 Local Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <client-repo-url>
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛡️ Route Access Matrix

| Route | Protection | Description |
|---|---|---|
| `/` | Public | Interactive hero banner, features, 6 recent upcoming events, gallery, and newsletter |
| `/events` | Public | Full grid of upcoming events with category filter and search |
| `/events/[id]` | Public | Detailed view of event mission, meeting point, and attendee list (Join button requires auth) |
| `/login` | Public | Email/Password and Google sign-in with redirect back to previous page |
| `/register` | Public | Account registration with uppercase, lowercase, and length password validation |
| `/create-event` | **Private** | Form to organize a new community initiative with future date validation |
| `/manage-events`| **Private** | Organizer dashboard to edit and delete your hosted initiatives |
| `/joined-events`| **Private** | List of events you joined, sorted chronologically by event date |
| `/profile` | **Private** | View and update volunteer profile, name, avatar URL, bio, and phone |
