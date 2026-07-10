<script setup lang="ts">
withDefaults(
    defineProps<{
        primary: string;
        subtitle?: string;
        subtitleMono?: boolean;
    }>(),
    { subtitle: '', subtitleMono: false },
);
</script>

<template>
  <span class="text-sm font-medium text-ink">{{ primary }}</span>
  <span
    v-if="subtitle"
    class="block text-2xs text-muted"
    :class="{ 'font-mono': subtitleMono }"
  >{{ subtitle }}</span>
</template>
