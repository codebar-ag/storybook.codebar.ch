# @codebar-ag/storybook

Shared **Vue 3 + Tailwind v4** design-system atoms and design tokens for codebar-ag
applications, documented in **Storybook**. One source of truth so every app looks
identical.

**Live Storybook:** https://codebar-ag.github.io/storybook.codebar.ch/ — every atom
and its variants, deployed automatically from `main`.

> **Atoms only.** This package ships the basic building blocks (button, card,
> table, badge, form fields, dropdown, icon, list-row, metric, alert…) and the
> design tokens. Composite, domain-specific "organisms" (billing panels, instance
> rows, …) live in each consuming app — but they must be assembled **only** from
> these atoms, never from raw HTML elements.

## Install

The package is published to **GitHub Packages**. Add an `.npmrc` to the consuming app:

```
@codebar-ag:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @codebar-ag/storybook
```

> **Note:** the package is private; GitHub's npm registry requires
> authentication to install. Set `GITHUB_TOKEN` to a GitHub token with the
> `read:packages` scope (a classic PAT works) — locally, in CI, and on deploy
> targets.

## Use

**1. Tokens + Tailwind** — in your app's `app.css`:

```css
@import "@codebar-ag/storybook/tokens.css";   /* @theme: colors, type scale, radius */
@import "tailwindcss";
@source "../../node_modules/@codebar-ag/storybook/dist";  /* scan atoms for classes */
```

The `@source` line is required: Tailwind must scan the compiled atoms so their
utility classes are generated in your app's stylesheet.

**2. Register the atoms** — in your Vue entry:

```ts
import { Flows } from '@codebar-ag/storybook';
createApp(...).use(Flows);   // global <Button>, <Card>, <Icon>, …
```

Or import individually:

```ts
import { Button, Card, useToast } from '@codebar-ag/storybook';
```

**3. Toasts** — mount `<Toaster />` once near the root, then `push()` from anywhere:

```ts
import { pushToast } from '@codebar-ag/storybook';
pushToast({ message: 'Saved.', type: 'success' });
```

## Before building new UI in a consuming app

Component-based consistency is the point of this package: every app should look
identical because every app is built from the same atoms.

1. **Check Storybook first.** Browse the
   [live Storybook](https://codebar-ag.github.io/storybook.codebar.ch/) (or run
   `npm run dev` in this package) and search `src/index.ts`'s barrel export before
   writing any markup for a new screen or feature.
2. **Never re-implement an atom.** If this package already ships a `Button`,
   `Card`, `Table`, `Badge`, `Modal`, form field, dropdown, icon, list-row, metric,
   or alert, the consuming app must import and use it — not hand-roll an
   equivalent with raw `<button>`/`<table>`/`<div>` + Tailwind classes.
3. **Compose, don't fork.** If an atom is close but not quite right, extend it via
   its existing props/slots/`class` overrides. Don't copy its template into the
   app and tweak it.
4. **Domain-specific "organisms"** (billing panels, instance rows, resource lists,
   …) stay in the consuming app, but must be assembled only from these atoms,
   never from raw HTML elements.

## Proposing a new atom

Only add a component here when no existing atom (or composition of atoms) can
satisfy the need. A new atom must:

- Live in `src/components/` as a `<script setup>` Vue 3 SFC.
- Be styled only with token-driven Tailwind utility classes — no `<style>` blocks,
  no `@apply`, no bespoke CSS.
- Ship a `*.stories.ts` entry documenting its variants.
- Pass `npm run typecheck` and `npm run lint`.
- Be exported from `src/index.ts` (and registered on the `Flows` plugin if it's a
  globally-usable atom).

## Develop

```bash
npm install
npm run dev              # Storybook on :6006 (the styleguide)
npm run build            # library build → dist/ (ESM + types + tokens.css)
npm run build-storybook  # static styleguide → storybook-static/
npm run typecheck        # vue-tsc
npm run lint
```

## What's new in v1.4.0

- **Inter is the UI font.** The design system previously rendered everything in
  JetBrains Mono; the UI is now set in Inter (loaded via Google Fonts in
  `tokens.css`, exposed as the `--font-sans` token). JetBrains Mono stays as
  the accent face (`--font-mono`) for ids and code — `IdCell`,
  `PrimarySubtitleCell`'s mono subtitle, and `CodePreview` are unchanged.
  Chart defaults (`chartTheme`) follow the new stack. No API changes; consuming
  apps pick the font up automatically through `tokens.css`.

## What's new in v1.3.0

- **New components** — atoms `Avatar`, `Divider`, `Kbd`, `Spinner`; molecules
  `Accordion`/`AccordionItem`, `Combobox`, `InputNumber`, `PasswordInput`,
  `PinInput`, `Popover`, `Tabs`, `Tooltip`; organisms `DataTable` (sortable,
  selectable, paginated), `Drawer`, `Navbar`, `Sidebar`/`SidebarGroup`/
  `SidebarItem`; layouts `AppShell`, `AuthLayout`, `ErrorLayout`.
- **Composables are now part of the public API** — overlay/keyboard utilities
  (`useFocusTrap`, `useClickOutside`, `useEscapeKey`, `useScrollLock`,
  `useListNavigation`), form helpers (`useFieldA11y`, `useFormErrors`,
  `usePasswordManagerAttrs`), data-table helpers (`useSort`, `useSelection`,
  `usePagination`), plus `useControllable` and `useRootAttrs`.
- **Helpers** — `cx` class combiner and `resolveTone` with the
  `Tone`/`LegacyTone` types.
- **Storybook** — Foundations docs (colors, typography, spacing, radii &
  shadows, icons), example pages (Auth, Errors, Dashboard), docs + a11y
  addons, and per-story play functions that run in CI via Playwright.

### Migration notes

Non-breaking, but worth knowing when upgrading:

- **Tones unified.** `Badge`/`StatusBadge` now use the semantic tones
  `neutral | info | success | warning | danger`; `Alert` gained `danger`.
  The old values (`gray`/`blue`/`green`/`amber`/`red`, Alert's `error`) keep
  rendering identically via `resolveTone()` but log a dev-only deprecation
  warning and will be removed in the next major.
- **Dropdown DOM changed.** The root moved from `<details>/<summary>` to
  `<div><button aria-haspopup="menu">…` with full keyboard support (arrows,
  Home/End, Escape, click-outside). Props and slots are unchanged; only CSS
  targeting `details`/`summary` needs updating. Optional `v-model:open`.
- **Button** gained a `loading` prop (spinner + `disabled` + `aria-busy`);
  the default slot is now wrapped in a layout `<span>`.
- **Modal** now traps focus, locks page scroll, restores focus on close and
  supports `initialFocus`; API unchanged.
- **FileInput** supports `v-model` (`File[]`); the previous `change`
  (FileList) emit is retained. It now renders inside the standard control box.
- **`Switch`** is a new alias export for `Toggle` (both names work).
- **Components moved** into `src/components/{atoms,molecules,organisms,layouts}`;
  the public API (`src/index.ts`) is unchanged.
- **Storybook story IDs changed** with the new `Foundations/Atoms/Molecules/
  Organisms/Layouts/Pages` hierarchy — deep links into the published
  styleguide need re-copying.
- **Bugfix:** dismissed toasts were hidden but never removed from the DOM
  (`useToast` reassigned the array its consumers had captured); they are now
  spliced in place.

## License

MIT © codebar Solutions AG
