# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve production build
```

No lint, test, or format scripts are configured.

## Architecture

**Client-only personal finance tracker.** No backend, no API routes, no auth. All data lives in browser `localStorage` under the key `finance_app_v1`.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Zod v4 · Recharts · date-fns v4 · Lucide React

### Data flow

```
localStorage  ←→  useFinanceStore  ←→  domain hooks  ←→  page components
```

- `useFinanceStore` (`src/hooks/useFinanceStore.ts`) is the single root hook. It reads from localStorage on mount, writes on every update, and listens for `storage` events for cross-tab sync.
- Domain hooks (`useTransactions`, `useAssets`, `useCategories`, `useSettings`) wrap `useFinanceStore` to expose scoped CRUD operations.
- `useDashboard` derives aggregated metrics (totals, charts, net worth) from the store.
- All components are `'use client'`; there is no server rendering of app state.

### Key directories

| Path | Purpose |
|------|---------|
| `src/app/` | App Router pages — one folder per route (`dashboard`, `transactions`, `assets`, `categories`, `settings`) |
| `src/components/` | UI split into `layout/`, `ui/` (primitives), and per-feature sub-folders |
| `src/hooks/` | All state logic lives here |
| `src/lib/` | Pure utilities: `storage.ts` (localStorage + migrations), `calculations.ts` (business logic), `formatters.ts`, `validators.ts` (Zod schemas), `constants.ts`, `defaults.ts` |
| `src/types/index.ts` | All domain types (`Transaction`, `Category`, `Asset`, `FinanceStore`, etc.) |

### Storage schema

```typescript
FinanceStore {
  version: number        // bumped on breaking schema changes; migrations run in storage.ts
  settings: { currency, dateFormat, theme }
  transactions: Transaction[]
  categories: Category[]
  assets: Asset[]
}
```

When making schema changes, add a migration in `src/lib/storage.ts` and increment the version.

### Path alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json`).
