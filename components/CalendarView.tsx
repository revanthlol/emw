"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fmt } from "@/app/page";
import type { Event } from "@/lib/storage";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function CalendarView({ events, onViewEvent }: { events: Event[]; onViewEvent: (e: Event) => void }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const dir = useRef(1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const byDay: Record<number, Event[]> = {};
  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(ev);
    }
  });

  const prev = () => { dir.current = -1; if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { dir.current = 1; if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const today = now.getDate();
  const isThisMonth = now.getMonth() === month && now.getFullYear() === year;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2 } }),
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-7">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-100 tracking-tight">Calendar</h1>
          <p className="text-slate-500 text-sm mt-1.5">Monthly event schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={prev}
            className="w-10 h-10 rounded-xl border border-white/8 bg-white/4 text-slate-400 hover:bg-white/8 transition-colors text-lg flex items-center justify-center">‹</motion.button>
          <div className="text-slate-100 font-bold text-base w-44 text-center">{MONTHS[month]} {year}</div>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={next}
            className="w-10 h-10 rounded-xl border border-white/8 bg-white/4 text-slate-400 hover:bg-white/8 transition-colors text-lg flex items-center justify-center">›</motion.button>
        </div>
      </motion.div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-7 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {WEEKDAYS.map(d => <div key={d} className="py-3.5 text-center text-slate-600 text-xs font-bold uppercase tracking-wider">{d}</div>)}
        </div>
        <AnimatePresence mode="wait" custom={dir.current}>
          <motion.div key={`${month}-${year}`} custom={dir.current} variants={slideVariants} initial="enter" animate="center" exit="exit" className="grid grid-cols-7">
            {cells.map((day, i) => {
              const evs = day ? (byDay[day] || []) : [];
              const isToday = isThisMonth && day === today;
              return (
                <div key={i} className="min-h-[6.5rem] p-2 transition-colors" style={{
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  background: isToday ? "rgba(245,158,11,0.04)" : "transparent",
                }}>
                  {day && (
                    <>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 text-sm font-semibold ${isToday ? "bg-amber-500 text-slate-900 font-black shadow-lg shadow-amber-500/30" : "text-slate-500"}`}>{day}</div>
                      {evs.slice(0, 2).map(ev => (
                        <motion.div key={ev.id} onClick={() => onViewEvent(ev)}
                          whileHover={{ scale: 1.03 }}
                          className="rounded-md px-1.5 py-0.5 mb-1 text-xs font-semibold cursor-pointer truncate"
                          style={{ background: `${ev.color}18`, border: `1px solid ${ev.color}30`, color: ev.color }}>
                          {ev.title}
                        </motion.div>
                      ))}
                      {evs.length > 2 && <div className="text-slate-600 text-xs pl-1">+{evs.length - 2} more</div>}
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
