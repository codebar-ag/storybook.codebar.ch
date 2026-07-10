<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        variant?: 'gray' | 'blue' | 'green' | 'amber' | 'red';
        size?: 'sm' | 'md';
    }>(),
    { variant: 'gray', size: 'md' },
);

const palette: Record<string, string> = {
    gray: 'bg-surface-2 text-muted border-line',
    blue: 'bg-accent/10 text-accent border-accent/20',
    green: 'bg-success-soft text-success border-success-line',
    amber: 'bg-warning-soft text-warning border-warning-line',
    red: 'bg-danger-soft text-danger border-danger-line',
};

const sizes: Record<string, string> = {
    sm: 'text-2xs px-1.5 py-0.5',
    md: 'text-2xs px-2 py-0.5',
};

const classes = computed(
    () =>
        'inline-flex items-center gap-1 font-medium rounded-control border ' +
        `${palette[props.variant] ?? palette.gray} ${sizes[props.size] ?? sizes.md}`,
);
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
