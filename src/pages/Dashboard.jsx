import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import { useChartData } from "../hooks/useChartData";
import { SummaryCard, ChartTooltip } from "../components/UI";
import { COLORS } from "../utils/constants";
import { fmtShort } from "../utils/formatters";

export default function Dashboard() {
  const { transactions, summary } = useApp();
  const { monthlyTrend, categoryBreakdown } = useChartData(transactions);

  const expDelta = useMemo(() => {
    const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort();
    if (months.length < 2) return null;
    const [prev, cur] = [months[months.length - 2], months[months.length - 1]];
    const prevExp = transactions.filter((t) => t.type === "expense" && t.date.startsWith(prev)).reduce((s, t) => s + t.amount, 0);
    const curExp  = transactions.filter((t) => t.type === "expense" && t.date.startsWith(cur)).reduce((s, t) => s + t.amount, 0);
    return prevExp ? ((curExp - prevExp) / prevExp) * 100 : null;
  }, [transactions]);

  const savingsRate = Math.max(0, Math.round((summary.balance / summary.income) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <SummaryCard label="Total Balance"  value={summary.balance}  icon="💰" color={COLORS.accent}  />
        <SummaryCard label="Total Income"   value={summary.income}   icon="📥" color={COLORS.income}  delta={4.2} />
        <SummaryCard label="Total Expenses" value={summary.expenses} icon="📤" color={COLORS.expense} delta={expDelta} />
        <SummaryCard label="Savings Rate %"  value={savingsRate}      icon="📊" color={COLORS.gold}    />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Monthly bar */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#e2e8f0", fontSize: 15, marginBottom: 20 }}>Monthly Overview</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrend} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: "DM Sans", fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="income"   fill={COLORS.income}  radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill={COLORS.expense} radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category donut */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#e2e8f0", fontSize: 15, marginBottom: 20 }}>Spending by Category</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={68} dataKey="value" paddingAngle={2}>
                {categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
  formatter={(v) => fmtShort(v)}
  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Sans", fontSize: 12, color: "#e2e8f0" }}
  itemStyle={{ color: "#e2e8f0" }}
  labelStyle={{ color: "#e2e8f0" }}
/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {categoryBreakdown.slice(0, 4).map((c) => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                  <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "DM Sans" }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 12, color: "#e2e8f0", fontFamily: "DM Sans", fontWeight: 500 }}>{fmtShort(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net balance line */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#e2e8f0", fontSize: 15, marginBottom: 20 }}>Net Balance Trend</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="net" stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, r: 4 }} name="Net" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
