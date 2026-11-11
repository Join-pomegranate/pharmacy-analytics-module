# Pharmacy Analytics Module

Pom Pharmacy Order Analytics, built from the Claude Design project. React 18 + Vite, using sample data only.

```bash
npm install
npm run dev
```

- `src/lib/analytics.js`: sample-data generator and helpers (orders, charts, exports, CSV parsing)
- `src/lib/Controller.jsx`: state and per-page view-models (filters, roles, manual orders, CSV import, audit log)
- `src/components/`: Kpis, TrendChart, BarList, DataTable, order drawer, manual-order and CSV-import modals
- `src/pages/`: Overview, Orders, Pharmacy, Product, Pharmacist, Manual, Reports, Settings
- `src/AppShell.jsx`: sidebar, header and overlays
