<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        href?: string | null;
        first?: boolean;
    }>(),
    { href: null, first: false },
);

const classes = computed(() => {
    const base = `w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 ${
        props.first ? '' : 'border-t border-line'
    }`;
    const interactive =
        props.href !== null
            ? ' hover:bg-surface-2 transition group focus:outline-none focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ink'
            : '';
    return base + interactive;
});

const tag = computed(() => (props.href !== null ? 'a' : 'div'));
</script>

<template>
  <component
    :is="tag"
    :href="href !== null ? href : undefined"
    :class="classes"
  >
    <div
      v-if="$slots.leading"
      class="shrink-0"
    >
      <slot name="leading" />
    </div>
    <div class="min-w-0 flex-1">
      <slot />
    </div>
    <div
      v-if="$slots.trailing"
      class="flex items-center gap-3 shrink-0"
    >
      <slot name="trailing" />
    </div>
  </component>
</template>
