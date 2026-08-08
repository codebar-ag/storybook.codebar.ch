<script setup lang="ts">
import CodeLine from './CodeLine.vue';

export interface LabeledCodeBlockProps {
    label: string;
    value?: string;
    copyable?: boolean;
}

// An uppercase caption over a copyable code line. Used for surfacing URLs,
// endpoints, and one-time secrets.
withDefaults(
    defineProps<LabeledCodeBlockProps>(),
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
