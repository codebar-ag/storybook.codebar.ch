<script setup lang="ts">
import { computed, useSlots } from 'vue';

// Form-footer action row. `between` puts the secondary action (Cancel) on the
// left and the primary on the right; `end` right-aligns everything. The
// `secondary` slot renders before the primary default slot. Pair with Button.
const props = withDefaults(
    defineProps<{ align?: 'between' | 'end' | 'start' }>(),
    { align: 'between' },
);

const slots = useSlots();

const alignment = computed(
    () =>
        ({ between: 'justify-between', end: 'justify-end', start: 'justify-start' })[
            props.align
        ] ?? 'justify-between',
);
</script>

<template>
  <div :class="['flex items-center gap-2 pt-2', alignment]">
    <slot
      v-if="slots.secondary"
      name="secondary"
    />
    <slot />
  </div>
</template>
