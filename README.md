# Chuck Norris Client

A Next.js + TypeScript app that fetches random Chuck Norris jokes from the public API, with a live timer, favorites system, and full CI pipeline.

**Live demo:** [chuck-norris-client-three.vercel.app](https://chuck-norris-client-three.vercel.app)

---

## Features

- Load 10 random jokes on page load
- Toggleable 5-second timer — adds a new joke, trims the oldest (rolling max 10)
- Mark jokes as favorites with a star button (max 10)
- Favorites page with per-item remove
- Favorites persist across page refresh via `localStorage`
- Full CI pipeline (format, lint, typecheck, tests, build)

---

## Design workflow — Pencil + Claude Code

The UI was designed in **Pencil** and implemented directly from the design file using **Claude Code**.

The design file lives at:

```
chuck-norris-client-design.pen
```

### How it works

Pencil is a design tool that stores components, pages, and design tokens in a structured `.pen` file. Claude Code reads this file through the **Pencil MCP server** — a Model Context Protocol integration that gives Claude direct access to the design document without any manual export or handoff step.

The typical workflow:

1. Design components and pages in Pencil (cards, nav, buttons, status pills, etc.)
2. Open the project in Claude Code — it connects to the Pencil MCP server automatically
3. Ask Claude to read the design file, extract component specs (spacing, color tokens, corner radius, typography), and generate matching React + Tailwind code
4. Claude reads exact values from the `.pen` file — `cornerRadius: 14`, `padding: [10, 16]`, `fill: "$text-muted"` — and maps them directly to Tailwind utility classes or custom CSS tokens

This eliminates the gap between design and implementation. No redlines, no Figma inspect panel, no guessing pixel values — the AI reads the source of truth directly.

### Design tokens

Tokens are defined as variables in the `.pen` file and mapped to Tailwind CSS custom properties in `src/app/globals.css` via `@theme inline`:

| Pencil token      | CSS custom property     | Usage                                |
| ----------------- | ----------------------- | ------------------------------------ |
| `$bg`             | `--color-page`          | Page background                      |
| `$surface`        | `--color-surface`       | Cards, header                        |
| `$surface-2`      | `--color-surface-2`     | Skeleton, hover states               |
| `$border`         | `--color-divider`       | All borders                          |
| `$text`           | `--color-content`       | Primary text                         |
| `$text-muted`     | `--color-muted`         | Secondary text, timestamps           |
| `$primary`        | `--color-primary`       | Amber — buttons, active nav, star    |
| `$primary-soft`   | `--color-primary-soft`  | Amber tint — badge bg, active nav bg |
| `$primary-strong` | `--color-primary-hover` | Amber dark — hover, active nav text  |
| `$danger`         | `--color-danger`        | Red — remove button, errors          |
| `$danger-soft`    | `--color-danger-soft`   | Red tint — remove hover bg           |
| `$success`        | `--color-success`       | Green — running pill                 |
| `$success-soft`   | `--color-success-soft`  | Green tint — running pill bg         |
| `$info`           | `--color-info`          | Blue — dev category badge            |
| `$info-soft`      | `--color-info-soft`     | Blue tint — dev badge bg             |

---

## Tech stack

### Runtime

| Package     | Version | Why                                                         |
| ----------- | ------- | ----------------------------------------------------------- |
| `next`      | 16.x    | App Router, Server Components, `next/image`, metadata API   |
| `react`     | 19.x    | Latest stable — concurrent features, `useSyncExternalStore` |
| `react-dom` | 19.x    | DOM renderer for React 19                                   |

### Styling

| Package                | Version | Why                                                                   |
| ---------------------- | ------- | --------------------------------------------------------------------- |
| `tailwindcss`          | v4      | CSS-first config via `@theme inline` — no `tailwind.config.js` needed |
| `@tailwindcss/postcss` | v4      | PostCSS integration for Tailwind v4                                   |

**Why Tailwind v4?** v4 dropped the JavaScript config file. Design tokens are defined directly in CSS using `@theme inline { --color-x: ... }`, which makes it trivial to map Pencil variables to utility classes. No intermediate config layer.

### Testing

| Package                       | Version | Why                                                        |
| ----------------------------- | ------- | ---------------------------------------------------------- |
| `vitest`                      | v4      | Vite-native test runner — fast, no Babel, native ESM       |
| `@testing-library/react`      | 16.x    | Component testing with React 19 support                    |
| `@testing-library/dom`        | 10.x    | DOM utilities used internally by Testing Library           |
| `@testing-library/user-event` | 14.x    | Realistic user interaction simulation                      |
| `@testing-library/jest-dom`   | 6.x     | Custom matchers (`toBeInTheDocument`, `toHaveClass`, etc.) |
| `jsdom`                       | 28.x    | Browser environment simulation for Vitest                  |

**Why Vitest over Jest?** The project uses Next.js with Turbopack and native ESM. Vitest runs in the same Vite pipeline — no separate Babel transform, no `jest.config.js`, and it's significantly faster for unit tests.

### Linting & formatting

| Package                            | Version | Why                                                   |
| ---------------------------------- | ------- | ----------------------------------------------------- |
| `eslint`                           | v9      | Flat config (`eslint.config.mjs`) — new config format |
| `eslint-config-next`               | 16.x    | Next.js rules including React Compiler lint rules     |
| `eslint-config-prettier`           | 10.x    | Disables ESLint rules that conflict with Prettier     |
| `eslint-plugin-prettier`           | 5.x     | Runs Prettier as an ESLint rule                       |
| `typescript-eslint`                | 8.x     | TypeScript-aware linting rules                        |
| `@typescript-eslint/eslint-plugin` | 8.x     | Additional TS lint rules                              |
| `@typescript-eslint/parser`        | 8.x     | Parses TypeScript for ESLint                          |
| `prettier`                         | 3.x     | Opinionated formatter — eliminates style debates      |

### Git hooks

| Package       | Version | Why                                                       |
| ------------- | ------- | --------------------------------------------------------- |
| `husky`       | v9      | Git hook management — runs checks before commit           |
| `lint-staged` | 16.x    | Runs linters only on staged files, not the entire project |

The pre-commit hook runs `eslint --fix` + `prettier --write` on staged files only, keeping commits clean without slowing down the workflow.

### TypeScript

| Package            | Version | Why                                              |
| ------------------ | ------- | ------------------------------------------------ |
| `typescript`       | 5.9.x   | Strict mode enabled. Catches bugs before runtime |
| `@types/node`      | 25.x    | Node.js type definitions                         |
| `@types/react`     | 19.x    | React 19 type definitions                        |
| `@types/react-dom` | 19.x    | ReactDOM type definitions                        |

`vite-tsconfig-paths` maps `@/` path aliases from `tsconfig.json` into Vitest so tests resolve imports the same way the app does.

### CI / deployment

| Tool           | Why                                                                      |
| -------------- | ------------------------------------------------------------------------ |
| GitHub Actions | Runs on every push and PR: format → lint → typecheck → test → build      |
| React Doctor   | Static analysis for React anti-patterns, runs after the main build       |
| Renovate       | Automated dependency update PRs with configurable grouping               |
| Vercel         | Zero-config deployment for Next.js, automatic preview deployments per PR |
| `act`          | Run GitHub Actions locally in Docker before pushing                      |

---

## Key implementation decisions

### `useSyncExternalStore` for favorites persistence

The favorites state lives in `localStorage`. The naive approach is:

```ts
const [favorites, setFavorites] = useState([]);
useEffect(() => {
  setFavorites(loadFavorites());
}, []);
```

This has two problems: a visible flash on load (empty → populated), and an ESLint warning (`react-hooks/set-state-in-effect`).

The correct React primitive for subscribing to an external store is `useSyncExternalStore`:

```ts
const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

- `getServerSnapshot` returns `[]` — used during SSR and hydration, so server HTML and initial client render match
- `getSnapshot` reads from `localStorage` — used on subsequent renders after hydration
- `subscribe` listens to `storage` events — cross-tab sync comes for free

When a joke is toggled or removed, `saveFavorites()` writes to `localStorage` directly and `_invalidate()` notifies all listeners, triggering a re-render with the new data. No `useState`, no `useEffect`, no flash, no lint suppression needed.

### Server Components for metadata

Next.js App Router only allows `export const metadata` in Server Components. Both pages (`/` and `/favorites`) use hooks (`useState`, `useSyncExternalStore`) and must be Client Components.

The solution: keep the `page.tsx` files as thin Server Components that export metadata and render the client view:

```ts
// src/app/page.tsx — Server Component
export const metadata = { title: 'Jokes', description: '...' };
export default function Page() { return <JokesView />; }
```

```ts
// src/components/JokesView.tsx — Client Component
'use client';
export function JokesView() {
  /* all the hooks */
}
```

This follows the Next.js recommendation to push client boundaries as deep as possible.

### AbortController for fetch cancellation

Every fetch to the Chuck Norris API is passed an `AbortSignal`:

```ts
const controller = new AbortController();
void loadInitial(controller.signal);
return () => controller.abort(); // cleanup on unmount
```

This prevents state updates on unmounted components and avoids network requests completing after the user navigates away. The timer effect does the same — the controller is aborted when `isRunning` flips back to `false`.

### Rolling list trimming by `fetchedAt`

When the timer adds a new joke, the list trims to 10 by sorting on `fetchedAt` and dropping the oldest:

```ts
export function addAndTrimByFetchedAt(items, newItem, max) {
  return [...items, newItem].sort((a, b) => (b.fetchedAt ?? 0) - (a.fetchedAt ?? 0)).slice(0, max);
}
```

Sorting by timestamp rather than array index means the list always shows the 10 most recently fetched jokes regardless of load order — important because `Promise.all` resolves jokes in parallel and they may arrive slightly out of order.

### Stable skeleton keys

React warns about using array indices as keys because they cause issues when lists are reordered or filtered. Skeleton cards are static placeholders, but the key should still be a stable string:

```ts
const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5'];
```

### `picomatch` as a direct devDependency

`fdir` (used by Vitest's file scanner) declares `picomatch@^3||^4` as a peer dependency. The npm `overrides` field does not create nested installs for peer dependencies, so the override was ineffective. The fix is to add `picomatch@^4.0.3` directly to `devDependencies`, which hoists v4 to the top level and satisfies `fdir`'s peer requirement. `micromatch` (which needs `^2.x`) gets its own nested install.

---

## Project structure

```
src/
  app/
    page.tsx                  # Server Component — Jokes page metadata
    favorites/
      page.tsx                # Server Component — Favorites page metadata
    layout.tsx                # Root layout with title template
    globals.css               # Tailwind v4 @theme with all design tokens
    providers.tsx             # Client providers wrapper

  components/
    JokesView.tsx             # Jokes page — all interactive logic
    FavoritesView.tsx         # Favorites page — all interactive logic
    JokeCard.tsx              # Individual joke card (avatar, badges, star)
    JokeList.tsx              # ul wrapper for joke cards
    SkeletonCard.tsx          # Loading placeholder card
    EmptyState.tsx            # Empty favorites state
    Header.tsx                # Sticky header with nav
    NavLink.tsx               # Active-aware nav link
    NavBadge.tsx              # Favorites count badge
    StarButton.tsx            # Favorite toggle button
    StatusPill.tsx            # Running / Paused indicator

  lib/
    chuckApi.ts               # fetch wrapper for api.chucknorris.io
    types.ts                  # Shared TypeScript types (JokeItem)
    listRules.ts              # Rolling list logic (addAndTrimByFetchedAt)

  store/
    favorites.ts              # Pure functions: load, save, toggle, remove
    FavoritesProvider.tsx     # useSyncExternalStore-based context
    ToastProvider.tsx         # Toast notification context

  __tests__/
    listRules.test.ts         # Rolling list trim logic
    favorites.test.ts         # Toggle add/remove, max limit
```

---

## Getting started

### Requirements

- Node 22 (see `.nvmrc`)
- npm 10+

```bash
nvm use          # switches to Node 22
npm install      # install dependencies
npm run dev      # start dev server at localhost:3000
```

### All scripts

| Script                  | What it does                      |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Next.js dev server with Turbopack |
| `npm run build`         | Production build                  |
| `npm run start`         | Start production server           |
| `npm run lint`          | ESLint check                      |
| `npm run lint:fix`      | ESLint auto-fix                   |
| `npm run format`        | Prettier check                    |
| `npm run format:fix`    | Prettier auto-fix                 |
| `npm run typecheck`     | TypeScript type check (no emit)   |
| `npm run test`          | Vitest in watch mode              |
| `npm run test:run`      | Vitest single run                 |
| `npm run test:coverage` | Vitest with coverage report       |
| `npm run doctor`        | React Doctor static analysis      |

### Run CI locally

```bash
act push --job build-and-test
```

Requires [act](https://github.com/nektos/act) and Docker.

---

## API

Jokes are fetched from the free [Chuck Norris API](https://api.chucknorris.io):

```
GET https://api.chucknorris.io/jokes/random
```

Response fields used:

| Field        | Type       | Usage                                        |
| ------------ | ---------- | -------------------------------------------- |
| `id`         | `string`   | React key, favorite lookup, short ID display |
| `value`      | `string`   | Joke text                                    |
| `icon_url`   | `string`   | Avatar image (via `next/image`)              |
| `categories` | `string[]` | Category badges (dev, sports, animal, etc.)  |
| `created_at` | `string`   | Included in type, not displayed              |
| `updated_at` | `string`   | Included in type, not displayed              |
