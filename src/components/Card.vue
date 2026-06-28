<script setup lang="ts">
import { computed, useSlots } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string | null;
        description?: string | null;
        padded?: boolean;
        variant?: 'default' | 'danger';
        hoverable?: boolean;
    }>(),
    { title: null, description: null, padded: true, variant: 'default', hoverable: false },
);

const slots = useSlots();

const variants: Record<string, string> = { default: '', danger: 'border-danger-line/60' };

const variantClass = computed(() =>
    [
        variants[props.variant] ?? '',
        props.hoverable ? 'hover:border-line-2 hover:shadow-card-hover transition' : '',
    ]
        .join(' ')
        .trim(),
);

const rootClass = computed(() =>
    `bg-surface border border-line shadow-card rounded-surface ${variantClass.value}`.trim(),
);

const hasHeader = computed(
    () => props.title !== null || props.description !== null || !!slots.actions,
);
</script>

<template>
  <div :class="rootClass">
    <header
      v-if="hasHeader"
      class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 px-4 sm:px-5 pt-5 pb-4 border-b border-line"
    >
      <div class="min-w-0">
        <h2
          v-if="title !== null"
          class="font-semibold text-lg text-ink"
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

    <div :class="padded ? 'px-4 sm:px-5 py-5' : ''">
      <slot />
    </div>

    <footer
      v-if="slots.footer"
      class="px-4 sm:px-5 py-4 bg-surface-2 border-t border-line text-xs text-muted rounded-b-surface"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
