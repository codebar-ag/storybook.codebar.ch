<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        href?: string;
        tone?: 'default' | 'muted' | 'accent';
        // Link component (e.g. Inertia's Link) used instead of <a>.
        as?: Component | null;
    }>(),
    { href: '#', tone: 'default', as: null },
);

const { rootAttrs, classAttr } = useRootAttrs();

const tones: Record<string, string> = {
    default: 'text-ink decoration-dim hover:decoration-ink',
    muted: 'text-muted hover:text-ink',
    accent: 'text-sm text-accent hover:underline',
};

const classes = computed(() => {
    const base = 'transition rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';
    const underline = props.tone === 'accent' ? '' : 'underline underline-offset-2';

    return cx(base, underline, tones[props.tone] ?? tones.default, classAttr.value);
});
</script>

<template>
  <component
    :is="as"
    v-if="as"
    :href="href"
    :class="classes"
    v-bind="rootAttrs"
  >
    <slot />
  </component>
  <a
    v-else
    :href="href"
    :class="classes"
    v-bind="rootAttrs"
  ><slot /></a>
</template>
