# Changelog

All notable changes to `@codebar-ag/storybook`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.11.0

### Added

- **`Modal` gained an `lg` size** (`md` | `lg` | `full`, default `md`).
  `max-w-3xl` instead of `max-w-lg`, sizing its own height exactly as `md`
  does — only wider.

  The gap it fills: `md` is reading width, and the only step up was `full`,
  which stretches the panel to the entire viewport and scrolls the body slot.
  Content that is intrinsically *wide* but not *tall* — a small table, fields
  side by side, a list of dotted key paths like
  `document.dossier.custom_field_3` — fits neither. Forced into `full`, a
  six-line dialog renders as a full-screen panel with its content stranded at
  the top, which reads as a broken page rather than a dialog; kept at `md`, it
  wraps every line it should not.

  **Consumers need no change.** The prop already existed and still defaults to
  `md`; `full` is untouched.

## v1.10.0

### Added

- **`DataTable` gained a `#row-detail="{ row }"` slot** — a full-width block
  rendered directly beneath each row, for showing what a row is *related to*
  (its runs, its children, its recent activity) without sending the reader
  through a drilldown to find out. It spans the whole table width, is not
  clickable, and carries no divider between itself and the row above, so it
  reads as part of that row rather than as a row of its own.

  There is deliberately **no expand/collapse prop, no state and no emit**:
  visibility is the caller's, expressed by rendering nothing inside the slot
  for a row with nothing to show. That keeps the API change to one optional
  slot, and keeps per-row open/closed state — which would need a v-model, a
  key strategy and a decision about what pagination does to it — out of the
  component until something actually needs it.

  **Consumers need no change.** A table that binds no `#row-detail` renders
  exactly the markup it did before.

### Changed

- **The row divider moved from `<tbody>` onto the rows themselves.** It was
  `[&>tr]:border-t [&>tr]:border-line [&>tr:first-child]:border-t-0` on the
  `<tbody>`, which a detail row — a `<tr>` like any other — would have been
  caught by, drawing a line between a row and its own detail block. It could
  not be cancelled from the detail row either: `.…\:border-t > tr`
  (specificity 0,1,1) out-specifies a plain `.border-t-0` (0,1,0). Every row
  that used to draw a divider still draws one, and `first:border-t-0` keeps
  the first row flush under the header. **No visual change for any existing
  consumer.**

- **The data-row `v-for` moved onto a wrapping `<template>`.** It previously
  sat on the `<tr>` alongside `v-else`, and an element carrying `v-for`
  renders exactly one element per iteration — so no sibling row could be
  emitted per data row without this. Rendered output is unchanged when
  `#row-detail` is unbound.

## v1.9.8

### Fixed

