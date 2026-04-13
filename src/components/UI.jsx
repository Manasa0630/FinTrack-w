import { useState, useEffect } from "react";
import { COLORS } from "../utils/constants";

// ── Animated counter ─────────────────────────────────────────────────────────
export function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toLocaleString("en-IN")}</span>;
}

// ── Summary card ─────────────────────────────────────────────────────────────
export function SummaryCard({ label, value, icon, color, delta }) {
  return (
    <div
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${color}22`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>
         ₹<AnimatedNumber value={value} />
      </div>
      {delta !== undefined && (
        <div style={{ marginTop: 8, fontSize: 12, color: delta >= 0 ? COLORS.income : COLORS.expense, fontFamily: "'DM Sans', sans-serif" }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ text, color }) {
  return (
    <span style={{ background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em" }}>
      {text}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, margin: "0 16px" }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── Chart tooltip ─────────────────────────────────────────────────────────────
export function ChartTooltip({ active, payload, label }) {
  const { fmtShort } = require("../utils/formatters");
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ color: "#94a3b8", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {fmtShort(p.value)}</div>
      ))}
    </div>
  );
}
