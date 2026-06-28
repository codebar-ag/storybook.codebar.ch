<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        align?: 'left' | 'right';
    }>(),
    { align: 'right' },
);

const menuAlign = computed(() => (props.align === 'left' ? 'left-0' : 'right-0'));

// Native <details>/<summary> disclosure — no JS. The summary is keyboard
// focusable and toggles on Enter/Space; the open state lives on <details>.
const triggerBase =
    'inline-flex items-center gap-1.5 rounded-control transition cursor-pointer list-none ' +
    '[&::-webkit-details-marker]:hidden ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/50';
</script>

<template>
  <details class="relative inline-block">
    <summary
      aria-haspopup="menu"
      :class="triggerBase"
    >
      <slot name="trigger" />
    </summary>

    <div
      role="menu"
      :class="[
        'absolute mt-2 w-56 max-w-[calc(100vw-1rem)] origin-top rounded-surface bg-surface border border-line shadow-lg shadow-ink/5 focus:outline-none z-30',
        menuAlign,
      ]"
    >
      <div class="py-1">
        <slot />
      </div>
    </div>
  </details>
</template>