- **v1.9.7 named one control it could not fix, and this is it.** `DataTable`'s
  row-selection checkbox is a bare `size-4` `<input type="checkbox">` — a
  **16x16** target, below this kit's 44px standard and below the 24x24 floor
  WCAG 2.5.8 Target Size (Minimum, AA) sets. `touchTargetClasses` cannot reach
  it: an `<input>` is a *replaced* element and generates no `::before`/`::after`
  at all, so the declaration applies and the browser draws nothing. The
  technique that fixed four other controls is simply inert here. Selecting a row
  on a touch screen meant hitting a 16px square, and that is the control every
  bulk action starts with.

  The way past a replaced element is to stop growing the element and grow
  something wrapped around it. The input now sits inside a `<label>`, which
  forwards its own clicks to the input natively — no JS, no `for`/`id` pair to
  keep unique per row — and which, unlike the input, does render
  pseudo-elements. The label stays `static` so its absolutely positioned
  `::before` resolves against the `relative` table cell instead, and fills it.

  | Control | Target before | Target after |
  |---|---|---|
  | Row checkbox, comfortable rows | **16 x 16 px** | 48 x 57 |
  | Row checkbox, plain comfortable rows | **16 x 16 px** | 48 x 46 |
  | Row checkbox, `density="compact"` | **16 x 16 px** | 48 x 34 |
  | Select-all checkbox, header | **16 x 16 px** | 48 x 40.5 |

  **Two of those four are not 44 tall, and are not claimed to be.** The target
  is the selection cell, so it is exactly as tall as its row — and a compact row
  is 34px, a header row 40.5px. Giving those a fixed 44px target would push it
  5px into the row above and 5px into the row below, and *every one of those
  rows has a checkbox of its own*: the rows would trade each other's clicks, and
  a mis-selected row in a table with bulk delete behind it is worse than a small
  one. Filling the cell takes every pixel that is genuinely free and not one
  more. Even at its worst that is 34px — four times the area of the 16px box it
  replaces, and above the WCAG floor — while comfortable rows, the default,
  clear 44 on both axes.

  **Nothing about the rendering changes.** The checkbox is still drawn at 16x16,
  the label is left inline and unstyled in flow so it generates no box of its
  own, and only the out-of-flow `::before` is new. Row heights, column widths
  and the checkbox's own position come out bit for bit identical — asserted, not
  assumed: the test measures the table, unwraps every label back to the bare
  input it used to be, measures again, and requires the two to be equal. That
  compares the page against itself rather than against recorded pixel numbers,
  so it cannot drift with platform font metrics.

  `row-click` still works, and still does not fire from the checkbox. The
  enlarged target now covers a whole cell *of a clickable row*, so this matters
  more than it did: a click there targets the `<label>`, which the organism's
  "did this land on something interactive?" guard already recognised alongside
  `a`, `button` and `input`. A test clicks the bottom-left corner of the target
  — inside the enlarged area, clear of the input — and asserts the row is
  selected, is not opened, and toggles exactly once.

  The two class strings live next to `touchTargetClasses` in
  `src/helpers/touchTarget.ts` as `touchTargetBoundsClasses` and
  `touchTargetLabelClasses`, and both are exported. The pair belongs beside the
  original: which of the two techniques a control needs is decided entirely by
  whether it can carry a pseudo-element, and that is a fact worth having
  written down in one place rather than rediscovered per component.

  Sizes are measured by hit-testing, not by reading back the CSS. A
  pseudo-element has no `boundingBox()`, and Chrome's
  `getComputedStyle(el, '::before')` reports its box a pixel short of what it
  actually hit-tests — trusting it would have baked a rounding artefact into
  every number above. The tests instead step `elementFromPoint` outward from the
  input's centre one pixel at a time until the label stops answering, which is
  the hit area itself, found the same way a finger finds it. Neighbouring
  targets are then checked pair by pair for overlap, in both densities.

  `Checkbox`, `Radio` and `Toggle` were checked for the same defect and do not
  have it — each already wraps its input in a label with real layout
  (`min-h-11`, or `p-3` for `Radio`'s card). That is now asserted rather than
  assumed, along with the fact that two stacked instances do not overlap.

  Two stories are new, because the failure modes only appear in combinations
  nothing covered: `DataTable/CompactSelectable` (compact rows *and* a selection
  column *and* a stuck header — the tightest arrangement the table offers) and
  `DataTable/RowClick` (selection and row navigation on the same rows, with both
  counters rendered so the assertion can be made from outside the component).

## v1.9.7

### Fixed

- **The kit shipped two control families whose reach differed by a factor of
  five, and they sit next to each other in real UI.** Every `Button` is `h-11`
  (44px) at *every* size — `sm`, `md` and `lg` all resolve to the same height,
  which is a deliberate, documented decision. The small icon-only controls never
  got the same treatment, and measured against the built Storybook they came out
  at:

  | Control | Target before | Target after |
  |---|---|---|
  | `Modal` close | **9.6 x 24 px** | 44 x 44 |
  | `Drawer` close | **9.6 x 24 px** | 44 x 44 |
  | `CopyButton` | 24 x 24 px | 44 x 44 |
  | `Navbar` menu toggle | 36 x 36 px | 44 x 44 |

  The two dialog close buttons are the serious ones: they were an unstyled
  `&times;` glyph with no box of their own, so the whole hit area was the width
  of the character — **9.6px**, which is not just below this kit's 44px but
  below the 24x24 floor WCAG 2.5.8 Target Size (Minimum, AA) sets. Closing a
  dialog on a touch screen was a coin flip, and the control most likely to be
  reached for in a hurry was the hardest one in the kit to hit.

  All four now carry `touchTargetClasses` from the new
  `src/helpers/touchTarget.ts`, which hangs a transparent 44x44 `::after` off
  the control, centred on it. The pseudo-element is out of flow, so **nothing
  about the rendering changes**: the copy chip is still 24px of visible box and
  still does not out-weigh the text beside it, no neighbour shifts, no row grows.
  But a pseudo-element hit-tests as part of the element that generates it, so a
  pointer or finger anywhere inside the 44px square activates the control.

  A fixed centred `after:size-11` is used rather than the more familiar
  `after:-inset-2`. An inset is measured from the control's own border box, so
  it lands on 44px for exactly one control size and silently under- or
  over-shoots for every other — with four controls at three different sizes
  sharing one helper, that difference is the whole point. The technique is also
  purely additive: it can only grow a hit area, never shrink one, so it stays
  safe on a control that is already big enough.

  Two limits are documented in the helper. Replaced elements (`<input>`,
  `<img>`) render no pseudo-elements, so `DataTable`'s bare `size-4` row
  checkbox — 16x16, also under the WCAG floor — cannot be fixed this way and
  still needs a padded label wrapper. And targets grow outward, so two of them
  closer than 44px apart overlap; `InputNumber`'s edge-to-edge `-`/`+` steppers
  are therefore left at 36x36 (above the WCAG floor, `tabindex="-1"`, and fully
  operable from the input itself) rather than have them steal each other's
  clicks. `Toaster`'s dismiss button already reserves real layout space with
  `min-h-11 min-w-11` and is left alone — a control that can afford 44px of box
  should just have 44px of box.

  `touchTargetClasses` is exported, so consuming apps can give their own
  icon-only buttons the same reach instead of re-deriving the trick per
  component.

  The geometry is asserted, not assumed. `tests/touch-target.spec.ts` reads the
  pseudo-element's computed box **and** probes the four corners of the 44px
  square with `elementFromPoint`, checking first that each probe genuinely falls
  outside the control's own border box — so what passes is the browser's own
  hit-testing, not a restatement of the CSS it was generated from. A final test
  clicks 6px *below* the copy chip's bottom edge and asserts the clipboard write
  actually happens.

## v1.9.6

### Fixed

- **Every dev warning this kit ships was compiled out of the published bundle,
  so none of them had ever reached a consumer.** The guards were written as
  `import.meta.env.DEV` — but Vite resolves that at *this package's* build time,
  not the consuming app's. Building the library for production folded the check
  to a literal `false` and tree-shaking dropped the branch. `dist/flows.js`
  contained **zero** occurrences of `console.warn`.

  The practical cost: `resolveTone()`'s deprecation notice, whose entire job is
  to tell an app it is still passing `green`/`red`/`amber`, could not fire in any
  environment of any published version. One consuming app had accumulated **41**
  legacy tone values across 9 files without a single line of feedback.

  Dev guards now go through `isDev()` in `src/helpers/dev.ts`, which reads
  `process.env.NODE_ENV` — left verbatim by the library build for the *consumer's*
  bundler to substitute (`"development"` while developing, `"production"` in a
  release build, where the branch folds away). This is the same mechanism Vue's
  own `esm-bundler` build uses for `__DEV__`.

  Three candidate guards were compiled and inspected in a real `vite build`
  before settling on this one:

  | Guard | Compiles to |
  |---|---|
  | `import.meta.env.DEV` | `return !1` — dead |
  | `process.env.NODE_ENV !== 'production'` | preserved verbatim — **works** |
  | `globalThis.process?.env?.NODE_ENV` | preserved, but browsers have no `process` global, so the optional chain yields `undefined !== 'production'` → warnings *in production* |

  `npm run build` now runs `scripts/verify-dev-warnings.mjs`, which fails the
  build if `console.warn` disappears from `dist`, if the `process.env.NODE_ENV`
  read is missing, or if any `import.meta.env` gate creeps back in. Neither
  Storybook nor the Playwright suite can catch this class of bug — both compile
  from `src`, where the guard is still live — so it is asserted against the
  built artefact.

- **`resolveTone()` returned unknown values unchanged**, which indexed the
  caller's palette to `undefined` and rendered the badge with no tone classes at
  all. A typo such as `succes` now warns and falls back to the component's
  default tone.

### Added

- **Unknown `variant` / `size` / `tone` / `placement` values now warn in
  development instead of failing silently.** Every atom resolved its variant with
  `variants[props.variant] ?? variants.primary`. The props *are* typed unions, so
  TypeScript catches a bad value — but only at a TypeScript call site. Consuming
  apps write plain-JS SFCs, where the union is erased and nothing checks it.

  A real case: `<Button variant="success">`. `success` is valid on `Alert`,
  `Badge`, `Card` and `IconBadge`, but **not** on `Button` — whose vocabulary is
  `primary | secondary | ghost | danger | subtle | cta`. It rendered as `primary`,
  silently, directly beside a genuine `primary` button. The author intended two
  weights; the user saw two identical buttons.

  The fallback itself was correct — a wrong variant must never blank out a
  control. What was missing is that it happened quietly. The new `pick()` helper
  (`src/helpers/pick.ts`) keeps the fallback and adds a one-time dev warning that
  **names the valid keys**, because the vocabulary genuinely differs per
  component and "which values are legal here" is the caller's actual question:

  ```
  [flows] Unknown Button.variant "success". Expected one of:
  primary | secondary | ghost | danger | subtle | cta. Falling back to "primary".
  ```

  Applied to `Button` (variant, size), `Card`, `Link`, `Badge`, `Avatar`,
  `Spinner`, `Icon`, `IconBadge` (size, shape, variant), `Tooltip`, `FormGrid`,
  `FormActions`, `AuthLayout` and `Toaster`.

  Warnings are de-duplicated per unique value: these resolve inside `computed()`
  getters, and one warning per re-render would bury the first useful message
  under hundreds of copies in a list.

- **`AuthLayout.maxWidth` and `Toaster.maxWidth` had no fallback at all.** An
  unknown key produced `undefined`, so the element rendered with no `max-width`
  class and stretched to fill its column. Both now fall back to their documented
  default and warn.

**Consumers need no change.** Rendering is identical in production; the only new
behaviour is console output in development. Expect deprecation warnings to appear
on first upgrade — those are pre-existing legacy tone values that were always
being silently remapped, now finally visible.

## v1.8.0

### Fixed

- **The design system declared JetBrains Mono but never shipped it, so every
  consuming app rendered in the OS monospace fallback.** `--font-mono` named
  `"JetBrains Mono"` in `tokens.css`, but the only font actually loaded was Open
  Sans (used by the DocuWare mirror). The UI font was set on the Storybook canvas
  via `.storybook/storybook.css` — a file excluded from `files: ["dist"]`, so it
  reached the canvas and no consumer. Apps fell through to `ui-monospace`: SF
  Mono on macOS, Consolas/Cascadia on Windows, DejaVu Sans Mono on Linux, with
  different metrics on each.

  The font is now loaded from the published `src/tokens.css`, self-hosted via
  `@fontsource/jetbrains-mono` (a real `dependency`, so consumers receive the
  files transitively). Latin subset, weights 400/500/600/700. Self-hosted rather
  than CDN-loaded because consumers ship their own privacy policy and DPA, and a
  webfont CDN sends every visitor's IP to a third party on first paint.

  **Consumers need no change** — `@import "@codebar-ag/storybook/tokens.css"`
  already pulls this in. Expect a visible shift in glyph metrics on first
  upgrade: that is the app finally rendering in its own brand font.

### Added

- **`AuthLayout` gained a `maxWidth` prop** (`md` | `lg` | `xl` | `2xl`,
  default `md`). The card was hardcoded to `max-w-md`, which forced apps with
  wider auth-adjacent screens — onboarding with side-by-side billing fields,
  consent screens with a document preview — to fork the component's markup.

- **`PageHeading` gained `breadcrumbs` and `breadcrumbAs` props.** The trail and
  the title are one visual unit (the trail's bottom spacing is part of the
  heading block's rhythm), and consuming apps were otherwise re-pairing
  `Breadcrumbs` with `PageHeading` by hand on every nested page. Pass
  `breadcrumbAs` (e.g. Inertia's `Link`) for SPA navigation.

### Changed

- **`PageHeading`'s title row is now `min-h-11`.** A page with an action cluster
  and a page without now align their titles on the same baseline; previously the
  row's height tracked whether the page happened to have actions, so consecutive
  pages visibly jumped. Bare headings grow by up to 16px.

- **`AuthLayout` pins its footer to the bottom of the viewport** instead of
  centering the whole stack as one group. Renders identically when no `#footer`
  slot is passed; only footer-using callers see the difference.

- **Type-scale documentation corrected.** `--text-xl` (20px) was labelled
  "auth/section headers" and `--text-2xl` (24px) "page H1", but `PageHeading`
  renders `text-xl` and only `ErrorLayout` uses `text-2xl`. Comments and the
  token catalogue now match what the components do. No values changed.

## v1.7.1

### Fixed

- **`Input` hid credential fields from password managers even with an
  explicit `autocomplete`.** `usePasswordManagerAttrs()` set
  `data-1p-ignore`/`data-lpignore` on every non-password `Input` unconditionally,
  so 1Password and LastPass couldn't recognize fields like a login form's email
  input even though it passed `autocomplete="username"`. The ignore attrs now
  apply only when the caller left `autocomplete` unset, the same condition that
  already gated `autocomplete="off"`.

## v1.7.0

### Added

- **Tokenless installs from this repository.** A `prepare` script builds `dist`
  on install, so the package can be consumed straight from the public repo as a
  git dependency and no GitHub Packages token is needed:

  ```json
  "@codebar-ag/storybook": "github:codebar-ag/storybook.codebar.ch#v1.7.0"
  ```

  `files` is `["dist"]` and `dist` is gitignored, so a git install previously
  resolved to a package with no entry point at all. It also means `npm publish`
  always ships a freshly built `dist` rather than whatever was last in the
  working tree.

- `CHANGELOG.md` — release notes now live here instead of in the README.

### Fixed

- **The dependency tree could not be installed at all.** `npm ci` failed on
  `main` — and with it the `release`, `pages` and `test` workflows — because
  `@storybook/vue3-vite` was `^10.5.3` while `storybook` stayed `^9.0.0` and both
  addons `^9.1.20`, leaving its peer requirement of `storybook@^10`
  unsatisfiable.

- **All five security advisories cleared** (`npm audit`: 0 vulnerabilities, was
  5 high). The half-finished `^10.5.3` bump was reaching for a real fix, so it
  was completed rather than reverted: aligning the Storybook family on `^10.5.5`
  pulls `vue-component-meta` and `@vue/language-core` to versions whose
  `minimatch`/`brace-expansion` are patched, and takes `postcss` to `8.5.25`,
  closing the source-map path-traversal advisory.

- **`main` had lost the published v1.6.0.** That release was tagged and
  published from a commit that was never merged, so `main` was missing
  `CodeEditor`, `FullscreenPanel`, `Card`'s `sm` size, the `PageHeading` actions
  slot and the `CodePreview` changes — 437 lines that consumers on `^1.6.0`
  already depended on. Merged back in; anything released from `main` before this
  would have silently regressed them.

- **Types are a single bundled `index.d.ts` again.** `vite-plugin-dts` 5 renamed
  `rollupTypes` to `bundleTypes` and *ignores* the old name instead of rejecting
  it, so the build had quietly started emitting split per-component
  declarations — an 84 KB entry point became 9 KB plus a `components/` tree.
  Consumers that parse the declaration file rather than merely importing from it
  saw an apparently valid file describing almost nothing. Adds
  `@microsoft/api-extractor`, which `bundleTypes` requires.

- Two implicit-`any` handler parameters in `Pagination.vue`. Pre-existing and
  unrelated to the upgrade, but `typecheck` could not run while the tree was
  uninstallable, so nothing had reported them.

### Changed

- Storybook and its addons: `^9` → `^10.5.5`. No config migration was needed —
  the full docs build and all 184 Playwright story tests pass unchanged.
- `publishConfig.access`: `restricted` → `public`. This affects *future*
  publishes only. The existing package's visibility is a setting on the package
  itself, and GitHub's npm registry requires a token for every read regardless
  of visibility — the git dependency above is what actually removes the token.

## v1.6.0

- `CodeEditor` and `FullscreenPanel` promoted to the public API.
- `PageHeading` gained an actions slot.
- `Card` gained the `sm` size.
- `CodePreview` and `useEscapeKey` refinements, plus `codeMirrorTheme` helper.

> **Note:** published to GitHub Packages but never merged to `main`. If you
> pinned a git dependency to a commit rather than the tag, upgrade to v1.7.0,
> which is the first release where `main` actually contains this work.

## v1.5.0

- `Toaster` gained a `maxWidth` prop.
- `DataTable` row cursor fix.

## v1.4.3

- Maintenance release.

## v1.4.2

- **Placeholder names in story fixtures.** Real client and person names were
  replaced with `Mustermann AG` / `Max Mustermann` placeholders (and
  `mustermann.*` hosts) throughout the Storybook stories. No component or API
  changes.

## v1.4.1

- **All-mono restored.** v1.4.0 switched the UI font to Inter; that is reverted.
  The all-mono look (JetBrains Mono everywhere, via `--font-mono`) is the
  brand's visual identity and is intentional. Skip v1.4.0 and upgrade straight
  to v1.4.1.

## v1.4.0

- Switched the UI font to Inter. **Superseded — do not use;** see v1.4.1.

## v1.3.1

- Restored the package name `@codebar-ag/storybook`.

## v1.3.0

### Added

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

## v1.2.0

- First public shape of the design system: Vue 3 + Tailwind v4 atoms, tokens
  and Storybook.
