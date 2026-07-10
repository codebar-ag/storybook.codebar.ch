<script setup lang="ts">
// Text tooltip on hover/focus. The tooltip stays in the DOM (visually hidden)
// so `aria-describedby` always resolves; the wrapper wires the description to
// the slotted trigger via the scoped `describedBy` id or, for plain content,
// by exposing hover/focus handlers on the wrapper itself.
//
//     <Tooltip text="Copy to clipboard">
//         <template #default="{ describedBy }">
//             <Button :aria-describedby="describedBy">Copy</Button>
//         </template>
//     </Tooltip>
import { computed, ref, useId } from 'vue';

const props = withDefaults(
    defineProps<{
        text: string;
        placement?: 'top' | 'bottom' | 'left' | 'right';
    }>(),
    { placement: 'top' },
);

const id = useId();
const visible = ref(false);

const placements: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
};

const bubbleClasses = computed(() => [
    'pointer-events-none absolute z-40 whitespace-nowrap rounded-control bg-ink px-2 py-1 text-2xs text-white shadow-card transition-opacity',
    placements[props.placement] ?? placements.top,
    visible.value ? 'opacity-100' : 'opacity-0',
]);

function show(): void {
    visible.value = true;
}

function hide(): void {
    visible.value = false;
}
</script>

<template>
  <span
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot :described-by="id" />
    <span
      :id="id"
      role="tooltip"
      :class="bubbleClasses"
    >{{ text }}</span>
  </span>
</template>
