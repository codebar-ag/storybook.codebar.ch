<script lang="ts">
// Tailwind scans for literal class names, so each width is spelled out here
// rather than interpolated into `max-w-${maxWidth}` at render time.
//
// This lives in a plain `<script>` block — not `<script setup>`, which can only
// export types — so consumers can import the map itself instead of
// re-declaring it. Apps that wrap this layout (a `GuestLayout` forwarding a
// `maxWidth` prop) need the same key set to type their own prop and the same
// class strings for Tailwind to scan; a private copy drifts from this one the
// first time a step is added here.
export const MAX_WIDTHS = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
} as const;

/** Accepted `maxWidth` values — the keys of {@link MAX_WIDTHS}. */
export type AuthLayoutMaxWidth = keyof typeof MAX_WIDTHS;
</script>

<script setup lang="ts">
// Centered single-card shell for auth screens (login, register, reset, OTP).
// The brand slot sits above the card; footer links render quiet below it.
import { computed } from 'vue';
import Card from '../molecules/Card.vue';
import { pick } from '../../helpers/pick';

export interface AuthLayoutProps {
    title?: string | null;
    description?: string | null;
    maxWidth?: AuthLayoutMaxWidth;
}

// `maxWidth` defaults to md — the width this card was previously hardcoded to,
// so existing callers render unchanged. The wider steps exist for auth-adjacent
// screens that outgrow one column: onboarding with side-by-side billing fields,
// consent screens showing a document alongside the form.
const props = withDefaults(
    defineProps<AuthLayoutProps>(),
    { title: null, description: null, maxWidth: 'md' },
);

// No `??` here previously: an unknown key produced `undefined`, so the card
// rendered with no max-width class at all and stretched the full column.
const cardWidth = computed(() => pick(MAX_WIDTHS, props.maxWidth, 'md', 'AuthLayout.maxWidth'));
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
