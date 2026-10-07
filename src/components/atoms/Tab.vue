<script setup lang="ts">
// A single tab pill in a tab bar (group them in `TabGroup`). The active tab is filled and carries
// aria-current; the rest are quiet until hovered. Renders a plain <a> by
// default so it works for full-page navigation with no framework dependency;
// pass `as` (e.g. Inertia's `Link`) for SPA navigation instead.
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';
import { tabCountClasses } from '../../helpers/segmented';

defineOptions({ inheritAttrs: false });

export interface TabProps {
    href: string;
    active?: boolean;
    as?: string | object;
    /** A number after the label, e.g. the results behind a filter. */
    count?: number | null;
}

const props = withDefaults(
    defineProps<TabProps>(),
    { active: false, as: 'a', count: null },
);

const { rootAttrs, classAttr } = useRootAttrs();

const classes = computed(() =>
    cx(
        'relative inline-flex items-center justify-center min-h-11 whitespace-nowrap rounded-pill px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50',
        // The active underline (`::after`) is transparent unless an app sets
        // `--color-tab-active-marker`.
        props.active ? 'bg-surface text-tab-active-fg shadow-card after:pointer-events-none after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:bg-tab-active-marker' : 'text-muted hover:text-ink',
        classAttr.value,
    ),
);
</script>

<template>
  <component
    :is="as"
    :href="href"
    :aria-current="active ? 'page' : undefined"
    data-slot="tab"
    :data-state="active ? 'active' : undefined"
    :class="classes"
    v-bind="rootAttrs"
  >
    <slot />
    <span
      v-if="count !== null"
      :class="tabCountClasses"
    >{{ count }}</span>
  </component>
</template>
