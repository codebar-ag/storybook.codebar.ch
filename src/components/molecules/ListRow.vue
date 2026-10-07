<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Component, FunctionalComponent } from 'vue';
import { stackedListKey } from '../../helpers/stackedList';

export interface ListRowProps {
    href?: string | null;
    first?: boolean;
    // Link component (e.g. Inertia's Link) used instead of <a> when href is set.
    as?: Component | null;
    /** Row title: one line, truncated. Pair with `description` and the `#badge` slot. */
    title?: string | null;
    /** Muted second line under the title, truncated. */
    description?: string | null;
}

const props = withDefaults(
    defineProps<ListRowProps>(),
    { href: null, first: false, as: null, title: null, description: null },
);

// Inside a StackedList the row is a list item; elsewhere it renders as before.
const inStackedList = inject(stackedListKey, false);
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.();

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

const tag = computed(() => (props.href !== null ? (props.as ?? 'a') : 'div'));
</script>

<template>
  <component :is="inStackedList ? 'li' : Passthrough">
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
        <!-- The title line and the badge beside it: one typography for every
             list, instead of each caller restyling its own two spans. -->
        <span
          v-if="title !== null"
          class="flex min-w-0 items-center gap-2"
        >
          <span class="truncate text-sm font-medium text-ink">{{ title }}</span>
          <span
            v-if="$slots.badge"
            class="flex shrink-0 items-center gap-1.5"
          ><slot name="badge" /></span>
        </span>
        <span
          v-if="description !== null"
          class="block truncate text-xs text-muted"
        >{{ description }}</span>
        <slot />
      </div>
      <div
        v-if="$slots.trailing"
        class="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-3"
      >
        <slot name="trailing" />
      </div>
    </component>
  </component>
</template>
