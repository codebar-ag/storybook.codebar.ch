<script setup lang="ts">
import Icon from './Icon.vue';
import type { IconName } from '../../icons';

defineProps<{ name: IconName }>();
</script>

<template>
  <span
    class="w-8 h-8 rounded-control bg-surface-2 text-muted flex items-center justify-center"
  >
    <Icon
      :name="name"
      size="sm"
    />
  </span>
</template>
