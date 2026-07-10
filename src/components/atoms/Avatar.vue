<script setup lang="ts">
// Circular avatar: image when `src` is set, otherwise initials derived from
// `name` (first letter of the first two words).
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        name?: string;
        src?: string | null;
        size?: 'sm' | 'md' | 'lg';
    }>(),
    { name: '', src: null, size: 'md' },
);

const sizes: Record<string, string> = {
    sm: 'size-7 text-2xs',
    md: 'size-9 text-xs',
    lg: 'size-12 text-base',
};

const { rootAttrs, classAttr } = useRootAttrs();

const initials = computed(() =>
    props.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]!.toUpperCase())
        .join(''),
);

const classes = computed(() =>
    cx(
        'inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full border border-line bg-surface-2 font-semibold text-muted select-none',
        sizes[props.size] ?? sizes.md,
        classAttr.value,
    ),
);
</script>

<template>
  <span
    :class="classes"
    v-bind="rootAttrs"
  >
    <img
      v-if="src !== null"
      :src="src"
      :alt="name"
      class="size-full object-cover"
    >
    <span
      v-else
      aria-hidden="true"
    >{{ initials }}</span>
    <span
      v-if="src === null"
      class="sr-only"
    >{{ name }}</span>
  </span>
</template>
