<script setup lang="ts">
// Pulsing placeholder block for content still loading (e.g. behind a
// Deferred prop). Default size matches the most common loading-card height;
// override via `class` for other shapes.
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const classes = computed(() => twMerge('h-24 animate-pulse rounded-control bg-surface-2', attrs.class as string));

const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
</script>

<template>
  <div
    :class="classes"
    v-bind="rootAttrs"
  />
</template>
