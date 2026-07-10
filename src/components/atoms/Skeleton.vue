<script setup lang="ts">
// Pulsing placeholder block for content still loading (e.g. behind a
// Deferred prop). Default size matches the most common loading-card height;
// override via `class` for other shapes.
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

const { rootAttrs, classAttr } = useRootAttrs();

const classes = computed(() => cx('h-24 animate-pulse rounded-control bg-surface-2', classAttr.value));
</script>

<template>
  <div
    :class="classes"
    v-bind="rootAttrs"
  />
</template>
