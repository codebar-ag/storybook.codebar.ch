# Changelog

All notable changes to `@codebar-ag/storybook`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
