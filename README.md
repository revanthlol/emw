# ⬡ EventForge — Event Management Platform

A modern, full-featured event management dashboard built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**. Features a premium glassmorphism dark UI with smooth animations throughout.

![EventForge Dashboard](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js) ![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4)

---

## ✨ Features

### Core Functionality
- **Dashboard** — At-a-glance overview with revenue, attendee count, published events, and fill rate stats
- **Event CRUD** — Create, edit, and delete events with full form validation
- **Kanban Board** — Drag-and-drop to change event status (Draft → Published → Sold Out → Completed)
- **Calendar View** — Monthly calendar with event indicators and month navigation
- **Events List** — Grid/list toggle with search, category, and status filters
- **Analytics** — Revenue breakdown by category, status distribution, and top events ranking
- **Attendee Management** — Add/remove attendees with ticket types (VIP, General, Standard)

### Design & UX
- 🌑 **Premium Dark Theme** — Deep navy/slate palette with glassmorphism card effects
- ✨ **Framer Motion Animations** — Page transitions, staggered card entrances, animated progress bars, spring-physics toast notifications
- 🎯 **layoutId Active Indicator** — Sidebar nav indicator smoothly slides between items
- 📱 **Responsive Layout** — Fixed sidebar with scrollable content area
- 🖋️ **Typography** — Playfair Display (headings) + DM Sans (body) from Google Fonts

### Technical
- 💾 **LocalStorage Persistence** — All event data persists across sessions (no backend required)
- 📦 **Modular Components** — Clean component architecture with shared animation variants
- 🏗️ **TypeScript** — Fully typed with strict mode
- ⚡ **Turbopack** — Lightning-fast dev builds via Next.js Turbopack

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd emw

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
emw/
├── app/
│   ├── globals.css         # Tailwind v4 + glassmorphism design system
│   ├── layout.tsx          # Root layout with font loading
│   └── page.tsx            # Root component with page transitions
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Dialog, Tabs, etc.)
│   ├── Sidebar.tsx         # Navigation with animated active indicator
│   ├── Dashboard.tsx       # Stats overview + events table
│   ├── EventsList.tsx      # Filterable grid/list view
│   ├── KanbanBoard.tsx     # Drag-and-drop status board
│   ├── CalendarView.tsx    # Monthly calendar
│   ├── Analytics.tsx       # Charts and rankings
│   ├── EventFormModal.tsx  # Create/edit event form
│   └── EventDetailModal.tsx# Event details + attendee management
└── lib/
    ├── storage.ts          # LocalStorage CRUD operations
    └── utils.ts            # Tailwind merge utility
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (Turbopack) |
| UI Library | React 19.2 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 11 |
| Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Language | TypeScript 5 |
| Storage | Browser LocalStorage |

---

## 📄 License

This project is for educational/demonstration purposes.
