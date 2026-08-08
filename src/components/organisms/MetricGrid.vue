<script setup lang="ts">
import { Comment, computed, Fragment, Text, useSlots, type VNode } from 'vue';

export interface MetricGridProps {
    columns?: 1 | 2 | 3 | 4;
}

const props = withDefaults(defineProps<MetricGridProps>(), {
    columns: 4,
});

const slots = useSlots();

// A slot's vnode list is not a tile list. `v-for` collapses its whole run into
// a single Fragment, `v-if` leaves a Comment placeholder behind when it is
// false, and whitespace between children arrives as empty Text — so counting
// the array counts the caller's *syntax* rather than the caller's tiles. Both
// of the shapes a real caller writes were miscounted: three tiles from a
// `v-for` read as one, and three tiles with a fourth behind `v-if` read as
// four. Flatten fragments, drop the placeholders, and count what renders.
function countTiles(nodes: VNode[]): number {
    return nodes.reduce((total, node) => {
        if (node.type === Fragment) {
            return total + countTiles((node.children ?? []) as VNode[]);
        }

        if (node.type === Comment || (node.type === Text && String(node.children).trim() === '')) {
            return total;
        }

        return total + 1;
    }, 0);
}

// A gapped grid of Metric tiles. The hairline gap (gap-px on bg-line) gives the
// tiles their dividers. When the tile count doesn't divide evenly into
// `columns`, the trailing grid cells have no Metric to fill them, so the
// container's gap background (bg-line) shows through as a stray solid block.
// Pad the row out with blank, same-background filler tiles instead. Counted
// against `columns` (not the responsive `sm:` breakpoint's smaller count) so
// the total is a multiple of both — e.g. a 4-column total is always also a
// clean multiple of the 2-column mobile layout.
//
// A function called from the template, deliberately NOT a `computed`: the
// object `useSlots()` returns is built once and mutated in place, so it is not
// a reactive dependency and a computed over it caches the tile count from
// mount. Reading it in the render re-counts whenever the caller re-renders,
// which is the only moment the tiles can have changed.
function fillerCount(): number {
    const tileCount = countTiles(slots.default?.() ?? []);

    if (tileCount === 0 || props.columns === 1) {
        return 0;
    }

    return (props.columns - (tileCount % props.columns)) % props.columns;
}

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
      v-for="n in fillerCount()"
      :key="`filler-${n}`"
      class="bg-surface"
      aria-hidden="true"
    />
  </div>
</template>
