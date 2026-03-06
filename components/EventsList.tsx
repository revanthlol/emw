"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, CATEGORIES, KANBAN_COLS, fadeUp, scaleIn, fmt, fmtCur, pct } from "@/app/page";
import type { Event } from "@/lib/storage";

export function EventsList({ events, onViewEvent, onCreateEvent }: { events: Event[]; onViewEvent: (e: Event) => void; onCreateEvent: () => void }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = events.filter(e =>
    (cat === "All" || e.category === cat) &&
    (status === "All" || e.status === status) &&
    (e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()))
  );

  const selectCls = "px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-slate-300 cursor-pointer focus:outline-none focus:border-amber-500/40 transition-colors";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-7">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-100 tracking-tight">Events</h1>
          <p className="text-slate-500 text-sm mt-1.5">{filtered.length} of {events.length} events</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button className="bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20 px-5 h-10" onClick={onCreateEvent}>+ New Event</Button>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-3 mb-6 flex-wrap">
        <Input className="flex-1 min-w-48 bg-white/5 border-white/8 text-slate-100 placeholder:text-slate-600 rounded-xl focus:border-amber-500/40" placeholder="🔍  Search events..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className={selectCls} value={cat} onChange={e => setCat(e.target.value)}>
          <option value="All" className="bg-slate-800">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
        </select>
        <select className={selectCls} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="All" className="bg-slate-800">All Status</option>
          {KANBAN_COLS.map(c => <option key={c.id} value={c.id} className="bg-slate-800">{c.label}</option>)}
        </select>
        <div className="flex gap-1.5">
          {(["grid","list"] as const).map(m => (
            <motion.button key={m} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(m)}
              style={{ padding: "8px 14px", background: viewMode === m ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${viewMode === m ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: viewMode === m ? "#F59E0B" : "#64748B", cursor: "pointer", fontSize: 14, transition: "background 0.2s, border-color 0.2s" }}>
              {m === "grid" ? "⊞" : "☰"}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-20 text-slate-600">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-semibold">No events found</div>
            <p className="text-sm mt-1">Try adjusting your filters or create a new event.</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div key="grid" className="grid grid-cols-3 gap-5" initial="hidden" animate="visible" exit={{ opacity: 0 }}>
            {filtered.map((ev, i) => {
              const fill = pct(ev.attendees.length, ev.capacity);
              return (
                <motion.div key={ev.id} custom={i} variants={scaleIn} layout
                  onClick={() => onViewEvent(ev)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ y: -4, boxShadow: `0 12px 32px ${ev.color}15`, borderColor: `${ev.color}35` }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                  <div className="p-5" style={{ background: `linear-gradient(135deg, ${ev.color}10, transparent)`, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{ev.emoji}</span>
                      <StatusBadge status={ev.status} />
                    </div>
                    <div className="mt-3 text-slate-100 font-bold text-base">{ev.title}</div>
                    <div className="text-slate-500 text-xs mt-1">{ev.category}</div>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-3 mb-3">
                      <span className="text-slate-500 text-xs">📅 {fmt(ev.date)}</span>
                      <span className="text-slate-500 text-xs">📍 {ev.location.split(",")[0]}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600 text-xs">Fill</span>
                      <span className="text-xs font-bold" style={{ color: ev.color }}>{fill}%</span>
                    </div>
                    <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${fill}%` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
                        style={{ background: `linear-gradient(90deg, ${ev.color}55, ${ev.color})` }} />
                    </div>
                    <div className="flex justify-between mt-3">
                      <span className="text-amber-400 font-bold text-sm">{fmtCur(ev.attendees.length * ev.price)}</span>
                      <span className="text-slate-500 text-xs">{ev.attendees.length}/{ev.capacity}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="list" className="glass-card overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {filtered.map((ev, i) => (
              <motion.div key={ev.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                onClick={() => onViewEvent(ev)}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
                style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${ev.color}18`, border: `1px solid ${ev.color}25` }}>{ev.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 font-semibold">{ev.title}</div>
                  <div className="text-slate-600 text-xs">{ev.category} · {ev.location}</div>
                </div>
                <div className="text-slate-400 text-sm w-28">{fmt(ev.date)}</div>
                <div className="text-slate-200 text-sm font-semibold w-20">{ev.attendees.length}/{ev.capacity}</div>
                <div className="text-amber-400 font-bold text-sm w-24 text-right">{fmtCur(ev.attendees.length * ev.price)}</div>
                <div className="w-24 text-right"><StatusBadge status={ev.status} /></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
