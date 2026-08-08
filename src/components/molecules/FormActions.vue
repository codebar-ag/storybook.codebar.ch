<script setup lang="ts">
import { computed } from 'vue';
import { pick } from '../../helpers/pick';

export interface FormActionsProps { align?: 'between' | 'end' | 'start' }

// Form-footer action row. `between` puts the secondary action (Cancel) on the
// left and the primary on the right; `end` right-aligns everything. The
// `secondary` slot renders before the primary default slot. Pair with Button.
const props = withDefaults(
    defineProps<FormActionsProps>(),
    { align: 'between' },
);

const alignments: Record<string, string> = {
    between: 'justify-between',
    end: 'justify-end',
    start: 'justify-start',
};

const alignment = computed(() => pick(alignments, props.align, 'between', 'FormActions.align'));
</script>

<template>
  <div :class="['flex items-center gap-2 pt-2', alignment]">
    <slot
      v-if="$slots.secondary"
      name="secondary"
    />
    <slot />
  </div>
</template>
