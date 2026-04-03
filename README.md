# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React. Track income, expenses, spending patterns, and insights — all from a polished dark-themed UI.

---

## Quick Start

```bash
git clone <your-repo>
cd fintrack
npm install
npm start
```

Runs at `http://localhost:3000`

---

## Project Structure

```
src/
├── App.jsx                        # Root layout + global styles
├── context/
│   └── AppContext.jsx             # Global state (transactions, role, filters)
├── hooks/
│   └── useChartData.js            # Derived chart data (monthly trend, category breakdown)
├── pages/
│   ├── Dashboard.jsx              # Summary cards + 3 charts
│   ├── Transactions.jsx           # Filterable transaction list + CRUD
│   └── Insights.jsx               # Insight cards + spending breakdown chart
├── components/
│   ├── Nav.jsx                    # Top navigation + role switcher
│   ├── TransactionForm.jsx        # Add / edit transaction modal form
│   └── UI.jsx                     # Shared: SummaryCard, Badge, Modal, ChartTooltip
└── utils/
    ├── constants.js               # Colors, categories, icons, storage key
    ├── formatters.js              # fmt() and fmtShort() currency helpers
    └── mockData.js                # 37 pre-seeded sample transactions
```

---

## Features

### Dashboard
- Summary cards: Balance, Income, Expenses, Savings Rate (animated counters)
- Monthly bar chart: income vs expenses side by side
- Category donut chart with top-4 legend
- Net balance line chart over time

### Transactions
- Search, filter by type / category / month, sort by date or amount
- Colour-coded rows with category icons and badges
- Admin: Add / Edit / Delete via modal form
- Viewer: read-only, no mutation controls

### Insights
- Top spending category, month-over-month change, savings rate
- Average expense size, biggest spending day of week, total count
- Horizontal bar chart of all categories

### Role-Based UI
Switch roles via the dropdown in the nav header.

| Feature             | Admin | Viewer|

| View all data       | ✅ | ✅ |
| Add transactions    | ✅ | ❌ |
| Edit transactions   | ✅ | ❌ |
| Delete transactions | ✅ | ❌ |

### Persistence
Transactions and active role are saved to `localStorage` and restored on page refresh.

---

## Tech Stack
- React 18 (Context API, hooks)
- Recharts (BarChart, LineChart, PieChart)
- Google Fonts: Sora + DM Sans
- No CSS framework — all inline styles with CSS variables via `<style>` tag
