"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, KANBAN_COLS, type EventFormData, EMPTY_FORM } from "@/app/page";
import { createEvent, updateEvent, type EventCategory, type EventStatus } from "@/lib/storage";

export function EventFormModal({
  open, onClose, initial, eventId, onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial?: EventFormData;
  eventId?: string;
  onSave: () => void;
}) {
  const [form, setForm] = useState<EventFormData>(initial || EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => { setForm(initial || EMPTY_FORM); setErrors({}); }, [open]);

  const set = (k: keyof EventFormData, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Partial<EventFormData> = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.date) e.date = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = "Must be ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      capacity: Number(form.capacity),
      price: Number(form.price) || 0,
      description: form.description.trim(),
      status: form.status,
    };
    if (eventId) {
      updateEvent(eventId, payload);
    } else {
      createEvent(payload);
    }
    onSave();
    onClose();
  };

  const inputCls = "bg-white/4 border-white/8 text-slate-100 placeholder:text-slate-600 focus:border-amber-500/40 focus:ring-0 rounded-xl";
  const selectCls = "w-full mt-1 px-3 py-2 rounded-xl text-sm bg-white/4 border border-white/8 text-slate-100 focus:outline-none focus:border-amber-500/40 cursor-pointer transition-colors";

  const fields = [
    { delay: 0 }, { delay: 0.03 }, { delay: 0.06 }, { delay: 0.09 }, { delay: 0.12 }, { delay: 0.15 }, { delay: 0.18 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-slate-900/95 backdrop-blur-xl border-white/8 text-slate-100 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-slate-100">
            {eventId ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[0].delay }}>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Title *</Label>
            <Input className={inputCls} placeholder="Annual Tech Summit 2026" value={form.title} onChange={e => set("title", e.target.value)} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[1].delay }} className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs uppercase tracking-wider">Category</Label>
              <select className={selectCls} value={form.category} onChange={e => set("category", e.target.value as EventCategory)}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-slate-400 text-xs uppercase tracking-wider">Status</Label>
              <select className={selectCls} value={form.status} onChange={e => set("status", e.target.value as EventStatus)}>
                {KANBAN_COLS.map(c => <option key={c.id} value={c.id} className="bg-slate-800">{c.label}</option>)}
              </select>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[2].delay }} className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs uppercase tracking-wider">Date *</Label>
              <Input className={inputCls + " [color-scheme:dark]"} type="date" value={form.date} onChange={e => set("date", e.target.value)} />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <Label className="text-slate-400 text-xs uppercase tracking-wider">Time</Label>
              <Input className={inputCls + " [color-scheme:dark]"} type="time" value={form.time} onChange={e => set("time", e.target.value)} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[3].delay }}>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Location *</Label>
            <Input className={inputCls} placeholder="Venue, City, State" value={form.location} onChange={e => set("location", e.target.value)} />
            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[4].delay }} className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-slate-400 text-xs uppercase tracking-wider">Capacity *</Label>
              <Input className={inputCls} type="number" min="1" value={form.capacity} onChange={e => set("capacity", e.target.value)} />
              {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <Label className="text-slate-400 text-xs uppercase tracking-wider">Ticket Price ($)</Label>
              <Input className={inputCls} type="number" min="0" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[5].delay }}>
            <Label className="text-slate-400 text-xs uppercase tracking-wider">Description</Label>
            <textarea
              className="w-full mt-1 px-3 py-2 rounded-xl text-sm bg-white/4 border border-white/8 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 resize-none transition-colors"
              rows={3} placeholder="Describe your event..." value={form.description} onChange={e => set("description", e.target.value)}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: fields[6].delay }} className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 border-white/8 text-slate-400 hover:bg-white/5 rounded-xl" onClick={onClose}>Cancel</Button>
            <motion.div className="flex-[2]" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-red-500 text-slate-900 font-bold hover:opacity-90 rounded-xl shadow-lg shadow-amber-500/20" onClick={handleSubmit}>
                {eventId ? "Save Changes" : "Create Event →"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
