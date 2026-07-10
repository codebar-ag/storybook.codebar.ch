<script setup lang="ts">
// Centered single-card shell for auth screens (login, register, reset, OTP).
// The brand slot sits above the card; footer links render quiet below it.
import Card from '../molecules/Card.vue';

withDefaults(
    defineProps<{
        title?: string | null;
        description?: string | null;
    }>(),
    { title: null, description: null },
);
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-10">
    <div
      v-if="$slots.brand"
      class="mb-6"
    >
      <slot name="brand" />
    </div>

    <Card
      size="lg"
      :title="title"
      :description="description"
      class="w-full max-w-md animate-fade"
    >
      <slot />
    </Card>

    <div
      v-if="$slots.footer"
      class="mt-6 text-center text-xs text-muted"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
