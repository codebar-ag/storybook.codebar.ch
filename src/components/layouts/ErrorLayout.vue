<script setup lang="ts">
// Full-page stage for error/system screens (404, 403, 500, maintenance):
// status code eyebrow, headline, explanation and a primary action.
withDefaults(
    defineProps<{
        code?: string | null;
        title: string;
        description?: string | null;
    }>(),
    { code: null, description: null },
);
</script>

<template>
  <main class="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-10 text-center animate-fade">
    <slot name="illustration" />

    <p
      v-if="code !== null"
      class="text-2xs uppercase tracking-wide text-dim"
    >
      {{ code }}
    </p>
    <h1 class="mt-1 text-2xl font-semibold text-ink">
      {{ title }}
    </h1>
    <p
      v-if="description !== null"
      class="mt-2 max-w-md text-sm text-muted leading-relaxed"
    >
      {{ description }}
    </p>

    <div
      v-if="$slots.actions"
      class="mt-6 flex items-center justify-center gap-2"
    >
      <slot name="actions" />
    </div>
  </main>
</template>
