<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from '../../icons';

// Icon inside a tinted, bordered badge. size: sm = 40px tile, md = 48px disc.
const props = withDefaults(
    defineProps<{
        icon?: IconName;
        variant?: 'accent' | 'danger' | 'success' | 'warning' | 'neutral';
        size?: 'sm' | 'md';
        shape?: 'circle' | 'surface';
    }>(),
    { icon: 'check', variant: 'accent', size: 'md', shape: 'circle' },
);

const variants: Record<string, string> = {
    accent: 'bg-accent/10 border-accent/25 text-accent',
    danger: 'bg-danger-soft border-danger-line text-danger',
    success: 'bg-success-soft border-success-line text-success',
    warning: 'bg-warning-soft border-warning-line text-warning',
    neutral: 'bg-surface-2 border-line text-dim',
};
const sizes: Record<string, string> = { sm: 'size-10', md: 'size-12' };
const shapes: Record<string, string> = { circle: 'rounded-full', surface: 'rounded-surface' };

const classes = computed(
    () =>
        'inline-grid place-items-center shrink-0 border ' +
        `${sizes[props.size] ?? sizes.md} ${shapes[props.shape] ?? shapes.circle} ${
            variants[props.variant] ?? variants.accent
        }`,
);
</script>

<template>
  <span :class="classes"><Icon
    :name="icon"
    size="md"
  /></span>
</template>
