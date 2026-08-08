<script setup lang="ts">
import { computed } from 'vue';
import { icons } from '../../icons';
import type { IconName } from '../../icons';
import { kindShapes } from '../../kindShapes';
import type { KindShape } from '../../kindShapes';
import { resolveCategory } from '../../helpers/tone';
import type { Category } from '../../helpers/tone';
import { pick } from '../../helpers/pick';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

/**
 * A **kind** label: a silhouette, a glyph inside it, and the name — in that
 * order of coarseness, all three saying the same thing.
 *
 * ## What this is for, and why it is not a fourth colour
 *
 * `Tone` reports severity and `Category` labels identity, both in colour, and
 * `Category` is three because three is what survived measurement. An axis with
 * more members than that — a flow graph with 15 node kinds is the case this was
 * built for — cannot be separated by colour at all. The proof is in this kit's
 * own tokens: `--color-cat-indigo` and `--color-cat-magenta` measure L\* 40.7
 * and 40.6. Printed in black and white they are the same grey.
 *
 * So this component makes colour the *last* channel rather than the only one:
 *
 *   1. **Silhouette** — 4 values, pre-attentive, readable down to 12px, and
 *      completely unaffected by desaturation. This is the primary channel.
 *   2. **Glyph** — many values, needs about 12px of glyph to read, so about
 *      32px of mark. This is what separates two kinds inside one family.
 *   3. **Label** — always rendered, never optional, exact.
 *
 * Colour rides along on top of (1): one colour per silhouette, drawn from the
 * categorical tier plus neutral, never from `warning`/`success`/`danger`.
 * Remove the colour entirely and the component still works. That is the test.
 *
 * ## Measured
 *
 * Silhouette separation, DSSIM = (1 − SSIM) × 100 on Chromium rasters,
 * greyscale, against a floor of 30 calibrated on known-confusable controls
 * (see `src/kindShapes.ts`): worst pair **59.0** at 32px.
 *
 * Glyph separation for the 15-kind set this was built against, at the glyph
 * size each mark size produces:
 *
 *   | size | mark | glyph | worst glyph pair within one family |
 *   | ---- | ---- | ----- | ---------------------------------- |
 *   | `lg` | 40px | 15px  | 55.2 |
 *   | `md` | 32px | 12px  | 49.6 |
 *   | `sm` | 24px | 9px   | 34.8 — above the floor, but only just |
 *
 * `sm` is for dense rows where the label is doing most of the work anyway; at
 * `sm` treat the glyph as reinforcement and the silhouette as the signal.
 *
 * Stroke weight is held constant in **device** pixels across sizes rather than
 * scaled, because the constraint is absolute: measured on `--color-bg`, a
 * 0.5px stroke is antialiased down to 2.17:1 — under WCAG 1.4.11's 3:1 floor
 * for a non-text graphic — and a stroke only reaches its nominal colour, and so
 * its nominal contrast, at **1.25px** and above. The silhouette ships at 1.5px
 * and the glyph at 1.4px, both with margin. Overriding the rendered size with a
 * `class` scales the geometry but not the stroke floor: sizing *up* is safe,
 * sizing below `sm` is not.
 *
 * ## Where this stops scaling
 *
 * At **four families**. There is no fifth silhouette — see `src/kindShapes.ts`
 * for the four that were rejected and the numbers that rejected them. Inside a
 * family the glyph registry is good for far more kinds than any real axis has,
 * but that is not the binding limit either: what a reader has to *learn* is the
 * four silhouettes, and `KindLegend` is the four-row legend that teaches them.
 * A fifth family cannot be added, only expressed in the label — which is why
 * `label` is a required prop with no way to suppress it.
 */

/* eslint-disable vue/require-default-prop --
   `icon` and `category` deliberately have no default, and both are
   load-bearing. An absent `icon` renders the silhouette alone, which is a real
   state (the legend uses it, and so does any mark too small to hold a glyph) —
   a default glyph would make it unreachable. An absent `category` means "no
   category", which renders neutral; defaulting it would silently assign every
   unlabelled mark to a category it does not belong to. */
