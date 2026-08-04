<script setup lang="ts">
import { computed } from 'vue';
import { pick } from '../../helpers/pick';

// Responsive form/field grid: single column on mobile, splitting at `sm`. Replaces
// the ad-hoc `grid gap-4 sm:grid-cols-2` blocks repeated across forms. Class strings
// are full literals (not interpolated) so Tailwind never purges them.
const props = withDefaults(
    defineProps<{
        cols?: 1 | 2 | 3;
    }>(),
    { cols: 2 },
);

const colClasses: Record<number, string> = {
    1: 'grid gap-4',
    2: 'grid gap-4 sm:grid-cols-2',
    3: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
};

const classes = computed(() => pick(colClasses, props.cols, 2, 'FormGrid.cols'));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
