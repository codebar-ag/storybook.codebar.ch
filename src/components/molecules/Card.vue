<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';
import { pick } from '../../helpers/pick';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        title?: string | null;
        description?: string | null;
        padded?: boolean;
        variant?: 'default' | 'danger';
        hoverable?: boolean;
        // 'lg' is for screens with a single, centered card as the focal point
        // (e.g. auth screens) where the default density reads cramped. 'sm'
        // is for cards nested inside another card/list — a denser container,
        // not a different component.
        size?: 'sm' | 'md' | 'lg';
    }>(),
    { title: null, description: null, padded: true, variant: 'default', hoverable: false, size: 'md' },
);

const slots = useSlots();
const { rootAttrs, classAttr } = useRootAttrs();

const variants: Record<string, string> = { default: '', danger: 'border-danger-line/60' };

const headerPadding: Record<string, string> = {
    sm: 'px-3 sm:px-4 pt-3 pb-2.5',
    md: 'px-4 sm:px-5 pt-5 pb-4',
    lg: 'px-5 sm:px-6 pt-6 pb-5',
};
const bodyPadding: Record<string, string> = {
    sm: 'px-3 sm:px-4 py-3',
    md: 'px-4 sm:px-5 py-5',
    lg: 'px-5 sm:px-6 py-6',
};
const footerPadding: Record<string, string> = {
    sm: 'px-3 sm:px-4 py-2.5',
    md: 'px-4 sm:px-5 py-4',
    lg: 'px-5 sm:px-6 py-5',
};
const titleSize: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
};

const rootClass = computed(() =>
    cx(
        'bg-surface border border-line shadow-card rounded-surface',
        pick(variants, props.variant, 'default', 'Card.variant'),
        props.hoverable ? 'hover:border-line-2 hover:shadow-card-hover transition' : '',
        classAttr.value,
    ),
);

const hasHeader = computed(
    () => props.title !== null || props.description !== null || !!slots.actions,
);
</script>

<template>
  <div
    :class="rootClass"
    v-bind="rootAttrs"
  >
    <header
      v-if="hasHeader"
      :class="['flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 border-b border-line', headerPadding[size]]"
    >
      <div class="min-w-0">
        <h2
          v-if="title !== null"
          :class="['font-semibold text-ink', titleSize[size]]"
        >
          {{ title }}
        </h2>
        <p
          v-if="description !== null"
          class="text-sm text-muted mt-0.5"
        >
          {{ description }}
        </p>
      </div>
      <div
        v-if="slots.actions"
        class="flex flex-wrap items-center gap-2 sm:shrink-0"
      >
        <slot name="actions" />
      </div>
    </header>

    <div :class="padded ? bodyPadding[size] : ''">
      <slot />
    </div>

    <footer
      v-if="slots.footer"
      :class="[footerPadding[size], 'bg-surface-2 border-t border-line text-xs text-muted rounded-b-surface']"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
