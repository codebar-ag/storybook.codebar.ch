<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        href?: string;
        tone?: 'default' | 'muted' | 'accent';
    }>(),
    { href: '#', tone: 'default' },
);

const attrs = useAttrs();

const tones: Record<string, string> = {
    default: 'text-ink decoration-dim hover:decoration-ink',
    muted: 'text-muted hover:text-ink',
    accent: 'text-sm text-accent hover:underline',
};

const classes = computed(() => {
    const base = 'transition rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';
    const underline = props.tone === 'accent' ? '' : 'underline underline-offset-2';

    return twMerge(base, underline, tones[props.tone] ?? tones.default, attrs.class as string);
});

// Forward every attribute except `class` (already merged above).
const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
</script>

<template>
  <a
    :href="href"
    :class="classes"
    v-bind="rootAttrs"
  ><slot /></a>
</template>
