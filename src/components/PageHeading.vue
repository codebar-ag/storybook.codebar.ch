<script setup lang="ts">
// Page/section title, optionally preceded by an eyebrow caption and followed
// by a description. Covers the plain `<h1 class="text-xl font-semibold
// text-ink">` pattern repeated across most pages — badges/actions alongside
// the title stay as siblings in the caller's own header row.
import { computed, useAttrs, useSlots } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

withDefaults(
    defineProps<{
        eyebrow?: string | null;
    }>(),
    { eyebrow: null },
);

const slots = useSlots();
const attrs = useAttrs();

const classes = computed(() => twMerge('text-xl font-semibold text-ink', attrs.class as string));

const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
</script>

<template>
  <div class="min-w-0">
    <p
      v-if="eyebrow"
      class="text-2xs uppercase tracking-wide text-muted"
    >
      {{ eyebrow }}
    </p>
    <h1
      :class="classes"
      v-bind="rootAttrs"
    >
      <slot />
    </h1>
    <p
      v-if="slots.description"
      class="mt-1 text-sm text-muted"
    >
      <slot name="description" />
    </p>
  </div>
</template>