export interface KindMarkProps {
    /** Which family this kind belongs to. The primary, greyscale-safe channel. */
    shape: KindShape;
    /**
     * The kind's name, always rendered. This is not an `aria-label` —
     * it is visible text, and it is required because the mark alone does
     * not separate an arbitrary number of kinds and should not pretend to.
     * Override the rendering (not the presence) through the default slot.
     */
    label: string;
    /** Separates kinds *within* a family. Omit for a silhouette-only mark. */
    icon?: IconName;
    /**
     * Reinforcement only, one per family. Omit for the neutral family.
     * Deliberately drawn from `Category` and `accent`, never from the
     * severity ramp — a kind is not a status.
     */
    category?: Category;
    size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(
    defineProps<KindMarkProps>(),
    { size: 'md' },
);
/* eslint-enable vue/require-default-prop */

defineOptions({ inheritAttrs: false });

const { rootAttrs, classAttr } = useRootAttrs();

/**
 * Per size: the rendered box, and the stroke widths in *user* units that make
 * the device stroke come out at 1.5px (silhouette) and 1.4px (glyph).
 *
 * The arithmetic, so the next person can re-derive it rather than trust it:
 * the viewBox is 32 units wide, so one user unit is `markPx / 32` device px;
 * the glyph is drawn at `scale(0.5)`, so its local units are half again.
 *   silhouette = 1.5 × 32 / markPx
 *   glyph      = 1.4 × 32 / markPx / 0.5
 */
const SIZES = {
    sm: { box: 'size-6', silhouette: 2, glyph: 3.73, text: 'text-2xs' },
    md: { box: 'size-8', silhouette: 1.5, glyph: 2.8, text: 'text-2xs' },
    lg: { box: 'size-10', silhouette: 1.2, glyph: 2.24, text: 'text-xs' },
} as const;

type SizeKey = keyof typeof SIZES;

// `pick` is what warns on an unknown value (consuming apps write plain-JS SFCs
// where the typed union is erased), so the class goes through it; the geometry
// resolves against the same map with the same fallback.
const BOXES: Record<string, string> = Object.fromEntries(
    Object.entries(SIZES).map(([key, value]) => [key, value.box]),
);

const boxClass = computed(() => pick(BOXES, props.size, 'md', 'KindMark.size'));
const geometry = computed(() => SIZES[props.size in SIZES ? (props.size as SizeKey) : 'md']);

/**
 * One colour per family: the three categorical hues plus `accent` for the
 * family that has no category.
 *
 * Every one of the four clears WCAG AA **as text** (≥4.5:1) on white, on
 * `--color-bg` and on `--color-surface-2`, and every one sits ≥15 OKLab ΔE
 * from `success`/`warning`/`danger` to normal vision and ≥8 under simulated
 * protanopia and deuteranopia — the same gates v1.15.0 set. The closest
 * approach to any severity token is `accent` ↔ `danger` at 28.4 / 16.1.
 *
 * The soft fill is decorative and is never a lone carrier of meaning; in
 * greyscale it is a ~2% tint, which is exactly as much as it is allowed to
 * matter.
 */
const NEUTRAL = { ink: 'text-accent', fill: 'fill-surface-2' };

const CATEGORY_COLOURS: Record<Category, { ink: string; fill: string }> = {
    indigo: { ink: 'text-cat-indigo', fill: 'fill-cat-indigo-soft' },
    purple: { ink: 'text-cat-purple', fill: 'fill-cat-purple-soft' },
    magenta: { ink: 'text-cat-magenta', fill: 'fill-cat-magenta-soft' },
};

const colours = computed(() =>
    props.category === undefined ? NEUTRAL : CATEGORY_COLOURS[resolveCategory(props.category, 'indigo')],
);

const silhouette = computed(() => pick(kindShapes, props.shape, 'square', 'KindMark.shape'));

// An unknown icon name already warns through `pick` inside `Icon`; this mark
// draws the paths itself (one <svg> for both channels is what lets the stroke
// weights be set independently and measured), so it repeats the guard.
const glyph = computed(() =>
    props.icon === undefined ? null : pick(icons, props.icon, 'code', 'KindMark.icon'),
);

const rootClass = computed(() =>
    cx('inline-flex min-w-0 items-center gap-2', colours.value.ink, classAttr.value),
);
</script>

<template>
  <span
    :class="rootClass"
    v-bind="rootAttrs"
  >
    <!-- Decorative: everything it encodes is in the label beside it, so
         announcing it again would only make the mark read twice. -->
    <svg
      :class="[boxClass, 'shrink-0']"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <g
        :class="colours.fill"
        :stroke-width="geometry.silhouette"
        v-html="silhouette"
      />
      <g
        v-if="glyph"
        transform="translate(10 10) scale(0.5)"
        :stroke-width="geometry.glyph"
        v-html="glyph"
      />
    </svg>

    <span :class="['truncate font-medium uppercase tracking-wide', geometry.text]">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
