<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { resolveTone } from '../../helpers/tone';
import type { LegacyTone, Tone } from '../../helpers/tone';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        /** Semantic tone. `error` is a deprecated alias for `danger`. */
        variant?: Tone | LegacyTone;
        title?: string | null;
    }>(),
    { variant: 'info', title: null },
);

const { rootAttrs, classAttr } = useRootAttrs();

const palette: Record<Tone, string> = {
    info: 'bg-accent/5 border-accent/20 text-ink',
    success: 'bg-success-soft border-success-line text-success',
    warning: 'bg-warning-soft border-warning-line text-warning',
    danger: 'bg-danger-soft border-danger-line text-danger',
    neutral: 'bg-surface-2 border-line text-ink',
};

const classes = computed(() =>
    cx('rounded-control border px-3.5 py-2.5 text-sm', palette[resolveTone(props.variant, 'info')], classAttr.value),
);
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
