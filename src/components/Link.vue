<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        href?: string;
        tone?: 'default' | 'muted';
    }>(),
    { href: '#', tone: 'default' },
);

const tones: Record<string, string> = {
    default: 'text-ink decoration-dim hover:decoration-ink',
    muted: 'text-muted hover:text-ink',
};

const classes = computed(
    () =>
        'underline underline-offset-2 transition rounded-xs ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ' +
        (tones[props.tone] ?? tones.default),
);
</script>

<template>
  <a
    :href="href"
    :class="classes"
  ><slot /></a>
</template>
