<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = withDefaults(defineProps<{
    columns?: 1 | 2 | 3 | 4;
}>(), {
    columns: 4,
});

const slots = useSlots();

// A gapped grid of Metric tiles. The hairline gap (gap-px on bg-line) gives the
// tiles their dividers. When the tile count doesn't divide evenly into
// `columns`, the trailing grid cells have no Metric to fill them, so the
// container's gap background (bg-line) shows through as a stray solid block.
// Pad the row out with blank, same-background filler tiles instead. Computed
// against `columns` (not the responsive `sm:` breakpoint's smaller count) so
// the total is a multiple of both — e.g. a 4-column total is always also a
// clean multiple of the 2-column mobile layout.
const fillerCount = computed(() => {
    const tileCount = (slots.default?.() ?? []).length;

    if (tileCount === 0 || props.columns === 1) {
        return 0;
    }

    return (props.columns - (tileCount % props.columns)) % props.columns;
});

const gridClass = computed(() => {
    if (props.columns === 1) {
        return 'grid-cols-1';
    }

    if (props.columns === 2) {
        return 'grid-cols-2';
    }

    if (props.columns === 3) {
        return 'grid-cols-3';
    }

    return 'grid-cols-2 sm:grid-cols-4';
});
</script>

<template>
  <div
    class="grid gap-px bg-line border border-line rounded-control overflow-hidden"
    :class="gridClass"
  >
    <slot />
    <div
      v-for="n in fillerCount"
      :key="`filler-${n}`"
      class="bg-surface"
      aria-hidden="true"
    />
  </div>
</template>
