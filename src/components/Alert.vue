<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
        title?: string | null;
    }>(),
    { variant: 'info', title: null },
);

const attrs = useAttrs();

const palette: Record<string, string> = {
    info: 'bg-accent/5 border-accent/20 text-ink',
    success: 'bg-success-soft border-success-line text-success',
    warning: 'bg-warning-soft border-warning-line text-warning',
    error: 'bg-danger-soft border-danger-line text-danger',
    neutral: 'bg-surface-2 border-line text-ink',
};

const classes = computed(() =>
    twMerge('rounded-control border px-3.5 py-2.5 text-sm', palette[props.variant] ?? palette.info, attrs.class as string),
);

// Forward every attribute except `class` (already merged above).
const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
</script>

<template>
  <div
    :class="classes"
    role="alert"
    v-bind="rootAttrs"
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
