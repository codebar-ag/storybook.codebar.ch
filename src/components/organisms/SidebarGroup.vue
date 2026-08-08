<script setup lang="ts">
// Labeled section inside a Sidebar.
export interface SidebarGroupProps { label?: string }

defineProps<SidebarGroupProps>();
</script>

<template>
  <div class="mb-4 last:mb-0">
    <p
      v-if="label"
      class="px-2.5 pb-1.5 text-2xs uppercase tracking-wide text-dim"
    >
      {{ label }}
    </p>
    <ul class="space-y-0.5">
      <slot />
    </ul>
  </div>
</template>
