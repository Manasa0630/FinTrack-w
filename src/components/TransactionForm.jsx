import { useState } from "react";
import { CATEGORIES } from "../utils/constants";

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#e2e8f0",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 12,
  color: "#94a3b8",
  fontFamily: "'DM Sans', sans-serif",
  marginBottom: 6,
  display: "block",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

export default function TransactionForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { date: new Date().toISOString().slice(0, 10), amount: "", category: "Food", type: "expense", description: "" }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isValid = form.amount && form.description;

  return (
    <div>
      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#f1f5f9", marginBottom: 24 }}>
        {initial ? "Edit Transaction" : "Add Transaction"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => set("amount", Number(e.target.value))} style={inputStyle} placeholder="0" />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} style={inputStyle}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={labelStyle}>Description</label>
          <input value={form.description} onChange={(e) => set("description", e.target.value)} style={inputStyle} placeholder="What was this for?" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 20px", color: "#94a3b8", cursor: "pointer", fontFamily: "DM Sans", fontSize: 14 }}>
          Cancel
        </button>
        <button onClick={() => { if (isValid) { onSave(form); onClose(); } }}
          style={{ background: isValid ? "#60a5fa" : "#334155", border: "none", borderRadius: 10, padding: "10px 24px", color: isValid ? "#0f172a" : "#64748b", cursor: isValid ? "pointer" : "not-allowed", fontWeight: 700, fontFamily: "DM Sans", fontSize: 14, transition: "background 0.2s" }}>
          {initial ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}
