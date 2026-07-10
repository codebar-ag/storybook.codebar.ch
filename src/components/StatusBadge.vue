<script setup lang="ts">
import Badge from './Badge.vue';

// Generic status badge: the consuming app maps its own enum → { variant, label }.
// `dot` renders the small leading status dot used by instance status badges.
withDefaults(
    defineProps<{
        variant?: 'gray' | 'blue' | 'green' | 'amber' | 'red';
        label: string;
        dot?: boolean;
    }>(),
    { variant: 'gray', dot: false },
);
</script>

<template>
  <Badge :variant="variant">
    <span
      v-if="dot"
      aria-hidden="true"
      class="size-1.5 rounded-full bg-current opacity-70"
    />
    {{ label }}
  </Badge>
</template>
