import { useApp } from "../context/AppContext";
import { COLORS } from "../utils/constants";

const TABS = [
  { id: "dashboard",    label: "Dashboard",    icon: "⬡" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights",     label: "Insights",     icon: "◈" },
];

export default function Nav() {
  const { activeTab, setActiveTab, role, setRole } = useApp();

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap", gap: 12 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>₹</div>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 18, color: "#f1f5f9", letterSpacing: "-0.03em" }}>FinTrack</span>
      </div>

      {/* Tabs */}
      <nav style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4 }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ background: activeTab === t.id ? "rgba(96,165,250,0.2)" : "transparent", border: activeTab === t.id ? "1px solid rgba(96,165,250,0.3)" : "1px solid transparent", borderRadius: 9, padding: "7px 16px", color: activeTab === t.id ? COLORS.accent : "#64748b", cursor: "pointer", fontFamily: "DM Sans", fontSize: 13, fontWeight: 500, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}
          </button>
        ))}
      </nav>

      {/* Role switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px 12px" }}>
        <span style={{ fontSize: 12, color: "#64748b", fontFamily: "DM Sans" }}>Role:</span>
        <select value={role} onChange={(e) => setRole(e.target.value)}
          style={{ background: "transparent", border: "none", color: role === "admin" ? COLORS.gold : COLORS.teal, fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none" }}>
          <option value="admin">👑 Admin</option>
          <option value="viewer">👁 Viewer</option>
        </select>
      </div>
    </header>
  );
}
