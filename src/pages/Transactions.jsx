import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Modal, Badge } from "../components/UI";
import TransactionForm from "../components/TransactionForm";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS, COLORS } from "../utils/constants";
import { fmt } from "../utils/formatters";

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: "9px 14px",
  color: "#e2e8f0",
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
};

export default function Transactions() {
  const { filteredTransactions, filters, setFilters, role, addTransaction, editTransaction, deleteTransaction } = useApp();
  const [showAdd, setShowAdd]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [sortBy, setSortBy]     = useState("date-desc");

  const months = useMemo(() => {
    const set = new Set(filteredTransactions.map((t) => t.date.slice(0, 7)));
    return [...set].sort().reverse();
  }, [filteredTransactions]);

  const sorted = useMemo(() => {
    const list = [...filteredTransactions];
    if (sortBy === "date-desc")    list.sort((a, b) => b.date.localeCompare(a.date));
    if (sortBy === "date-asc")     list.sort((a, b) => a.date.localeCompare(b.date));
    if (sortBy === "amount-desc")  list.sort((a, b) => b.amount - a.amount);
    if (sortBy === "amount-asc")   list.sort((a, b) => a.amount - b.amount);
    return list;
  }, [filteredTransactions, sortBy]);

  return (
    <div>
      {/* Filters bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <input
          placeholder="🔍  Search transactions…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          style={{ ...inputStyle, flex: "1 1 200px", minWidth: 180 }}
        />
        <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, flex: "0 1 140px" }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, flex: "0 1 150px" }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.month} onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))} style={{ ...inputStyle, flex: "0 1 160px" }}>
          <option value="all">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>{new Date(m + "-01").toLocaleString("default", { month: "long", year: "numeric" })}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...inputStyle, flex: "0 1 160px" }}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
        {role === "admin" && (
          <button onClick={() => setShowAdd(true)} style={{ background: COLORS.accent, border: "none", borderRadius: 10, padding: "9px 18px", color: "#0f172a", cursor: "pointer", fontWeight: 700, fontFamily: "DM Sans", fontSize: 13, whiteSpace: "nowrap" }}>
            + Add
          </button>
        )}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", color: "#475569", fontFamily: "DM Sans", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16 }}>No transactions found</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((t) => (
            <div key={t.id}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${CATEGORY_COLORS[t.category] || "#94a3b8"}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {CATEGORY_ICONS[t.category] || "📦"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#e2e8f0", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge text={t.category} color={CATEGORY_COLORS[t.category] || "#94a3b8"} />
                  <span style={{ fontSize: 11, color: "#475569", fontFamily: "DM Sans" }}>
                    {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: t.type === "income" ? COLORS.income : COLORS.expense, flexShrink: 0 }}>
                {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
              </div>
              {role === "admin" && (
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => setEditTarget(t)} style={{ background: "rgba(96,165,250,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", color: COLORS.accent, cursor: "pointer", fontSize: 12 }}>✏️</button>
                  <button onClick={() => deleteTransaction(t.id)} style={{ background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", color: COLORS.expense, cursor: "pointer", fontSize: 12 }}>🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd    && <Modal onClose={() => setShowAdd(false)}><TransactionForm onSave={addTransaction} onClose={() => setShowAdd(false)} /></Modal>}
      {editTarget && <Modal onClose={() => setEditTarget(null)}><TransactionForm initial={editTarget} onSave={(u) => editTransaction(editTarget.id, u)} onClose={() => setEditTarget(null)} /></Modal>}
    </div>
  );
}
