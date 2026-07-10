<script setup lang="ts">
// Indeterminate loading indicator. Announces itself as a live status region;
// the visible text stays with the caller (e.g. Button's label), the sr-only
// label covers standalone use.
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        size?: 'sm' | 'md' | 'lg';
        label?: string;
    }>(),
    { size: 'md', label: 'Loading…' },
);

const sizes: Record<string, string> = {
    sm: 'size-3.5',
    md: 'size-5',
    lg: 'size-7',
};

const { rootAttrs, classAttr } = useRootAttrs();

const classes = computed(() =>
    cx('inline-block animate-spin text-current', sizes[props.size] ?? sizes.md, classAttr.value),
);
</script>

<template>
  <span
    role="status"
    :class="classes"
    v-bind="rootAttrs"
  >
    <svg
      class="size-full"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
      />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
