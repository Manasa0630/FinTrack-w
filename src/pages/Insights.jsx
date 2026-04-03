import { useMemo } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import { useChartData } from "../hooks/useChartData";
import { CATEGORY_ICONS, CATEGORY_COLORS, COLORS } from "../utils/constants";
import { fmtShort } from "../utils/formatters";

export default function Insights() {
  const { transactions } = useApp();
  const { categoryBreakdown } = useChartData(transactions);

  const insights = useMemo(() => {
    const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort();
    const latest = months[months.length - 1];
    const prev   = months[months.length - 2];

    const latestExp = transactions.filter((t) => t.type === "expense" && t.date.startsWith(latest)).reduce((s, t) => s + t.amount, 0);
    const prevExp   = transactions.filter((t) => t.type === "expense" && t.date.startsWith(prev || "")).reduce((s, t) => s + t.amount, 0);
    const expChange = prevExp ? ((latestExp - prevExp) / prevExp) * 100 : 0;

    const catMap = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

    const totalIncome   = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate   = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

    const expenseCount = transactions.filter((t) => t.type === "expense").length;
    const avgTx = expenseCount > 0 ? Math.round(totalExpenses / expenseCount) : 0;

    const weekdayMap = {};
    transactions.forEach((t) => {
      const day = new Date(t.date).toLocaleString("default", { weekday: "long" });
      weekdayMap[day] = (weekdayMap[day] || 0) + (t.type === "expense" ? t.amount : 0);
    });
    const topDay = Object.entries(weekdayMap).sort((a, b) => b[1] - a[1])[0];

    return { topCat, expChange, savingsRate, txCount: transactions.length, avgTx, latest, topDay };
  }, [transactions]);

  const cards = [
    {
      title: "🏆 Top Spending Category",
      value: insights.topCat ? `${CATEGORY_ICONS[insights.topCat[0]]} ${insights.topCat[0]}` : "—",
      sub:   insights.topCat ? `${fmtShort(insights.topCat[1])} total spent` : "",
      color: CATEGORY_COLORS[insights.topCat?.[0]] || COLORS.accent,
    },
    {
      title: "📅 Month-over-Month Expenses",
      value: `${insights.expChange >= 0 ? "+" : ""}${insights.expChange.toFixed(1)}%`,
      sub:   insights.latest ? `${new Date(insights.latest + "-01").toLocaleString("default", { month: "long" })} vs previous` : "",
      color: insights.expChange > 0 ? COLORS.expense : COLORS.income,
    },
    {
      title: "💰 Overall Savings Rate",
      value: `${insights.savingsRate}%`,
      sub:   "of total income saved",
      color: Number(insights.savingsRate) >= 20 ? COLORS.income : COLORS.gold,
    },
    {
      title: "📊 Avg Expense Size",
      value: fmtShort(insights.avgTx),
      sub:   `across ${insights.txCount} transactions`,
      color: COLORS.purple,
    },
    {
      title: "📆 Biggest Spending Day",
      value: insights.topDay ? insights.topDay[0] : "—",
      sub:   insights.topDay ? `${fmtShort(insights.topDay[1])} spent` : "",
      color: COLORS.teal,
    },
    {
      title: "🔢 Total Transactions",
      value: insights.txCount,
      sub:   "recorded entries",
      color: COLORS.gold,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Insight cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {cards.map((c) => (
          <div key={c.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20, borderLeft: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 12, color: "#64748b", fontFamily: "DM Sans", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.title}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'Sora', sans-serif" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#475569", fontFamily: "DM Sans", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Spending breakdown bar */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, color: "#e2e8f0", fontSize: 15, marginBottom: 20 }}>Spending Distribution</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={categoryBreakdown} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }} tickFormatter={fmtShort} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} width={90} />
            <Tooltip formatter={(v) => fmtShort(v)} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "DM Sans", fontSize: 12 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Amount">
              {categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
