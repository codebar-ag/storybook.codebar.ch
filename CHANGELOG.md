# Changelog

All notable changes to `@codebar-ag/storybook`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
