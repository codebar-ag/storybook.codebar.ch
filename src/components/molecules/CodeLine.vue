<script setup lang="ts">
import CopyButton from './CopyButton.vue';

withDefaults(
    defineProps<{
        value?: string;
        copyable?: boolean;
    }>(),
    { value: '', copyable: true },
);
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-control px-3.5 h-10 bg-surface-2 border border-line"
  >
    <code class="flex-1 min-w-0 truncate text-xs text-ink">{{ value }}</code>
    <CopyButton
      v-if="copyable"
      :value="value"
      class="text-dim hover:text-ink focus-visible:ring-accent/50"
    />
  </div>
</template>
