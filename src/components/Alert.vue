<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
        title?: string | null;
    }>(),
    { variant: 'info', title: null },
);

const palette: Record<string, string> = {
    info: 'bg-accent/5 border-accent/20 text-ink',
    success: 'bg-success-soft border-success-line text-success',
    warning: 'bg-warning-soft border-warning-line text-warning',
    error: 'bg-danger-soft border-danger-line text-danger',
    neutral: 'bg-surface-2 border-line text-ink',
};

const classes = computed(
    () => `rounded-control border px-3.5 py-2.5 text-sm ${palette[props.variant] ?? palette.info}`,
);
</script>

<template>
  <div
    :class="classes"
    role="alert"
  >
    <div
      v-if="title !== null"
      class="font-semibold text-base mb-0.5"
    >
      {{ title }}
    </div>
    <div><slot /></div>
  </div>
</template>
