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

> **Note:** the package is public, but GitHub's npm registry still requires
> authentication to install. Set `GITHUB_TOKEN` to any GitHub token with the
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

## License

MIT © codebar Solutions AG
