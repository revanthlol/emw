"use client";

import { motion } from "framer-motion";
import { KANBAN_COLS, fadeUp, fmtCur } from "@/app/page";
import type { Event } from "@/lib/storage";

const colors = ["#F59E0B","#3B82F6","#8B5CF6","#10B981","#EC4899","#6366F1","#64748B"];

export function Analytics({ events }: { events: Event[] }) {
  const totalRevenue = events.reduce((s, e) => s + e.attendees.length * e.price, 0);
  const byCat: Record<string, number> = {};
  events.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.attendees.length * e.price; });
  const maxRev = Math.max(...Object.values(byCat), 1);
  const byStatus: Record<string, number> = {};
  events.forEach(e => { byStatus[e.status] = (byStatus[e.status] || 0) + 1; });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="font-display text-4xl font-black text-slate-100 tracking-tight">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1.5">Performance insights across all events</p>
      </motion.div>

      {events.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 text-slate-600">
          <div className="text-4xl mb-3">📊</div>
          <div className="font-semibold">No data yet</div>
          <p className="text-sm mt-1">Create events to see analytics.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {/* Revenue by Category */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-6">
            <div className="text-slate-100 font-semibold mb-5">Revenue by Category</div>
            <div className="space-y-4">
              {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, rev], i) => (
                <div key={cat}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400 text-sm">{cat}</span>
                    <span className="text-slate-200 text-sm font-bold">{fmtCur(rev)}</span>
                  </div>
                  <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(rev / maxRev) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      style={{ background: `linear-gradient(90deg, ${colors[i % colors.length]}88, ${colors[i % colors.length]})` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status Breakdown */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-6">
            <div className="text-slate-100 font-semibold mb-5">Events by Status</div>
            <div className="space-y-4">
              {KANBAN_COLS.map((col, i) => {
                const count = byStatus[col.id] || 0;
                return (
                  <div key={col.id}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span>{col.icon}</span>
                        <span className="text-slate-400 text-sm">{col.label}</span>
                      </div>
                      <span className="text-slate-200 text-sm font-bold">{count}</span>
                    </div>
                    <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${events.length ? (count / events.length) * 100 : 0}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                        style={{ background: `linear-gradient(90deg, ${col.color}88, ${col.color})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Top Events */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-6 col-span-2">
            <div className="text-slate-100 font-semibold mb-5">Top Events by Revenue</div>
            <div className="space-y-4">
              {[...events].sort((a, b) => (b.attendees.length * b.price) - (a.attendees.length * a.price)).slice(0, 5).map((ev, i) => {
                const rev = ev.attendees.length * ev.price;
                const topRev = Math.max(...events.map(e => e.attendees.length * e.price), 1);
                return (
                  <motion.div key={ev.id} className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.4 }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: i === 0 ? "linear-gradient(135deg, #F59E0B, #EF4444)" : "rgba(255,255,255,0.06)", color: i === 0 ? "#0F172A" : "#64748B", boxShadow: i === 0 ? "0 4px 12px rgba(245,158,11,0.3)" : "none" }}>{i + 1}</div>
                    <div className="flex-1">
                      <div className="text-slate-200 text-sm font-semibold mb-1.5">{ev.title}</div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(rev / topRev) * 100}%` }}
                          transition={{ delay: i * 0.08 + 0.5, duration: 0.7, ease: "easeOut" }}
                          style={{ background: `linear-gradient(90deg, ${ev.color}55, ${ev.color})` }} />
                      </div>
                    </div>
                    <div className="text-amber-400 font-black text-base min-w-24 text-right">{fmtCur(rev)}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
