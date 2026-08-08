<script setup lang="ts">
import { computed, provide } from 'vue';
import { descriptionListKey } from './descriptionListContext';

export interface DescriptionListProps {
    layout?: 'gutter' | 'rows';
}

// Read-only metadata list: a stack of label → value rows. Pair with DescriptionItem.
//
// `layout` picks the row shape, and every item in the list follows it — the
// list owns it rather than each item, because a list whose rows disagree about
// where the value sits is not a list.
//
// `gutter` puts the label in a fixed 9rem column: right for a sidebar-width
// list, where a short label and its value read as one line. That gutter is
// also a wrap machine — a label longer than 9rem breaks over two or three
// lines beside a value of "4", which is how a wide card full of short numbers
// ends up ragged. `rows` gives the label as much width as it needs, pushes the
// value to the far edge and rules a line under each pair, so one limit is one
// line however long its label runs.
const props = withDefaults(
    defineProps<DescriptionListProps>(),
    { layout: 'gutter' },
);

provide(
    descriptionListKey,
    computed(() => props.layout),
);

const layoutClass = computed(
    () =>
        ({
            gutter: 'space-y-3',
            rows: 'divide-y divide-line',
        })[props.layout],
);
</script>

<template>
  <dl :class="layoutClass">
    <slot />
  </dl>
</template>
