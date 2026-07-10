<script setup lang="ts">
import CodeLine from './CodeLine.vue';

// An uppercase caption over a copyable code line. Used for surfacing URLs,
// endpoints, and one-time secrets.
withDefaults(
    defineProps<{
        label: string;
        value?: string;
        copyable?: boolean;
    }>(),
    { value: '', copyable: true },
);
</script>

<template>
  <div>
    <p class="text-2xs text-dim uppercase tracking-wider mb-1.5">
      {{ label }}
    </p>
    <CodeLine
      :value="value"
      :copyable="copyable"
    />
  </div>
</template>
