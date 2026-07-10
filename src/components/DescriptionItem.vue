<script setup lang="ts">
import { computed } from 'vue';

// `tone` is a text-emphasis axis (ink = primary value, muted = secondary),
// intentionally NOT `variant` (which app-wide denotes a status colour).
const props = withDefaults(
    defineProps<{
        label: string;
        tone?: 'ink' | 'muted';
    }>(),
    { tone: 'ink' },
);

const toneClass = computed(() => ({ ink: 'text-ink', muted: 'text-muted' })[props.tone]);
</script>

<template>
  <div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
    <dt class="w-36 shrink-0 text-2xs text-dim uppercase tracking-wider">
      {{ label }}
    </dt>
    <dd :class="['min-w-0 text-sm', toneClass]">
      <slot />
    </dd>
  </div>
</template>
