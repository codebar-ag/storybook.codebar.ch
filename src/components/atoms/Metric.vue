<script setup lang="ts">
export interface MetricProps {
    label: string | number;
    value: string | number;
}

defineProps<MetricProps>();
</script>

<template>
  <div
    data-slot="metric"
    class="bg-surface px-3 py-2.5"
  >
    <div
      data-slot="metric-label"
      class="text-2xs text-dim uppercase tracking-wider"
    >
      {{ label }}
    </div>
    <div
      data-slot="metric-value"
      class="text-lg font-semibold text-ink mt-0.5 tabular-nums"
    >
      {{ value }}
    </div>
  </div>
</template>
