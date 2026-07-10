<script setup lang="ts">
defineProps<{
    label: string | number;
    value: string | number;
}>();
</script>

<template>
  <div class="bg-surface px-3 py-2.5">
    <div class="text-2xs text-dim uppercase tracking-wider">
      {{ label }}
    </div>
    <div class="text-lg font-semibold text-ink mt-0.5 tabular-nums">
      {{ value }}
    </div>
  </div>
</template>
