<script setup lang="ts">
// A single tab pill in a tab bar. The active tab is filled and carries
// aria-current; the rest are quiet until hovered. Renders a plain <a> by
// default so it works for full-page navigation with no framework dependency;
// pass `as` (e.g. Inertia's `Link`) for SPA navigation instead.
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{ href: string; active?: boolean; as?: string | object }>(),
    { active: false, as: 'a' },
);

const attrs = useAttrs();

const classes = computed(() =>
    twMerge(
        'inline-flex items-center justify-center min-h-11 whitespace-nowrap rounded-pill px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        props.active ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
        attrs.class as string,
    ),
);

const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
</script>

<template>
  <component
    :is="as"
    :href="href"
    :aria-current="active ? 'page' : undefined"
    :class="classes"
    v-bind="rootAttrs"
  >
    <slot />
  </component>
</template>
