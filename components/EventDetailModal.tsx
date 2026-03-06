"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, fmt, fmtCur, pct } from "@/app/page";
import { addAttendee, removeAttendee, type Event, type Attendee } from "@/lib/storage";

// ─── Add Attendee Modal (internal) ─────────────────────────────────────────────
function AddAttendeeModal({ open, onClose, eventId, onSave }: { open: boolean; onClose: () => void; eventId: string; onSave: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", ticket: "General" as Attendee["ticket"] });
  const [err, setErr] = useState({ name: "", email: "" });

  const handleAdd = () => {
    const e = { name: "", email: "" };
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Invalid email";
    setErr(e);
    if (e.name || e.email) return;
    addAttendee(eventId, { name: form.name.trim(), email: form.email.trim(), ticket: form.ticket });
    setForm({ name: "", email: "", ticket: "General" });
    onSave();
    onClose();
  };

  const inputCls = "bg-white/4 border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/40 rounded-xl";
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-slate-900/95 backdrop-blur-xl border-white/8 text-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader><DialogTitle className="text-slate-100">Add Attendee</DialogTitle></DialogHeader>
        <div className="grid gap-3 mt-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Name *</Label>
            <Input className={inputCls} placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            {err.name && <p className="text-red-400 text-xs mt-1">{err.name}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Email *</Label>
            <Input className={inputCls} type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {err.email && <p className="text-red-400 text-xs mt-1">{err.email}</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Ticket Type</Label>
            <select className="w-full mt-1 px-3 py-2 rounded-xl text-sm bg-white/4 border border-white/8 text-slate-100 cursor-pointer" value={form.ticket} onChange={e => setForm(f => ({ ...f, ticket: e.target.value as Attendee["ticket"] }))}>
              <option value="General" className="bg-slate-800">General</option>
              <option value="Standard" className="bg-slate-800">Standard</option>
              <option value="VIP" className="bg-slate-800">VIP</option>
            </select>
          </motion.div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 border-white/8 text-slate-400 rounded-xl" onClick={onClose}>Cancel</Button>
            <motion.div className="flex-[2]" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20" onClick={handleAdd}>Add →</Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Event Detail Modal ────────────────────────────────────────────────────────
export function EventDetailModal({ event, onClose, onEdit, onDelete, onRefresh }: {
  event: Event; onClose: () => void; onEdit: () => void; onDelete: () => void; onRefresh: () => void;
}) {
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const fill = pct(event.attendees.length, event.capacity);
  const revenue = event.attendees.length * event.price;

  const handleRemoveAttendee = (aid: string) => {
    removeAttendee(event.id, aid);
    onRefresh();
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-xl border-white/8 text-slate-100 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${event.color}15`, border: `1px solid ${event.color}30`, boxShadow: `0 4px 16px ${event.color}15` }}>
                {event.emoji}
              </motion.div>
              <div>
                <DialogTitle className="font-display text-xl text-slate-100">{event.title}</DialogTitle>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className="text-slate-500 text-sm">{event.category}</span>
                  <StatusBadge status={event.status} />
                </div>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-3">
            <TabsList className="bg-white/4 border border-white/8 rounded-xl">
              <TabsTrigger value="details" className="data-[state=active]:bg-white/8 text-slate-400 data-[state=active]:text-slate-100 rounded-lg">Details</TabsTrigger>
              <TabsTrigger value="attendees" className="data-[state=active]:bg-white/8 text-slate-400 data-[state=active]:text-slate-100 rounded-lg">
                Attendees ({event.attendees.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Date", value: fmt(event.date) },
                  { label: "Time", value: event.time || "—" },
                  { label: "Location", value: event.location },
                  { label: "Ticket Price", value: fmtCur(event.price) },
                  { label: "Revenue", value: fmtCur(revenue) },
                  { label: "Capacity", value: `${event.attendees.length} / ${event.capacity}` },
                ].map(({ label, value }, i) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white/3 rounded-xl p-3.5 border border-white/5">
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-slate-200 text-sm font-semibold">{value}</div>
                  </motion.div>
                ))}
              </div>

              {event.description && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="bg-white/3 rounded-xl p-3.5 border border-white/5 mb-4">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Description</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Registration Fill</span>
                  <span className="text-sm font-bold" style={{ color: event.color }}>{fill}%</span>
                </div>
                <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${fill}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    style={{ background: `linear-gradient(90deg, ${event.color}77, ${event.color})` }} />
                </div>
              </motion.div>

              <div className="flex gap-3">
                <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full border-white/8 text-slate-400 hover:bg-white/5 rounded-xl" onClick={onEdit}>✏️ Edit Event</Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="border-red-500/25 text-red-400 hover:bg-red-500/10 rounded-xl" onClick={onDelete}>🗑️ Delete</Button>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="attendees" className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-slate-400 text-sm">{event.attendees.length} registered</span>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold text-xs h-8 rounded-lg shadow-lg shadow-amber-500/15"
                    onClick={() => setShowAddAttendee(true)}
                    disabled={event.attendees.length >= event.capacity}>
                    + Add Attendee
                  </Button>
                </motion.div>
              </div>
              {event.attendees.length === 0 ? (
                <div className="text-center py-8 text-slate-600">No attendees yet. Add the first one!</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {event.attendees.map((att, i) => (
                    <motion.div key={att.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 bg-white/3 rounded-xl p-3 border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-lg shadow-indigo-500/20">
                        {att.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-200 text-sm font-semibold truncate">{att.name}</div>
                        <div className="text-slate-500 text-xs truncate">{att.email}</div>
                      </div>
                      <span style={{ background: att.ticket === "VIP" ? "rgba(245,158,11,0.12)" : "rgba(99,102,241,0.12)", color: att.ticket === "VIP" ? "#FCD34D" : "#A5B4FC", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                        {att.ticket}
                      </span>
                      <button onClick={() => handleRemoveAttendee(att.id)} className="text-slate-600 hover:text-red-400 text-xs ml-1 transition-colors">✕</button>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showAddAttendee && (
        <AddAttendeeModal open={showAddAttendee} onClose={() => setShowAddAttendee(false)} eventId={event.id} onSave={onRefresh} />
      )}
    </>
  );
}
