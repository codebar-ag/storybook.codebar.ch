<script setup lang="ts">
import { computed } from 'vue';

// A thin horizontal progress/proportion bar. The fill width is clamped to a
// minimum so non-zero values stay visible.
const props = withDefaults(
    defineProps<{
        value?: number;
        max?: number;
        min?: number;
    }>(),
    { value: 0, max: 100, min: 2 },
);

const percent = computed(() => {
    const max = Math.max(1, props.max);
    return Math.max(props.min, Math.min(100, (props.value / max) * 100));
});
</script>

<template>
  <div class="h-1.5 rounded-full bg-surface-2 overflow-hidden">
    <div
      class="h-full bg-ink/80 rounded-full"
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>
