"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatusBadge, fadeUp, fmt, fmtCur, pct } from "@/app/page";
import type { Event } from "@/lib/storage";

export function Dashboard({ events, onViewEvent, onCreateEvent }: { events: Event[]; onViewEvent: (e: Event) => void; onCreateEvent: () => void }) {
  const totalRevenue = events.reduce((s, e) => s + e.attendees.length * e.price, 0);
  const totalAttendees = events.reduce((s, e) => s + e.attendees.length, 0);
  const upcoming = events.filter(e => e.status === "published").length;
  const avgFill = events.length ? Math.round(events.reduce((s, e) => s + pct(e.attendees.length, e.capacity), 0) / events.length) : 0;

  const stats = [
    { label: "Total Revenue", value: fmtCur(totalRevenue), icon: "💰", color: "#F59E0B", gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))" },
    { label: "Total Attendees", value: totalAttendees.toLocaleString(), icon: "👥", color: "#3B82F6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))" },
    { label: "Published Events", value: String(upcoming), icon: "📢", color: "#8B5CF6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.03))" },
    { label: "Avg Fill Rate", value: `${avgFill}%`, icon: "📊", color: "#10B981", gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.03))" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-100 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-1.5">Welcome back. Here&apos;s your event summary.</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button className="bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20 px-5 h-10" onClick={onCreateEvent}>+ New Event</Button>
        </motion.div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ y: -4, boxShadow: `0 12px 32px ${s.color}18` }}
            className="glass-card rounded-2xl p-5 relative overflow-hidden cursor-default"
            style={{ background: s.gradient }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[40px]" style={{ background: `${s.color}06` }} />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{s.icon}</span>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="font-display text-3xl font-black text-slate-100 tracking-tight">{s.value}</div>
            <div className="h-0.5 mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)`, width: "60%" }} />
          </motion.div>
        ))}
      </div>

      {/* Events Table */}
      {events.length === 0 ? (
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className="glass-card p-16 text-center"
        >
          <div className="text-5xl mb-4">🎯</div>
          <div className="text-slate-300 font-semibold text-lg mb-2">No events yet</div>
          <p className="text-slate-600 text-sm mb-5">Create your first event to get started.</p>
          <Button className="bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold" onClick={onCreateEvent}>+ Create First Event</Button>
        </motion.div>
      ) : (
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6 flex justify-between items-center">
            <div className="font-semibold text-slate-100">All Events</div>
            <span className="text-slate-500 text-sm">{events.length} total</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.25)" }}>
                {["Event","Date","Location","Attendees","Revenue","Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-slate-600 text-xs font-bold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <motion.tr key={ev.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  onClick={() => onViewEvent(ev)}
                  className="cursor-pointer transition-colors"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${ev.color}18`, border: `1px solid ${ev.color}25` }}>{ev.emoji}</div>
                      <div>
                        <div className="text-slate-200 font-semibold text-sm">{ev.title}</div>
                        <div className="text-slate-600 text-xs">{ev.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-sm">{fmt(ev.date)}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-sm">{ev.location.split(",")[0]}</td>
                  <td className="px-5 py-3.5 text-slate-200 text-sm font-semibold">{ev.attendees.length}/{ev.capacity}</td>
                  <td className="px-5 py-3.5 text-amber-400 text-sm font-bold">{fmtCur(ev.attendees.length * ev.price)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={ev.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
