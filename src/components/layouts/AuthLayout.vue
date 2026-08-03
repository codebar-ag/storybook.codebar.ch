<script setup lang="ts">
// Centered single-card shell for auth screens (login, register, reset, OTP).
// The brand slot sits above the card; footer links render quiet below it.
import { computed } from 'vue';
import Card from '../molecules/Card.vue';

// Tailwind scans for literal class names, so each width is spelled out here
// rather than interpolated into `max-w-${maxWidth}` at render time.
const MAX_WIDTHS = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
} as const;

// `maxWidth` defaults to md — the width this card was previously hardcoded to,
// so existing callers render unchanged. The wider steps exist for auth-adjacent
// screens that outgrow one column: onboarding with side-by-side billing fields,
// consent screens showing a document alongside the form.
const props = withDefaults(
    defineProps<{
        title?: string | null;
        description?: string | null;
        maxWidth?: keyof typeof MAX_WIDTHS;
    }>(),
    { title: null, description: null, maxWidth: 'md' },
);

const cardWidth = computed(() => MAX_WIDTHS[props.maxWidth]);
</script>

<template>
  <!-- Card centers in the space above the footer (`flex-1` + `justify-center`)
       rather than the whole stack centering as one group, so the footer sits at
       the bottom of the viewport on tall screens instead of floating just under
       the card. Renders identically to the old markup when no footer slot is
       passed; only footer-using callers see the difference. -->
  <div class="flex min-h-dvh flex-col items-center bg-bg px-4 py-10">
    <div class="flex w-full flex-1 flex-col items-center justify-center">
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
        class="w-full animate-fade"
        :class="cardWidth"
      >
        <slot />
      </Card>
    </div>

    <div
      v-if="$slots.footer"
      class="mt-6 text-center text-xs text-muted"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
