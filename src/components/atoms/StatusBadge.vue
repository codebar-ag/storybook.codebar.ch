<script setup lang="ts">
import Badge from './Badge.vue';
import type { Category, LegacyTone, Tone } from '../../helpers/tone';

// Generic status badge: the consuming app maps its own enum → { variant, label }
// or → { category, label }.
// `dot` renders the small leading status dot used by instance status badges.
//
// `variant` has no prop default here either: forwarding a defaulted 'neutral'
// alongside a `category` would trip Badge's mutual-exclusivity warning on every
// categorical StatusBadge. Badge applies the same 'neutral' fallback, so an
// unset `variant` still renders exactly as before.
/* eslint-disable vue/require-default-prop -- see Badge.vue: defaulting either
   of these would forward a value Badge cannot distinguish from an unset one. */
withDefaults(
    defineProps<{
        /** SEVERITY tone; legacy color names are deprecated (see Badge). */
        variant?: Tone | LegacyTone;
        /**
         * CATEGORICAL identity, for a state that is not a severity — enabled,
         * overridden, duplicate, published, or a kind label. Mutually exclusive
         * with `variant`.
         */
        category?: Category;
        label: string;
        dot?: boolean;
    }>(),
    { dot: false },
);
/* eslint-enable vue/require-default-prop */
</script>

<template>
  <Badge
    :variant="variant"
    :category="category"
  >
    <span
      v-if="dot"
      aria-hidden="true"
      class="size-1.5 rounded-full bg-current opacity-70"
    />
    {{ label }}
  </Badge>
</template>
