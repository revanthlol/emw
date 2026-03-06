"use client";

import { motion } from "framer-motion";
import type { View } from "@/app/page";

const nav: { id: View; icon: string; label: string }[] = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "events",    icon: "◉", label: "Events" },
  { id: "kanban",    icon: "⊞", label: "Kanban" },
  { id: "calendar",  icon: "◫", label: "Calendar" },
  { id: "analytics", icon: "◐", label: "Analytics" },
];

export function Sidebar({ active, setActive }: { active: View; setActive: (v: View) => void }) {
  return (
    <div className="glass-sidebar" style={{ width: 232, minHeight: "100vh", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #F59E0B, #EF4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)" }}
          >
            ⬡
          </motion.div>
          <div>
            <div className="font-display" style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px" }}>EventForge</div>
            <div style={{ color: "var(--text-dim)", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1 }}>Pro Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "20px 14px", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-dim)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 14px 12px" }}>
          Navigation
        </div>
        {nav.map(item => {
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActive(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer",
                marginBottom: 3, background: "transparent", position: "relative",
                color: isActive ? "#F59E0B" : "#64748B",
                fontWeight: isActive ? 700 : 500, fontSize: 14,
                transition: "color 0.2s", textAlign: "left",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: "absolute", inset: 0, borderRadius: 12,
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span style={{ fontSize: 16, position: "relative", zIndex: 1 }}>{item.icon}</span>
              <span style={{ position: "relative", zIndex: 1 }}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: 18, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", boxShadow: "0 2px 12px rgba(99,102,241,0.3)" }}>EF</div>
          <div>
            <div style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600 }}>EventForge</div>
            <div style={{ color: "var(--text-dim)", fontSize: 11 }}>Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
