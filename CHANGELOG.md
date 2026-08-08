# Changelog

All notable changes to `@codebar-ag/storybook`.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.19.0

Four findings from the app that adopted 1.18.0, three of them acted on and one
declined. One is a rendering bug that had been shipping for the life of the
component: `CodeEditor` had no `yaml` mode and highlighted YAML as JSON without
saying so.

**This release adds a peer dependency.** `@codemirror/lang-yaml` — see
[Upgrade notes](#upgrade-notes). Nothing else here requires a change to a
call site.

### Added

- **`CodeEditor` and `CodePreview` accept `language="yaml"`**, parsed by
  `@codemirror/lang-yaml` and highlighted through the same shared theme as
  every other code surface in the kit.

  The editor previously loaded the JSON grammar for **anything that was not
  `markdown`**, so a consuming app's compiled-flow-definition page had been
  highlighting YAML through a JSON parser since the day it was written. The
  reason nobody noticed is worth recording, because it is what makes this class
  of bug expensive: the wrong grammar does not fail loudly on YAML. Run the
  JSON parser over a typical flow definition and it still paints nine tokens —
  every `:` as punctuation, every bare integer as a number — which reads as
  syntax highlighting from across the room. What it cannot paint is `#`, a
  comment in YAML and nothing at all in JSON. The `Yaml` story asserts on that
  line specifically, and fails if the document is served the JSON grammar; a
  "some token is coloured" assertion passes on the broken version.

  `CodePreview` gains the mode too. A kit that can edit YAML but only preview
  it as plain text is a difference no caller can explain.

- **An unknown `language` now renders unhighlighted and says so**, instead of
  silently falling back to JSON. Both components warn once per unknown value in
  development, through the same `warnOnce` path as every other dev diagnostic
  here. A component that quietly picks the wrong grammar is worse than one that
  refuses the mode: the first is indistinguishable from working.

  `language` is a typed union, so the only callers who can reach that arm are
  untyped ones — which is exactly who has no compiler to tell them.

- **`DataTable` warns in development when `rowKey` is missing.** It has always
  been a required prop with no default, and until now nothing said so at
  runtime: nine call sites in one consuming app shipped without it, so every
  row in those tables was keyed `undefined` and Vue could not tell any row from
  any other.

  Vue's own "Missing required prop" warning cannot fire for **any** prop in
  this package, which is why the years passed quietly. The library is compiled
  with `isProd: true`, and `@vue/compiler-sfc` emits `type` and `required` only
  for a development build — the published bundle declares the prop as the bare
  `rowKey: {}`. Rendering `<DataTable>` with no `rowKey` against a development
  build of Vue produces no Vue warning at all. This is the same shape as the
  `import.meta.env.DEV` problem documented in `src/helpers/dev.ts`: a
  diagnostic that reads as working and is compiled away before it reaches
  anyone. The check is therefore written out by hand, like the tone
  deprecation, and verified against the built bundle rather than against `src`.

  Every other required prop in this kit is unvalidated at runtime for the same
  reason. Only `rowKey` is covered here, because only `rowKey` has evidence
  attached; a general fix means compiling the library in development mode, and
  that is its own release.

### Changed

- **`CodeEditorProps.modelValue` is `string | null`.** The runtime has always
  accepted null — `?? ''` guards every read of it, and an empty document is
  what it renders — but the type said `string`, so callers holding a nullable
  column (a definition that has not been compiled yet, an optional description)
  coerced with `?? ''` at the call site for a default the component already
  applies. Same shape as `BreadcrumbItem.href` in 1.18.0: the type was narrower
  than the behaviour.

  Deliberately **not** widened to `string | number | null`, which is what
  `Input` takes. `Input` is a native `<input>` whose `value` the DOM stringifies
  anyway; `CodeEditor` holds a *document*, and a number would have to be
  silently stringified into one on the way in and handed back as a string on
  the way out. `Textarea` — the multi-line text sibling, and the closer
  analogue — is `string | null` for the same reason.

### Not changed: `DataTableColumn.key`

The fourth finding asked for `key: keyof T & string`, so the `#cell-<key>` slot
could type `value` as `T[K]` instead of `unknown`. Declined, on three grounds.

**It would forbid a column that is not a row property.** An action or computed
column — `{ key: 'actions', label: '' }` rendered through `#cell-actions` — is
a real and supported pattern, and the kit ships no other way to put one
anywhere but the trailing `#row-actions` cell.

**`SortState.key` is a free string on purpose.** It is emitted to the caller
and, in server mode, straight on to an API. Sort keys naming a joined or
computed column that is not in the row DTO are ordinary. Narrowing the column
key without narrowing that leaves the two disagreeing.

**And for most row types it would buy nothing at all.** `DataTable` is
`<T extends Record<string, unknown>>`. An *interface* only satisfies that
constraint by declaring the index signature — which is what this package's own
`DataTable` story does, and what a consuming app's row types have to do — and
once `[key: string]: unknown` is present, `keyof T & string` **is** `string` and
`T[K]` **is** `unknown`. The proposed narrowing is the identity function on
exactly the row shapes it was proposed for. It would only bite for rows
declared as type aliases, which get an implicit index signature and keep their
exact keys.

That last point locates the real obstacle: it is the `Record<string, unknown>`
constraint, not `key`. Relaxing it (to `T extends object`, with the internal
indexing and the `useSort` signature adjusted to match) is what would make an
exact `value` possible, and it is strictly more permissive, so it would break
nobody. It is also a much larger change than a type narrowing, and it is not in
this release.

Eleven consumer bindings moved from `{ value }` to `{ row }` in the meantime,
which is better code regardless: `row.name` is exact today, under both row
shapes, with no change to this package.

### Upgrade notes

**Install `@codemirror/lang-yaml`.**

```bash
npm install --save-dev @codemirror/lang-yaml
```

It is declared optional in `peerDependenciesMeta`, in step with every other
`@codemirror/*` grammar here, but "optional" describes the manifest and not
what a bundler does. `dist/flows.js` is a single file that dynamic-imports
every grammar by bare specifier, so a consuming build resolves all of them
whether or not the app ever renders an editor — which is already true of
`lang-json`, `lang-markdown`, `commands`, `language`, `state` and `view` today,
and is why every existing consumer already has that set installed. This release
adds one more package to it. An app that upgrades without installing it will
fail to resolve the import at build time, not at runtime.

Two smaller things can change behaviour, both only for code that was already
outside the declared types:

- **An unknown `language` no longer highlights as JSON.** If an untyped call
  site was passing something the union does not contain and was, by accident,
  getting the JSON grammar, it now gets no grammar and a development warning.
  A call site that was passing `"yaml"` and getting JSON gets YAML.
- **`CodeEditorProps['modelValue']` includes `null`.** Reading it out into a
  `string` needs a fallback. Passing values *in* is strictly freer.

`DataTable`'s new warning is development-only and fires once per page, but an
app with tables missing `rowKey` will start seeing it immediately. It is
reporting a real defect in those tables — the rows have no distinct keys — and
not a new requirement.

## v1.18.0

A types-only release, prompted by a consuming app that stood up a `vue-tsc`
lane over 152 components for the first time and found out what this package
does and does not let it say. **No component changes behaviour.** Not one
template, class, token, prop default or emitted value differs; every call site
that renders correctly today renders byte-identically after this. Everything
below happens at the type boundary.

There is no v1.17.0 — see the note at the end.

### Added

- **Every component now exports a named `<Name>Props` type.** 73 of them, one
  per component, re-exported from the barrel.

  The supporting types were all exported already — `Tone`, `Category`,
  `SelectOption`, `DataTableColumn`, `BreadcrumbItem`, `TabItem`, `RowKey`,
  `SortState`, `IconName` — which is what made the gap conspicuous rather than
  merely absent. The props themselves reached `dist/index.d.ts` as **71
  anonymous `__VLS_Props` interfaces**, the names `vue-tsc` generates for a
  type literal passed inline to `defineProps`. Nothing can import those. A
  consuming app wrapping an atom therefore re-declared the unions by hand, and
  they drifted the moment either side moved: a `ConfirmDialog` over `Modal`
  declaring `variant: String` compiles in the app and fails against
  `'danger' | 'primary' | …` at the boundary.

  So a wrapper can now say what it means:

  ```ts
  import type { ButtonProps, ModalProps } from '@codebar-ag/storybook';

  defineProps<{
      size?: ModalProps['size'];
      variant?: ButtonProps['variant'];
  }>();
  ```

  …or take the whole surface, which `@vue/compiler-sfc` resolves out of the
  published `.d.ts` well enough to emit runtime props from:

  ```ts
  defineProps<ButtonProps>();
  ```

  `dist/index.d.ts` now carries 73 named prop interfaces and zero
  `__VLS_Props`. A new `verify:props` build step keeps the three parts in
  step — the SFC declares the interface, the barrel re-exports it, and
  api-extractor carries it into the bundled declarations. Only the last is
  observable to a consumer, and a type exported from source but dropped from
  the rollup is invisible until an app tries to import it.

- **`SelectOption` takes its value type as a parameter**, and the two controls
  that hand an option's value back to the caller — `SearchableSelect` via
  `update:modelValue`, `Combobox` via `@select` — are generic over it. A caller
  whose values are all strings says so once, on the options, and stops
  coercing with `String()` at every call site that writes into a string-typed
  form field.

  Both infer the parameter from `options` and `modelValue` together, so binding
  a plain `string` model widens it rather than pinning it to the literal union
  of an inline options array.

  `Select` is deliberately **not** generic, and the source says why: it is a
  native `<select>`, its change event carries `HTMLSelectElement.value`, and
  the DOM has already stringified that. A `SelectOption<number>` there emits
  `"1"` and not `1` — typing the emit as the parameter would be a lie the
  compiler could not catch.

### Changed

- **`BreadcrumbItem.href` accepts `null`.** `Breadcrumbs` has always rendered a
  plain `<span>` for a crumb whose `href` is falsy — an ancestor with no page
  of its own, a label-only segment. The type just never said so, and every
  caller assembling a trail from optional route data paid for the gap: typing
  one wrapper's `breadcrumbs` prop as `BreadcrumbItem[]` in a consuming app
  produced roughly 64 errors, all of them this one restated. The interior
  non-link crumb is now also a story, since it was reachable but undocumented.

- **Every array a component accepts is `readonly`.** `Accordion`,
  `Breadcrumbs`, `Chart`, `Combobox`, `DataTable`, `FileInput`, `KindLegend`,
  `PageHeading`, `ResourceList`, `SearchableSelect`, `Select`, `Stepper`,
  `Tabs`.

  Vue props cannot be mutated at runtime, so `options: SelectOption[]` was
  never a promise the component kept — it only filtered out callers whose array
  happened to be readonly, which generated translation types and `as const`
  fixtures routinely are. Declaring the input readonly says what was already
  true and accepts strictly more.

  Readonly in, mutable out: the headless composables widen their *inputs*
  (`useSort`'s rows, `usePagination`'s `sliceOf`, `useSelection`'s keys and
  controlled selection) and keep handing back mutable arrays, copying once at
  the boundary. `useSort`'s unsorted branch now copies instead of passing the
  caller's array straight through, which it should have been doing anyway.
  `verify:props` fails the build on a mutable array prop, because a stance like
  this is only worth anything if it holds for all of them.

- **`verify:version` runs on every pull request**, asserting that
  `package.json` neither matches an existing tag nor sits behind the highest
  one, and the README gains a release checklist. See below for what this is
  for.

### Upgrade notes

Nothing here changes what a component *does*, so no template needs touching.
Three of the changes can nonetheless fail an app's type-check, all in narrow
positions:

- **`BreadcrumbItem.href` is `string | null | undefined`.** Code that *reads*
  a crumb's href into a `string` now needs a fallback. Code that *builds*
  crumbs is strictly freer than before.
- **Array props are `readonly T[]`.** Assigning one back out to a mutable array
  type — `const steps: Step[] = props.steps` — needs a copy. Passing arrays
  *in* is strictly freer.
- **`SearchableSelect` and `Combobox` are generic components.** `typeof
  SearchableSelect` is no longer a plain `DefineComponent`, so
  `Meta<typeof SearchableSelect>` and similar type-level gymnastics need the
  same untyped treatment `DataTable` has always needed. Templates are
  unaffected.

`SelectOption`'s parameter defaults to `string | number`, so every existing
`SelectOption[]` annotation — including ones carrying numeric ids, which this
package supports on purpose — means exactly what it did before.

### A note on v1.17.0

**There is no 1.17.0, and there never will be.** The tag `v1.17.0` exists and
resolves, but the tree it points at is 1.16.1: `release/v1.16.1` was bumped
correctly and then tagged by hand under the wrong name. The Release workflow
caught the mismatch and refused to publish, so **1.16.1 never reached the
registry and no GitHub Release was cut** — and none of that mattered, because
this package is documented as a git dependency and `#v1.17.0` installs
straight from the tag. Consuming apps pinned it and got a build whose
`package.json` says 1.16.1. Nothing was broken; nothing said so either.

A tag is a release even when the release failed, and a pushed tag is
permanent. 1.17.0 is therefore spent, and this release skips it. If you are
pinned to `v1.17.0` you are running 1.16.1 and should move to `v1.18.0`.

## v1.16.1

One bug, found in a consuming app, and the two more the sweep for its shape
turned up. Nothing gains a prop, a slot, a token or a class; every call site
that renders correctly today renders byte-identically after this.

### Fixed

- **`Card` rendered no header — and so no `#actions` — when its only slot
  arrived after mount.** A card with neither `title` nor `description`, whose
  `#actions` template sits behind a `v-if`, never grew a header when the
  condition turned true. The consuming symptom was a page on which the Save
  button did not exist: the form could only be submitted by pressing Enter in
  its single text input, and implicit submission is the only reason that page
  was not a hard block. Card's own inner `v-if="$slots.actions"` was correct the
  whole time and simply unreachable, which is why reading the component does not
  find this and only trying it does.

  The header was decided by a `computed`:

  ```js
  const hasHeader = computed(
      () => props.title !== null || props.description !== null || !!slots.title || !!slots.actions,
  );
  ```

  **`useSlots()` does not return a reactive object.** Vue builds it once
  (`instance.slots = createInternalObject()`) and `updateSlots` **mutates that
  same object in place** on every parent render — the identity never changes and
  no proxy is watching, so nothing invalidates a computed over it. With no
  `title` and no `description` the expression evaluated `false` during mount and
  cached that for the lifetime of the card. The card *did* re-render — a
  conditional slot makes its slots non-stable, which forces the child to update
  — but a cached computed does not care that a render happened.

  The trap has a lid on it, and that is the part worth recording. Vue does track
  `$slots`: reading it through the public instance proxy calls
  `track(instance, 'get', '$slots')`, and in development `useSlots()` returns a
  proxy that does the same. Grep the matching `trigger(instance, 'set',
  '$slots')` in `@vue/runtime-core` 3.5 and there is **exactly one**, inside
  `updateSlots`, behind `if (isHmrUpdating)`. A computed over slots is therefore
  invalidated by hot module replacement and by nothing else: it recomputes while
  you edit the file — precisely when you would be looking at it — and never once
  in a built application. Switching the computed from `slots` to `$slots` would
  have looked like the fix and would have shipped the same bug.

  There is no version of this that is safe to cache, so the header is decided in
  the render and only in the render:

  ```html
  <header v-if="title !== null || description !== null || $slots.title || $slots.actions">
  ```

  A template *is* a render function, so the read happens once per render, after
  `updateSlots` has finished mutating the object — the only moment at which the
  answer is knowable. It is also what fourteen other components in this kit
  already do (`Modal`, `Drawer`, `Toggle`, `AppShell`, `Navbar`, …), so the fix
  deletes an outlier rather than introducing a mechanism.

  Two alternatives were rejected. **Mirroring the slot names into a `ref` from
  an `onBeforeUpdate` hook** does work and keeps a computed — but it makes a
  second copy of state Vue already owns, correct only for as long as the hook
  stays wired to it, in exchange for caching a four-term boolean. **Rendering
  the `<header>` unconditionally** and letting its contents collapse is the one
  option here that would be breaking: every plain card would gain an empty
  padded strip and a bottom border it does not have today.

- **`MetricGrid` counted its caller's syntax instead of its caller's tiles.**
  The filler tiles that stop the hairline-gap background showing through as a
  stray solid block were sized from `slots.default().length` — the length of a
  vnode array, which is not the number of tiles in either shape a real caller
  writes. `v-for` collapses its whole run into a single Fragment, so **three
  metrics read as one** and a nearly full row was padded with three fillers and
  drawn as a quarter-full one. `v-if` leaves a Comment placeholder behind when
  false, so **three metrics plus a hidden fourth read as four** and the filler
  the gap actually needed was never drawn. Both counts are now taken after
  flattening fragments and dropping comment and whitespace placeholders, and —
  same rule as `Card` — in the render rather than in a `computed`, so a grid
  whose tile count changes re-pads instead of keeping its first answer.

  Grids written with literal children, which is every story and every static
  call site, are unaffected: they counted correctly before and count correctly
  now.

- **`DataTable`'s `cursor-pointer` affordance answered for the vnode that
  existed at mount.** `hasRowClick` was a `computed` over
  `instance.vnode.props.onRowClick`, and `instance.vnode` is *replaced* on every
  parent render while `instance` is a plain object — the same defect against a
  different dependency. It is read per render now.

  The honest scope, because the fix is real but smaller than it looks: written
  as `@row-click` in an SFC the compiler emits a cached wrapper function, so the
  key is always present and the affordance was never wrong for that spelling. It
  is reachable by binding the handler as a value
  (`:onRowClick="editable ? open : undefined"`), and even then only partly,
  because Vue's `hasPropsChanged` deliberately skips declared emit listeners:
  binding `row-click` makes the listener live without asking this component to
  redraw at all. So the affordance now corrects itself at the next render for
  any other reason — which in a table is constant — where before it never
  corrected itself.

### Changed

- **`FormActions`, `PageHeading` and `Table` read `$slots` instead of a
  `useSlots()` binding.** Behaviour is identical — the same property on the same
  object, read at the same moment — and this is housekeeping with a point: the
  hazard was never the read, it is having a `slots` identifier sitting in setup
  scope where the next `computed` can close over it. `MetricGrid` is now the
  only component that calls `useSlots()`, because it needs to invoke the slot
  function rather than test for it.

### Notes

- Each of the three is pinned by a story whose play function fails on the
  previous code and passes on this one: a slot arriving and leaving after mount,
  a tile count from `v-for` and from `v-if`, a handler bound late. The suite is
  242 tests, up from 237.
- The `Card` defect predates the `#title` slot. The computed has read
  `slots.actions` since the initial build-out; v1.14.0 only added a second slot
  to an already-broken expression. Its note there — "the header renders whenever
  a `title`, `description`, `#title` or `#actions` is present" — was true only
  of slots present at mount, and is true as written from this release.
- Adjacent, found by the same sweep and deliberately not changed: `DataTable`
  passes `comparators.value` into `useSort()`, unwrapping a computed at setup
  and freezing the per-column `sortFn` map, so a table that swaps its `columns`
  after mount sorts with the old comparators. Same family — a value read once
  where it should be read on demand — but the fix is a change to `useSort`'s
  signature, and that belongs in a release that can look at the composable's API
  rather than in a patch.
- `useAttrs()` is **not** an instance of this, which is most of why the slots
  version survived so long. It looks identical, but Vue backs attrs with a real
  `track`/`trigger` pair that fires on every props update, so the computeds in
  `useRootAttrs` and `usePasswordManagerAttrs` are correctly reactive. Slots are
  the exception, not the rule.

## v1.16.0

The non-colour channel v1.15.0 said would be needed. Additive and non-breaking:
nothing existing changes shape, colour or markup — `Tone` is still five values,
`Category` is still three, and no token moved.

### Added

- **`KindMark` — a kind label whose primary channel is geometry, not colour.**

  v1.15.0 shipped three categorical colours and documented three as a *measured
  ceiling*: inside the one arc of the hue wheel that clears AA-as-text on three
  grounds, holds enough chroma to read as a hue, and stays clear of every
  severity token, three is the largest mutually separable set. That conclusion
  has held up. What it left open was what to do about an axis with more than
  three members, and there was a real one waiting: a consuming app's flow-graph
  diagram with **15 node kinds**, drawn on 12 raw Tailwind ramp hues because
  there was nothing else to draw them with. Several of those hues sat on the
  severity ramp — a node whose *kind* was "data source" rendered in the amber
  the UI uses for "something is wrong". That was reported as a bug and it was
  one.

  It is not fixed by a fourth colour, and the proof is inside this kit's own
  tokens rather than in an argument. Desaturated, `--color-cat-indigo` and
  `--color-cat-magenta` measure **L\* 40.7 and 40.6**. They are the same grey.
  Print the graph in black and white and the entire categorical vocabulary
  collapses to one grey and one dark grey — so any design where colour is the
  distinction has already failed a test nobody was running.

  `KindMark` runs that test on purpose. It splits the distinction across three
  channels of decreasing coarseness and increasing certainty:

  | channel | values | needs | survives greyscale |
  | --- | --- | --- | --- |
  | silhouette | 4 | ≥12px | yes — it is geometry |
  | glyph | the icon registry | ≥12px of glyph, so ≥32px of mark | yes |
  | label | unbounded | reading | yes |

  Colour rides on top of the silhouette — one colour per shape, so it is purely
  redundant. Delete it and nothing is lost. That is the difference between a
  reinforcement channel and a signalling one, and it is the whole design.

  Props: `shape` and `label` required, `icon` and `category` optional, `size` of
  `sm | md | lg`. **`label` cannot be suppressed.** Four silhouettes cannot name
  fifteen kinds and the component is not allowed to imply otherwise; an omitted
  `icon` renders the silhouette alone, which is a real state the legend uses.

- **`KindLegend` — the four-row key, and only ever four rows.**

  A silhouette means "this box is the same sort of thing as that one", which is
  a claim about the set, not about any one mark — so no individual card can
  convey it and it needs a legend. The glyph does not: every mark carries its
  kind's name, so a reader can always just read it. The legend therefore lists
  **families, not kinds**: four rows for fifteen kinds, and still four for
  fifty. A legend that grew with the axis would be the concession that the
  encoding had stopped working.

- **Three icons — `database`, `chat`, `chip`.** Not decoration: the app above
  had 15 kinds on 11 glyphs, so four pairs shared one — `code` for both node
  and schema, `document` for both data source and prompt, `cloud` for both
  provider and AI provider, `link` for both gateway and gateway endpoint. Each
  of those pairs measures **DSSIM 0**, the only score that means "the same
  picture". A design that promotes the glyph to a primary channel has to supply
  enough glyphs for it to be one.

### How the shape channel was measured

Colour has ΔE. A shape channel needs its own measured equivalent or "it is
distinguishable" is just an assertion, so: **DSSIM = (1 − SSIM) × 100**
(structural similarity, Wang et al. 2004), greyscale, computed on real Chromium
rasters of the real marks at real pixel sizes — antialiasing, stroke joins and
all. SSIM's 11×11 Gaussian window is itself a coarse low-pass, which is a fair
model of what "at a glance" means.

The floor is **DSSIM ≥ 30**, and it is calibrated against controls rather than
picked, because a number in a new metric means nothing on its own:

| control | DSSIM | what it establishes |
| --- | --- | --- |
| `circle` ↔ regular octagon | 13.4 | at mark size an octagon *is* a circle |
| `square` ↔ same square, bigger radius | 25.4 | a corner radius is not a shape |
| `eye` ↔ `eye-slash` (this kit's registry) | 26.3 | a pair users demonstrably confuse |
| any glyph ↔ itself | 0 | identity |

Everything at or under ~26 is a pair we can independently confirm is confusable,
so 30 is the first honest floor above them.

One limitation, stated rather than hidden: DSSIM is structural, so it *over*-scores
pairs that differ only by rotation — `chevron-up` ↔ `chevron-down` scores 81.2
though people confuse them constantly. It is therefore a rejection gate, not a
certificate: below the floor is proof of confusability, above it is not proof of
distinctness, and glyph choices still need a human to look at them.

**The four silhouettes** — worst pair `square` ↔ `circle`, **59.0** at 32px with
a 1.5px stroke: better than twice the floor and 4.4× the octagon control. What
was rejected and why:

| rejected | DSSIM | why |
| --- | --- | --- |
| octagon | 13.4 vs `circle` | at mark sizes it is a circle |
| squircle | 25.4 vs `square` | a corner radius is not a shape |
| pentagon | 53.2 vs `hexagon` | clears the floor, but falls with size |
| triangle | 59.0 | separable, and **still unusable** — its largest centred inscribed square is 30% of the mark box, so it cannot hold a glyph. A silhouette that cannot host the second channel is not a member of this set. |

Interior fit is the constraint nobody expects: square 77%, circle 63%, hexagon
54%, diamond 45%, triangle 30%. The diamond is the binding one and it is why the
glyph is drawn at 12 of the mark's 32 units rather than larger.

**Size.** The silhouette is the coarse channel and long outlives the glyph.
Worst cross-shape pair, outline only:

| mark | 40px | 32px | 24px | 16px | 12px | 8px |
| --- | --- | --- | --- | --- | --- | --- |
| DSSIM | 55.2 | 59.0 | 68.4 | 55.5 | 37.8 | 25.2 |

So the family reads down to 12px and is gone by 8px, where it lands exactly on
the squircle control. The glyph needs far more room, which is the point of
having two channels: at low zoom a graph keeps telling you *what sort* of node
each box is long after it has stopped telling you which one.

**Glyph**, for the 15-kind set, at the glyph size each mark size produces —
worst pair *within one family*, which is the binding case since the silhouette
separates the rest:

| size | mark | glyph | worst within-family pair | all 15 glyphs |
| --- | --- | --- | --- | --- |
| `lg` | 40px | 15px | 55.2 | 49.9 |
| `md` | 32px | 12px | 49.6 | 47.9 |
| `sm` | 24px | 9px | 34.8 | 34.8 |

`sm` sits just above the floor; it is documented for dense rows where the label
is carrying the load anyway.

**Stroke weight** is a shape channel's version of "is this token dark enough",
and it binds on contrast rather than on separation — separation barely moves
between 0.75px and 2.5px. Measured on `--color-bg`, taking the darkest pixel the
renderer actually paints:

| stroke | `cat-indigo` | `accent` |
| --- | --- | --- |
| 0.5px | 2.17:1 — **under** WCAG 1.4.11's 3:1 non-text floor | 3.18:1 |
| 0.75px | 3.46:1 | 6.94:1 |
| 1px | 5.58:1 | 15.53:1 |
| ≥1.25px | 5.87:1 — its nominal contrast | 16.55:1 |

A sub-pixel stroke is rendered as partial coverage and composites toward the
background, so it never reaches the colour it was specified in. **1.25px is the
minimum**; the silhouette ships at 1.5px and the glyph at 1.4px, both held
constant in *device* pixels across sizes rather than scaled, because the
constraint is absolute rather than relative.

**Colour, held to v1.15.0's gates.** All four family colours as text:

| family colour | on white | on `bg` | on `surface-2` | on own soft |
| --- | --- | --- | --- | --- |
| `cat-indigo` `#4f46e5` | 6.29:1 | 5.87:1 | 5.67:1 | 5.62:1 |
| `cat-purple` `#581c87` | 10.88:1 | 10.16:1 | 9.81:1 | 10.14:1 |
| `cat-magenta` `#a21caf` | 6.32:1 | 5.91:1 | 5.71:1 | 5.89:1 |
| `accent` `#18181b` | 17.72:1 | 16.55:1 | 15.99:1 | 15.99:1 |

Distance to the severity ramp, OKLab ΔE×100, normal / worst under simulated
protanopia and deuteranopia (Machado-Oliveira-Fernandes 2009, severity 1.0):
indigo↔`success` 31.2 / 27.3, purple↔`success` 27.6 / 19.3, magenta↔`success`
34.1 / 17.9, accent↔`danger` 28.4 / 16.1. Every pair clears ≥15 normal and ≥8
CVD, so no kind mark can be read as a status. The `accent` family is not a
fourth category — it is the *absence* of one, which is how four families fit
inside a three-category vocabulary, and why the two ceilings coincide instead of
fighting.

### Where this stops scaling, stated rather than discovered later

**Four families.** There is no fifth silhouette: the table above is the whole
search, not a sample of it. A fifth family cannot be encoded, only spelled out
in the label.

Inside a family the glyph is the channel, and it is roomier than any real axis:
a greedy max-min sweep of the whole 36-glyph registry at 16px keeps every pair
above 70.0 out to a set of **17 glyphs**, and is still at 59.8 at 20. But that
is not the honest limit either. The honest limit is what a reader has to *learn*
— four silhouettes, taught by `KindLegend` — because the glyph never has to be
learned at all: the kind's name is printed on the mark.

And the number that keeps the design honest rather than flattering it: taking
the complete marks for all 15 kinds in greyscale, the **worst** of the 105 pairs
scores 6.7 (`ai_model` ↔ `mcp_server`) against a median of 82.6. Two kinds in
the same family, differing only by their glyph, genuinely do look alike at a
glance — that is what a family *is*. The mark alone does not separate fifteen
kinds and never claimed to. The label is why it does not have to, and that is
why `label` is required and cannot be turned off.

### Notes

- Not changed, but re-confirmed while measuring: `warning` and `danger` remain
  ΔE 6.7 apart to normal vision and 2.9 under simulated red-green colour
  blindness (v1.15.0's note). Both always carry text, so meaning is never
  colour-alone, and separating them is still a major-release decision.
- The consuming app's adoption is a separate change: `KindMark` replaces a
  15-kind, 12-hue map that this release exists to retire. The comment in that
  map naming the ceiling should be rewritten, not deleted — the ceiling moved
  from three to four, it did not go away.

## v1.15.0

A categorical (non-severity) colour vocabulary, added as a **parallel** set to
`Tone` rather than as more members on it. Additive and non-breaking: no existing
prop, token or rendered output changes, and `Tone` is still exactly five values.

### Added

- **`Category` — a second colour vocabulary, for identity instead of severity.**
  `Tone` is five points on a severity ramp: how bad is this. But a lot of state
  has no severity at all — a feature is on or off, a setting is inherited or
  overridden, a delivery is the first or a duplicate, a record is draft or
  published, a graph node is one kind of thing rather than another. With only a
  severity ramp available, all of those borrowed one: "enabled" rendered as
  `success`, "duplicate" and "overridden" as `info`, "viewing an older version"
  as `warning`. The UI then reports a problem where there is none.

  The deprecated `purple` alias was the same story in miniature — it meant "seen
  this before", was never a severity, and rode `info` only because there was
  nowhere else to put it. There is somewhere now. `variant="purple"` still
  resolves to `info` and still warns; `category="purple"` is what it meant.

  `Category` is deliberately **not** more members on `Tone`. Widening `Tone`
  would break every consumer holding its own exhaustive `Record<Tone, X>` map —
  a semver-major change to ship an additive feature — and it would also be
  wrong: severity is ordered and categories are not. A category means only
  "different from the other one".

- **`category` prop on `Badge` and `StatusBadge`**, a sibling of `variant` and
  mutually exclusive with it. Pass one or the other; passing both warns once in
  development (through `warnOnce`) and renders the category. Use
  `variant="neutral"` for "no category". `resolveCategory()` is exported
  alongside `resolveTone()` and warns once on an unknown value, for the same
  reason `pick()` exists: consuming apps write plain-JS SFCs where the typed
  union is erased, so a typo otherwise indexes the palette to `undefined` and
  renders a badge with no colour classes at all.

  Neither `variant` nor `category` carries a prop default any more. That is
  load-bearing rather than cosmetic: with a default, an unset prop is
  indistinguishable from an explicitly passed one, and the exclusivity check
  cannot be made at all. The `neutral` fallback moved one level down into
  `resolveTone()`, which already applied it — so **rendered output is unchanged**
  for every existing call site.

- **Nine categorical tokens**, in the same base/soft/line shape as the status
  block so the two are interchangeable at the call site:
  `--color-cat-indigo`, `--color-cat-purple` and `--color-cat-magenta`, each
  with `-soft` and `-line`. They are namespaced `cat-` rather than named
  `indigo`/`purple`/`magenta` so they cannot be confused with, or shadow,
  Tailwind's own colour scales in a consuming app.

  **Three is a measured ceiling, not a starting point.** A categorical hue has
  to clear four gates at once: AA as *text* (≥4.5:1) on white, on `--color-bg`
  and on its own `-soft` tint; OKLCH chroma ≥0.10, below which a hue reads as
  gray and stops doing identity work; and OKLab ΔE separation from both the
  other categories and every severity token — ≥15 to normal vision and ≥8 under
  protanopia/deuteranopia (Machado-Oliveira-Fernandes 2009, severity 1.0).

  Sweeping the whole Tailwind ramp against those gates rejects most of the
  wheel, for reasons that are not guessable and are worth recording:

  | rejected | why |
  | --- | --- |
  | red / rose / pink | collapse into `danger` — ΔE 6.8 / 8.5 / 11.4 |
  | orange / amber / yellow | collapse into `warning` — ΔE 9.6 / 8.5 / 9.1 |
  | lime / green / emerald | collapse into `success` — ΔE 10.0 / 8.4 / 6.6 |
  | teal / cyan | not a colour at text weight — dark enough for AA, they measure chroma 0.059 / 0.066, under the 0.10 floor, i.e. they render gray |
  | sky | collapses into `--color-muted` — ΔE 12.5 |

  The teal/cyan result is the same trap as the bright amber that could not reach
  3:1 on white at any lightness (v1.14.0): some hues simply do not exist at the
  weight the contrast rule demands. What survives is a single ~60° blue→magenta
  arc, with room for exactly three mutually separable steps. A fourth drops the
  worst pair to ΔE≈3.0 under simulated red-green colour blindness — that is
  indistinguishable, not "close". **More kinds than three need a channel that is
  not colour: an icon, or the label itself.**

  Measured for the shipped set:

  | token | on white | on `--color-bg` | on own `-soft` |
  | --- | --- | --- | --- |
  | `--color-cat-indigo` `#4f46e5` | 6.29:1 | 5.87:1 | 5.62:1 |
  | `--color-cat-purple` `#581c87` | 10.88:1 | 10.16:1 | 10.14:1 |
  | `--color-cat-magenta` `#a21caf` | 6.32:1 | 5.91:1 | 5.89:1 |

  Separation — indigo↔purple ΔE 17.3 normal / 16.6 CVD; indigo↔magenta 18.2 /
  9.5; purple↔magenta 16.3 / 9.6; nearest severity pair 21.3 / 10.8
  (magenta↔`muted`). `soft` and `line` stay decorative and are never the sole
  carrier of meaning — the badge always carries its text label.

- **Stories** for both components, including a before/after that puts the same
  four non-severity states on the severity ramp and then on the categorical one,
  and a grid of all three categories beside all five tones (the pairing the
  tokens are measured against). The tokens are registered in `tokenCatalog.ts`,
  so Foundations → Colors documents them rather than silently omitting them.

### Notes

- Not changed here, but found while measuring: the existing `warning` and
  `danger` bases are themselves close — ΔE 6.7 to normal vision and 2.9 under
  simulated red-green colour blindness. Both always carry a text label, so
  meaning is never colour-alone, but separating them would change existing
  rendered output and is a decision for a major release.

## v1.14.0

Four additive changes, each one deleting a workaround a consuming app had to
grow because the kit did not offer the seam. Nothing here changes existing
rendered output: every new surface is opt-in and every default is what it was.

### Added

- **`Card` gained a `#title` slot.** It defaults to the `title` prop, so a card
  that passes `title` renders exactly the markup it did before. The title line
  is now a wrapping flex row (`flex flex-wrap items-center gap-x-3 gap-y-1`),
  which is the point: a status badge belongs *beside* the thing it describes.
  Until now the only place to put one was `#actions` — the far side of the
  header, next to the buttons, where a badge reads as a control you can press.
  Eight call sites had independently arrived at that workaround, each with
  slightly different spacing. The header renders whenever a `title`,
  `description`, `#title` or `#actions` is present.

- **`MAX_WIDTHS` is exported from `AuthLayout`** (with the matching
  `AuthLayoutMaxWidth` type), re-exported from the package root. The map and
  the `maxWidth` prop already existed; only the `export` was missing, so an app
  wrapping this layout had to re-declare the same four class strings to type
  its own prop — a private copy that goes stale the first time a step is added
  here. It lives in a plain `<script>` block because `<script setup>` can
  export types but not values.

- **`SidebarItem` forwards fallthrough attributes to the link**
  (`inheritAttrs: false` + `useRootAttrs()`, the same pattern `Link` uses),
  on both the `as`-component and plain `<a>` branches. Previously they landed
  on the wrapping `<li>`, where they are inert: passing `prefetch` for a
  client-side router, or a `data-*`/listener meant for the anchor, produced no
  error and no warning — just a dead attribute in the DOM and a feature that
  silently never engaged. A caller's `class` now merges through `cx()` instead
  of colliding with the component's own classes.

- **Dot-scale status tokens**: `--color-success-dot`, `--color-warning-dot`,
  `--color-danger-dot`, a fourth tier beside `soft` and `line`.

  The existing `--color-success`/`-warning`/`-danger` are tuned for **text**
  (WCAG 1.4.3, ≥4.5:1; they land near 7:1). At 8px there is no text — a status
  dot is a non-text graphical object, so the governing rule is **WCAG 1.4.11
  Non-text Contrast at ≥3:1, not 4.5:1**. Held to the text threshold, an 8px
  dot has to be dark enough that it stops carrying its hue: success reads as
  near-black, warning as dark brown, danger as wine. Colour is the entire
  signal a dot has, and it was being spent on contrast nobody reads. This is
  why consumers had started escaping to raw `text-red-600` for small
  indicators.

  These are **decorative-only and deliberately lighter than the text ramp — not
  a contrast bug, do not darken them.** Each clears 3:1 on white, on
  `--color-bg` and on its own `-soft` tint. They are never the sole carrier of
  meaning (a dot always accompanies a label), and they are not for text, icons
  read as text, or borders — use the base and `line` tokens there. Documented
  as their own group in *Foundations/Colors*, rendered at 8px as well as at
  swatch size, because a 40px swatch flatters a colour picked for 8px.

  `StatusBadge`'s own dot is **unchanged** — switching it would restyle every
  existing badge, which is a visual change and not this release's business.

## v1.13.0

### Added

- **A `map` icon** (Heroicons 24 outline, a folded three-panel map), bringing
  the registry to 29 names.

  The gap it fills: nothing in the set stood for *a diagram of a whole
  structure*. `chart` is bars — quantities, not topology — and the nearest
  alternatives (`document`, `code`, `link`) each name a piece rather than the
  picture. A consumer opening an overview of how its parts connect had no
  honest glyph to hang it on, and a bar chart on a button that opens a node
  graph misdescribes what is behind it.

  Purely additive: no existing name changes, and `IconName` widens by one.

## v1.12.0

### Added

- **`DescriptionList` gained a `layout` prop** (`gutter` | `rows`, default
  `gutter`). `gutter` is the shape it has always had: the label sits in a fixed
  `w-36` column so every value starts on the same x, which is what a
  sidebar-width list wants. That gutter is also a wrap machine — any label
  longer than 9rem ("Workspace-wide rate limit multiplier") breaks over two or
  three lines beside a value of "4", which is how a full-width card of short
  numbers ends up ragged. `rows` gives the label as much width as it needs
  (`whitespace-nowrap`, so it never wraps), pushes the value to the far edge,
  and rules a line under each pair: one entry per line, however long the label
  runs.

  The prop is on the **list**, not the item — a list whose rows disagree about
  where the value sits is not a list. `DescriptionItem` picks the shape up
  through provide/inject, and an item rendered outside a list falls back to
  `gutter`.

  **Consumers need no change.** The prop defaults to today's behaviour, and a
  list that passes nothing renders exactly the markup it did before.

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
