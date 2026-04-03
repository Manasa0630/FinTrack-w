import { useMemo } from "react";
import { CATEGORY_COLORS } from "../utils/constants";

export function useChartData(transactions) {
  const monthlyTrend = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!map[m]) map[m] = { month: m, income: 0, expenses: 0 };
      if (t.type === "income") map[m].income += t.amount;
      else map[m].expenses += t.amount;
    });
    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        month: new Date(m.month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
        net: m.income - m.expenses,
      }));
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || "#94a3b8" }));
  }, [transactions]);

  return { monthlyTrend, categoryBreakdown };
}
