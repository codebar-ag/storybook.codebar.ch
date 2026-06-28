# @codebar-ag/flows

Shared **Vue 3 + Tailwind v4** design-system atoms and design tokens for codebar-ag
applications, documented in **Storybook**. One source of truth so every app looks
identical.

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
npm install @codebar-ag/flows
```

## Use

**1. Tokens + Tailwind** — in your app's `app.css`:

```css
@import "@codebar-ag/flows/tokens.css";   /* @theme: colors, type scale, radius */
@import "tailwindcss";
@source "../../node_modules/@codebar-ag/flows/dist";  /* scan atoms for classes */
```

The `@source` line is required: Tailwind must scan the compiled atoms so their
utility classes are generated in your app's stylesheet.

**2. Register the atoms** — in your Vue entry:

```ts
import { Flows } from '@codebar-ag/flows';
createApp(...).use(Flows);   // global <Button>, <Card>, <Icon>, …
```

Or import individually:

```ts
import { Button, Card, useToast } from '@codebar-ag/flows';
```

**3. Toasts** — mount `<Toaster />` once near the root, then `push()` from anywhere:

```ts
import { pushToast } from '@codebar-ag/flows';
pushToast({ message: 'Saved.', type: 'success' });
```

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
