import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { generateTransactions } from "../utils/mockData";
import { STORAGE_KEY } from "../utils/constants";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
  })();

  const [transactions, setTransactions] = useState(stored?.transactions || generateTransactions());
  const [role, setRole] = useState(stored?.role || "admin");
  const [filters, setFilters] = useState({ search: "", type: "all", category: "all", month: "all" });
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, role }));
  }, [transactions, role]);

  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id, updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        filters.search === "" ||
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "all" || t.type === filters.type;
      const matchCategory = filters.category === "all" || t.category === filters.category;
      const matchMonth = filters.month === "all" || t.date.startsWith(filters.month);
      return matchSearch && matchType && matchCategory && matchMonth;
    });
  }, [transactions, filters]);

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  return (
    <AppContext.Provider value={{
      transactions, filteredTransactions, role, setRole,
      filters, setFilters, activeTab, setActiveTab,
      addTransaction, editTransaction, deleteTransaction, summary,
    }}>
      {children}
    </AppContext.Provider>
  );
}
