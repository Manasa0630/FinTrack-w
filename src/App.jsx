import { AppProvider, useApp } from "./context/AppContext";
import Nav from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { COLORS } from "./utils/constants";

function AppContent() {
  const { activeTab, role } = useApp();

  return (
    <div style={{ minHeight: "100vh", background: "#080f1e", color: "#f1f5f9" }}>
      {/* Ambient background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />

        {role === "viewer" && (
          <div style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, margin: "16px 32px 0", padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>👁</span>
            <span style={{ fontFamily: "DM Sans", fontSize: 13, color: COLORS.teal }}>
              Viewer mode — read-only. Switch to Admin to add or edit transactions.
            </span>
          </div>
        )}

        <main style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>
          {activeTab === "dashboard"    && <Dashboard />}
          {activeTab === "transactions" && <Transactions />}
          {activeTab === "insights"     && <Insights />}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        select option { background: #0f172a; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        @media (max-width: 640px) {
          header { padding: 14px 16px !important; }
          main   { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
