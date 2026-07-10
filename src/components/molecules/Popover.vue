<script setup lang="ts">
// Click-triggered floating panel for arbitrary content (filters, hints,
// small forms). Closes on outside click and Escape (focus returns to the
// trigger). For a full-blown modal flow use Modal/Drawer instead.
import { computed, ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';
import { useControllable } from '../../composables/useControllable';
import { useEscapeKey } from '../../composables/useEscapeKey';

const props = withDefaults(
    defineProps<{
        align?: 'left' | 'right';
        // Width utility class for the panel.
        width?: string;
        // Optional v-model:open; leave unbound for internal state.
        open?: boolean;
    }>(),
    { align: 'left', width: 'w-72', open: undefined },
);

const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const isOpen = useControllable(
    () => props.open,
    (value) => emit('update:open', value),
    false,
);

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);

const panelAlign = computed(() => (props.align === 'left' ? 'left-0' : 'right-0'));

function close(returnFocus = true): void {
    if (!isOpen.value) {
        return;
    }
    isOpen.value = false;
    if (returnFocus) {
        trigger.value?.focus();
    }
}

useClickOutside(root, () => close(false), isOpen);
useEscapeKey(() => close(), isOpen);
</script>

<template>
  <div
    ref="root"
    class="relative inline-block"
  >
    <button
      ref="trigger"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="isOpen ? 'true' : 'false'"
      class="inline-flex items-center gap-1.5 rounded-control transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/50"
      @click="isOpen ? close() : (isOpen = true)"
    >
      <slot name="trigger" />
    </button>

    <div
      v-if="isOpen"
      role="dialog"
      :class="[
        'absolute mt-2 max-w-[calc(100vw-1rem)] origin-top rounded-surface border border-line bg-surface p-4 shadow-lg shadow-ink/5 z-30',
        width,
        panelAlign,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
