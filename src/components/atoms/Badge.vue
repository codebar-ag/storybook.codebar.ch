<script setup lang="ts">
import { computed } from 'vue';
import { resolveTone } from '../../helpers/tone';
import type { LegacyTone, Tone } from '../../helpers/tone';

const props = withDefaults(
    defineProps<{
        /**
         * Semantic tone. The color names (gray/blue/green/amber/red) are
         * deprecated aliases and will be removed in the next major release.
         */
        variant?: Tone | LegacyTone;
        size?: 'sm' | 'md';
    }>(),
    { variant: 'neutral', size: 'md' },
);

const palette: Record<Tone, string> = {
    neutral: 'bg-surface-2 text-muted border-line',
    info: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success-soft text-success border-success-line',
    warning: 'bg-warning-soft text-warning border-warning-line',
    danger: 'bg-danger-soft text-danger border-danger-line',
};

const sizes: Record<string, string> = {
    sm: 'text-2xs px-1.5 py-0.5',
    md: 'text-2xs px-2 py-0.5',
};

const classes = computed(
    () =>
        'inline-flex items-center gap-1 font-medium rounded-control border ' +
        `${palette[resolveTone(props.variant, 'neutral')]} ${sizes[props.size] ?? sizes.md}`,
);
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
