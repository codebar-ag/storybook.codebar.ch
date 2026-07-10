<script setup lang="ts">
// Keyboard key cap for shortcut hints, e.g. <Kbd>⌘</Kbd> <Kbd>K</Kbd>.
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

const { rootAttrs, classAttr } = useRootAttrs();

const classes = computed(() =>
    cx(
        'inline-flex items-center justify-center min-w-5 h-5 rounded-pill border border-line border-b-2 bg-surface-2 px-1.5 text-2xs font-medium text-muted',
        classAttr.value,
    ),
);
</script>

<template>
  <kbd
    :class="classes"
    v-bind="rootAttrs"
  ><slot /></kbd>
</template>
