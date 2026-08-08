<script setup lang="ts">
import IconBadge from '../atoms/IconBadge.vue';
import type { IconName } from '../../icons';

export interface EmptyStateProps {
    icon?: IconName;
    variant?: 'accent' | 'danger' | 'success' | 'warning' | 'neutral';
    title?: string | null;
    description?: string | null;
}

withDefaults(
    defineProps<EmptyStateProps>(),
    { icon: 'sparkles', variant: 'neutral', title: null, description: null },
);
</script>

<template>
  <div class="flex flex-col items-center text-center px-5 py-10">
    <slot name="illustration">
      <IconBadge
        :icon="icon"
        :variant="variant"
        size="md"
        shape="circle"
        class="mb-4"
      />
    </slot>

    <h3
      v-if="title !== null"
      class="font-semibold text-base text-ink"
    >
      {{ title }}
    </h3>
    <p
      v-if="description !== null"
      class="text-sm text-muted mt-1 max-w-sm leading-relaxed"
    >
      {{ description }}
    </p>

    <div
      v-if="$slots.actions"
      class="mt-5 flex items-center justify-center gap-2"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
