"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  loadEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  addAttendee,
  removeAttendee,
  moveEventStatus,
  type Event,
  type EventStatus,
  type EventCategory,
  type Attendee,
} from "@/lib/storage";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { EventsList } from "@/components/EventsList";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CalendarView } from "@/components/CalendarView";
import { Analytics } from "@/components/Analytics";
import { EventFormModal } from "@/components/EventFormModal";
import { EventDetailModal } from "@/components/EventDetailModal";

export type View = "dashboard" | "events" | "kanban" | "calendar" | "analytics";

export const CATEGORIES: EventCategory[] = [
  "Conference","Workshop","Networking","Concert","Gala","Sports","Other",
];

export const KANBAN_COLS: { id: EventStatus; label: string; color: string; icon: string }[] = [
  { id: "draft",     label: "Draft",     color: "#64748B", icon: "✏️" },
  { id: "published", label: "Published", color: "#3B82F6", icon: "📢" },
  { id: "sold-out",  label: "Sold Out",  color: "#F59E0B", icon: "🔥" },
  { id: "completed", label: "Completed", color: "#10B981", icon: "✅" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const fmtCur = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

// Shared animation variants
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: EASE } }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.05, duration: 0.35, ease: EASE } }),
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── Status Badge (shared) ────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    draft:     { bg: "rgba(100,116,139,0.15)", color: "#94A3B8", label: "Draft" },
    published: { bg: "rgba(59,130,246,0.15)",  color: "#60A5FA", label: "Published" },
    "sold-out":{ bg: "rgba(245,158,11,0.15)",  color: "#FCD34D", label: "Sold Out" },
    completed: { bg: "rgba(16,185,129,0.15)",  color: "#34D399", label: "Completed" },
    confirmed: { bg: "rgba(16,185,129,0.15)",  color: "#34D399", label: "Confirmed" },
    pending:   { bg: "rgba(245,158,11,0.15)",  color: "#FCD34D", label: "Pending" },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<{ id: string; form: EventFormData } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEvents(loadEvents());
  }, []);

  const refresh = useCallback(() => {
    setEvents(loadEvents());
    if (selectedEvent) {
      const updated = loadEvents().find(e => e.id === selectedEvent.id);
      setSelectedEvent(updated || null);
    }
  }, [selectedEvent]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateSave = () => { refresh(); showToast("🎉 Event created!"); };
  const handleEditSave = () => { refresh(); showToast("✅ Event updated!"); };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setSelectedEvent(null);
    refresh();
    showToast("🗑️ Event deleted.");
  };

  const handleEditEvent = (ev: Event) => {
    setSelectedEvent(null);
    setEditingEvent({
      id: ev.id,
      form: {
        title: ev.title, category: ev.category, date: ev.date, time: ev.time,
        location: ev.location, capacity: String(ev.capacity), price: String(ev.price),
        description: ev.description, status: ev.status,
      },
    });
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar active={view} setActive={setView} />

      <main style={{ marginLeft: 232, padding: "36px 44px", minHeight: "100vh" }}>
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ position: "fixed", top: 24, right: 24, background: "linear-gradient(135deg, #10B981, #059669)", color: "white", padding: "14px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14, zIndex: 999, boxShadow: "0 8px 32px rgba(16,185,129,0.35)" }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div key={view} {...pageTransition}>
            {view === "dashboard" && <Dashboard events={events} onViewEvent={setSelectedEvent} onCreateEvent={() => setShowCreate(true)} />}
            {view === "events"    && <EventsList events={events} onViewEvent={setSelectedEvent} onCreateEvent={() => setShowCreate(true)} />}
            {view === "kanban"    && <KanbanBoard events={events} onViewEvent={setSelectedEvent} onCreateEvent={() => setShowCreate(true)} onRefresh={refresh} />}
            {view === "calendar"  && <CalendarView events={events} onViewEvent={setSelectedEvent} />}
            {view === "analytics" && <Analytics events={events} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <EventFormModal open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreateSave} />

      {editingEvent && (
        <EventFormModal open onClose={() => setEditingEvent(null)} initial={editingEvent.form} eventId={editingEvent.id} onSave={handleEditSave} />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => handleEditEvent(selectedEvent)}
          onDelete={() => handleDeleteEvent(selectedEvent.id)}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}

// Re-export the form data type for use in other components
export type EventFormData = {
  title: string; category: EventCategory; date: string; time: string;
  location: string; capacity: string; price: string; description: string; status: EventStatus;
};

export const EMPTY_FORM: EventFormData = {
  title: "", category: "Conference", date: "", time: "09:00",
  location: "", capacity: "100", price: "0", description: "", status: "draft",
};
