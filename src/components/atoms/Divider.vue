<script setup lang="ts">
// Horizontal (default) or vertical rule; horizontal supports a centered label.
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

withDefaults(
    defineProps<{
        orientation?: 'horizontal' | 'vertical';
        label?: string | null;
    }>(),
    { orientation: 'horizontal', label: null },
);

const { rootAttrs, classAttr } = useRootAttrs();

const horizontalClasses = computed(() => cx('border-t border-line/60', classAttr.value));
const labeledClasses = computed(() => cx('flex items-center gap-3', classAttr.value));
const verticalClasses = computed(() => cx('self-stretch w-px bg-line/60', classAttr.value));
</script>

<template>
  <div
    v-if="orientation === 'vertical'"
    role="separator"
    aria-orientation="vertical"
    :class="verticalClasses"
    v-bind="rootAttrs"
  />
  <div
    v-else-if="label !== null"
    role="separator"
    :class="labeledClasses"
    v-bind="rootAttrs"
  >
    <span class="h-px flex-1 bg-line/60" />
    <span class="text-2xs uppercase tracking-wide text-dim">{{ label }}</span>
    <span class="h-px flex-1 bg-line/60" />
  </div>
  <hr
    v-else
    :class="horizontalClasses"
    v-bind="rootAttrs"
  >
</template>
