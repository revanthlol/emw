"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { KANBAN_COLS, fadeUp, fmt, fmtCur, pct } from "@/app/page";
import { moveEventStatus, type Event, type EventStatus } from "@/lib/storage";

export function KanbanBoard({ events, onViewEvent, onCreateEvent, onRefresh }: {
  events: Event[]; onViewEvent: (e: Event) => void; onCreateEvent: () => void; onRefresh: () => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<EventStatus | null>(null);

  const byStatus = (s: EventStatus) => events.filter(e => e.status === s);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("eventId", id);
  };

  const handleDragOver = (e: React.DragEvent, col: EventStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverCol(col);
  };

  const handleDrop = (e: React.DragEvent, col: EventStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("eventId");
    if (id) {
      moveEventStatus(id, col);
      onRefresh();
    }
    setDraggingId(null);
    setOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setOverCol(null);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-7">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-100 tracking-tight">Kanban Board</h1>
          <p className="text-slate-500 text-sm mt-1.5">Drag & drop to change event status</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button className="bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20 px-5 h-10" onClick={onCreateEvent}>+ New Event</Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-4 gap-5 h-full">
        {KANBAN_COLS.map((col, ci) => {
          const colEvents = byStatus(col.id);
          const isOver = overCol === col.id;
          return (
            <motion.div key={col.id} custom={ci} variants={fadeUp} initial="hidden" animate="visible"
              onDragOver={e => handleDragOver(e, col.id)}
              onDrop={e => handleDrop(e, col.id)}
              onDragLeave={() => setOverCol(null)}
              className="flex flex-col rounded-2xl transition-all"
              style={{
                background: isOver ? `${col.color}06` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isOver ? col.color + "40" : "rgba(255,255,255,0.06)"}`,
                minHeight: 500,
                boxShadow: isOver ? `inset 0 0 30px ${col.color}08` : "none",
              }}>
              {/* Col Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{col.icon}</span>
                  <span className="text-slate-300 font-semibold text-sm">{col.label}</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${col.color}15`, color: col.color }}>{colEvents.length}</span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {colEvents.map((ev, i) => {
                  const fill = pct(ev.attendees.length, ev.capacity);
                  const isDragging = draggingId === ev.id;
                  return (
                    <div key={ev.id}
                      draggable
                      onDragStart={e => handleDragStart(e, ev.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onViewEvent(ev)}
                      className="select-none"
                    >
                      <motion.div layout
                        className="rounded-xl p-3.5 cursor-grab active:cursor-grabbing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isDragging ? 0.5 : 1, y: 0, rotate: isDragging ? 2 : 0 }}
                        whileHover={{ y: -2, boxShadow: `0 8px 24px ${ev.color}12` }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        style={{
                          background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(26,39,68,0.7))",
                          border: `1px solid ${isDragging ? ev.color + "50" : "rgba(255,255,255,0.07)"}`,
                        }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl flex-shrink-0">{ev.emoji}</span>
                          <div className="font-semibold text-slate-100 text-sm leading-tight">{ev.title}</div>
                        </div>
                      </div>
                      <div className="text-slate-600 text-xs mb-2">{ev.category}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span>📅 {fmt(ev.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span>📍 {ev.location.split(",")[0]}</span>
                      </div>
                      <div className="mb-1">
                        <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${fill}%` }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                            style={{ background: `linear-gradient(90deg, ${ev.color}55, ${ev.color})` }} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-slate-600 text-xs">{ev.attendees.length}/{ev.capacity}</span>
                        {ev.price > 0 && <span className="text-amber-400 text-xs font-bold">{fmtCur(ev.attendees.length * ev.price)}</span>}
                      </div>
                      </motion.div>
                    </div>
                  );
                })}
                {colEvents.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10 text-slate-700 text-sm text-center">
                    <div className="text-3xl mb-2">📭</div>
                    Drop events here
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
