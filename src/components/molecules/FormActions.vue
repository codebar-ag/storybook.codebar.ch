<script setup lang="ts">
import { computed } from 'vue';
import { pick } from '../../helpers/pick';

export interface FormActionsProps {
    align?: 'between' | 'end' | 'start';
    /** A rule above the row, closing a long form (settings pages). */
    divided?: boolean;
}

// Form-footer action row. `between` puts the secondary action (Cancel) on the
// left and the primary on the right; `end` right-aligns everything. The
// `secondary` slot renders before the primary default slot. Pair with Button.
// `#hint` puts a short muted note ahead of the buttons ("Saving checks the
// connection first"); the row wraps so a long hint never squeezes them.
const props = withDefaults(
    defineProps<FormActionsProps>(),
    { align: 'between', divided: false },
);

const alignments: Record<string, string> = {
    between: 'justify-between',
    end: 'justify-end',
    start: 'justify-start',
};

const alignment = computed(() => pick(alignments, props.align, 'between', 'FormActions.align'));
</script>

<template>
  <div :class="['flex flex-wrap items-center gap-2', divided ? 'mt-2 border-t border-line pt-6' : 'pt-2', alignment]">
    <span
      v-if="$slots.hint"
      class="mr-2 text-xs text-muted"
    ><slot name="hint" /></span>
    <slot
      v-if="$slots.secondary"
      name="secondary"
    />
    <slot />
  </div>
</template>
