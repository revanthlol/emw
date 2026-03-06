export type EventStatus = "draft" | "published" | "sold-out" | "completed";
export type EventCategory =
  | "Conference"
  | "Workshop"
  | "Networking"
  | "Concert"
  | "Gala"
  | "Sports"
  | "Other";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticket: "VIP" | "General" | "Standard";
  registeredAt: string;
}

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
  description: string;
  status: EventStatus;
  attendees: Attendee[];
  createdAt: string;
  color: string;
  emoji: string;
}

const KEY = "emw_events";

const COLORS: Record<EventCategory, string> = {
  Conference: "#3B82F6",
  Workshop: "#8B5CF6",
  Networking: "#10B981",
  Concert: "#EC4899",
  Gala: "#F59E0B",
  Sports: "#22C55E",
  Other: "#64748B",
};

const EMOJIS: Record<EventCategory, string> = {
  Conference: "🎯",
  Workshop: "🎨",
  Networking: "🤝",
  Concert: "🎷",
  Gala: "🥂",
  Sports: "🏃",
  Other: "🎉",
};

export function getColor(cat: EventCategory) {
  return COLORS[cat] || "#64748B";
}
export function getEmoji(cat: EventCategory) {
  return EMOJIS[cat] || "🎉";
}

export function loadEvents(): Event[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: Event[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function createEvent(data: Omit<Event, "id" | "createdAt" | "attendees" | "color" | "emoji">): Event {
  const event: Event = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    attendees: [],
    color: getColor(data.category),
    emoji: getEmoji(data.category),
  };
  const events = loadEvents();
  saveEvents([event, ...events]);
  return event;
}

export function updateEvent(id: string, data: Partial<Event>): void {
  const events = loadEvents().map((e) =>
    e.id === id
      ? {
          ...e,
          ...data,
          color: data.category ? getColor(data.category) : e.color,
          emoji: data.category ? getEmoji(data.category) : e.emoji,
        }
      : e
  );
  saveEvents(events);
}

export function deleteEvent(id: string): void {
  saveEvents(loadEvents().filter((e) => e.id !== id));
}

export function addAttendee(eventId: string, attendee: Omit<Attendee, "id" | "registeredAt">): void {
  const events = loadEvents().map((e) => {
    if (e.id !== eventId) return e;
    if (e.attendees.length >= e.capacity) return e;
    const newAttendee: Attendee = {
      ...attendee,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
    };
    return { ...e, attendees: [...e.attendees, newAttendee] };
  });
  saveEvents(events);
}

export function removeAttendee(eventId: string, attendeeId: string): void {
  const events = loadEvents().map((e) =>
    e.id === eventId
      ? { ...e, attendees: e.attendees.filter((a) => a.id !== attendeeId) }
      : e
  );
  saveEvents(events);
}

export function moveEventStatus(id: string, status: EventStatus): void {
  updateEvent(id, { status });
}
