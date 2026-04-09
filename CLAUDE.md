# Project Architecture

## Tech Stack
- React + TypeScript
- Redux Toolkit + RTK Query (server state)
- TanStack Router (file-based routing)
- Zod (schema validation)
- Styled Components (all styling)

---

## Top-Level Structure

```
src/
├── app/        # Store, router bootstrap, RTK Query API definitions, pages
├── features/   # Self-contained feature modules (see Feature Structure below)
├── common/     # Shared components, hooks, constants — feature-agnostic only
├── routes/     # TanStack Router file-based routing tree
├── providers/  # Context wrappers: theme, i18n, Sentry, etc.
├── hooks/      # App-level hooks (not tied to any feature)
└── utils/      # App-level pure utilities
```

---

## Feature Structure

Every feature lives in `src/features/<featureName>/` and follows this exact layout:

```
src/features/<feature>/
├── hooks/       # ONLY layer that touches Redux / RTK Query
├── components/  # Pure UI — props in, JSX out. NO Redux, no side-effects
├── widgets/     # Dual-export: Widget (calls hook) + WidgetContent (pure UI)
├── state/       # RTK slices — use sparingly; prefer server state via RTK Query
├── types/       # Discriminated unions, Zod schemas
├── utils/       # Pure helper functions
└── constants/   # Feature-scoped constants
```

---

## The Widget Pattern (CRITICAL)

Every widget file must export **four** things:

```ts
// FooWidget.tsx

// 1. Skeleton — shown while loading
export function FooWidgetSkeleton() { ... }

// 2. Error — shown on error status
export function FooWidgetError({ message }: { message: string }) { ... }

// 3. Pure UI — only receives statuses that carry data (success/empty).
//    Use Extract<> to narrow the union to only the relevant statuses.
type ContentState = Extract<FooWidgetState, { status: 'success' | 'empty' }>;
export function FooWidgetContent(props: ContentState) { ... }

// 4. Container — calls the hook, switches on status, renders the right component.
export function FooWidget() {
  const state = useFoo();
  switch (state.status) {
    case 'loading': return <FooWidgetSkeleton />;
    case 'error':   return <FooWidgetError message={state.message} />;
    case 'empty':
    case 'success': return <FooWidgetContent {...state} />;
  }
}
```

### Hooks must return a 4-status discriminated union

```ts
type FooWidgetState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | ({ status: 'empty' } & FooData & FooHandlers)
  | ({ status: 'success' } & FooData & FooHandlers);

export function useFoo(): FooWidgetState { ... }
```

- `loading` — data is being fetched
- `error` — something failed; always include a `message: string`
- `empty` — fetch succeeded but the collection is empty
- `success` — fetch succeeded and data is present
- Shared data/handler shapes should be extracted into interfaces (`FooData`, `FooHandlers`) and composed with `&` to avoid repetition
- The switch in `FooWidget` must be exhaustive — TypeScript will error if a status is unhandled

---

## Absolute Rules (never break these)

| Rule | Detail |
|------|--------|
| **Redux lives ONLY in hooks** | `useSelector` / `useDispatch` / RTK Query hooks are forbidden in components or widgets directly |
| **Components are pure** | A component file must never import from Redux, RTK Query, or any hook that does |
| **Widgets never import other widgets** | Compose at the page level, not inside widgets |
| **WidgetContent receives discriminated union** | Never pass raw booleans like `isLoading` — always use `status` |
| **Hooks own data-fetching** | RTK Query `useXxxQuery` calls belong in hooks, not components |
| **state/ is a last resort** | If it can be server state (RTK Query), it should be |

---

## Import Rules

```
pages        → widgets, components, hooks
widgets      → hooks, components (own feature only)
components   → types, utils, constants (never hooks, never Redux)
hooks        → RTK Query, Redux slices, types
state/       → types only
```

Cross-feature imports must go through `common/` or be explicitly justified.

---

## Naming Conventions

- Widgets: `<Noun>Widget` / `<Noun>WidgetContent` / `<Noun>WidgetSkeleton` / `<Noun>WidgetError`
- Hooks: `use<Noun>` returning a discriminated union named `<Noun>State`
- Slices: `<noun>Slice`
- Zod schemas: `<Noun>Schema`
- Types file: `types.ts` (or named type files) inside `types/`

---

## Styling

- **Styled-components only** — no inline styles, no CSS modules, no Tailwind
- Named with `Styled` prefix: `StyledWrapper`, `StyledButton`, `StyledCard`
- Co-located in a `styles.ts` file next to the component (e.g. `Button/styles.ts` + `Button/index.tsx`)
- For very simple one-off wrappers, inline in the component file is fine
- Theme values via `ThemeProvider` in `src/providers/ThemeProvider.tsx` — never hardcode colors, spacing, or font sizes
- Access theme in styled components via the `theme` prop: `${({ theme }) => theme.colors.primary}`
- Global styles live in `src/providers/GlobalStyles.ts` using `createGlobalStyle`
- Never use `style={{}}` prop — always reach for a styled component

---

## When generating new features

1. Always create the full folder skeleton (all 7 subdirs) even if some start empty
2. Create an `index.ts` barrel in each feature root exporting public surface
3. Put the RTK Query API definition in `src/app/api/<feature>Api.ts`
4. Register the slice reducer in `src/app/store.ts`
5. Add the route file in `src/routes/`
