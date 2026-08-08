<script setup lang="ts">
import { computed } from 'vue';
import { resolveCategory, resolveTone } from '../../helpers/tone';
import type { Category, LegacyTone, Tone } from '../../helpers/tone';
import { pick } from '../../helpers/pick';
import { warnOnce } from '../../helpers/dev';

/* eslint-disable vue/require-default-prop --
   `variant` and `category` intentionally have no prop default. A default makes
   an unset prop indistinguishable from an explicitly passed one, and the
   mutual-exclusivity check below has to tell those apart. The `neutral`
   fallback is applied one level down by `resolveTone()`, so the rendered
   result is unchanged. */
export interface BadgeProps {
    /**
     * SEVERITY tone — how bad is this. The color names
     * (gray/blue/green/amber/red) are deprecated aliases and will be
     * removed in the next major release.
     *
     * Mutually exclusive with `category`. Defaults to `neutral` when
     * neither is given.
     */
    variant?: Tone | LegacyTone;
    /**
     * CATEGORICAL identity — which kind is this, with no severity implied.
     * For state that is not a status: on/off, inherited/overridden,
     * first/duplicate, draft/published, or a kind-of-thing label.
     *
     * Mutually exclusive with `variant`; takes precedence if both are
     * passed. Use `variant="neutral"` for "no category".
     */
    category?: Category;
    size?: 'sm' | 'md';
}

const props = withDefaults(
    defineProps<BadgeProps>(),
    { size: 'md' },
);
/* eslint-enable vue/require-default-prop */

// Two parallel maps rather than one widened one. Merging them would make the
// type `Record<Tone | Category, string>`, and every consuming app holding its
// own exhaustive `Record<Tone, X>` status map would stop compiling — a
// semver-major break to ship what is an additive feature.
const palette: Record<Tone, string> = {
    neutral: 'bg-surface-2 text-muted border-line',
    info: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success-soft text-success border-success-line',
    warning: 'bg-warning-soft text-warning border-warning-line',
    danger: 'bg-danger-soft text-danger border-danger-line',
};

const categoryPalette: Record<Category, string> = {
    indigo: 'bg-cat-indigo-soft text-cat-indigo border-cat-indigo-line',
    purple: 'bg-cat-purple-soft text-cat-purple border-cat-purple-line',
    magenta: 'bg-cat-magenta-soft text-cat-magenta border-cat-magenta-line',
};

const sizes: Record<string, string> = {
    sm: 'text-2xs px-1.5 py-0.5',
    md: 'text-2xs px-2 py-0.5',
};

// `variant` deliberately has no prop default: with one, an unset `variant`
// and an explicit `variant="neutral"` are indistinguishable here, so passing
// both props could not be detected. `resolveTone(undefined, 'neutral')`
// applies the same default one level down, so behaviour is unchanged.
const classes = computed(() => {
    const base = 'inline-flex items-center gap-1 font-medium rounded-control border ';
    const size = pick(sizes, props.size, 'md', 'Badge.size');

    if (props.category !== undefined) {
        if (props.variant !== undefined) {
            warnOnce(
                'Badge:variant+category',
                '[flows] Badge received both `variant` and `category`. They are parallel, '
                    + 'mutually exclusive vocabularies — `variant` reports SEVERITY '
                    + '(neutral | info | success | warning | danger), `category` labels a '
                    + 'non-severity IDENTITY. Rendering `category` and ignoring `variant`.',
            );
        }

        return `${base}${categoryPalette[resolveCategory(props.category, 'indigo')]} ${size}`;
    }

    return `${base}${palette[resolveTone(props.variant, 'neutral')]} ${size}`;
});
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
