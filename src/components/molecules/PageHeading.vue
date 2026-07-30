<script setup lang="ts">
// Page/section title, optionally preceded by an eyebrow caption and followed
// by a description. Covers the plain `<h1 class="text-xl font-semibold
// text-ink">` pattern repeated across most pages. An optional `#actions`
// slot renders a right-aligned action cluster beside the title (wraps below
// it on narrow screens) — omit the slot and this renders exactly as before.
import { computed, useSlots } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

defineOptions({ inheritAttrs: false });

withDefaults(
    defineProps<{
        eyebrow?: string | null;
    }>(),
    { eyebrow: null },
);

const slots = useSlots();
const { rootAttrs, classAttr } = useRootAttrs();

const classes = computed(() => cx('text-xl font-semibold text-ink', classAttr.value));
</script>

<template>
  <div class="flex flex-wrap items-start justify-between gap-4">
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
    <div
      v-if="slots.actions"
      class="flex flex-wrap items-center gap-2 shrink-0"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
