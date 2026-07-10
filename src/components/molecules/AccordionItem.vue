<script setup lang="ts">
// One disclosure inside an Accordion. Standalone use (outside an Accordion)
// falls back to independent open state.
import { computed, inject, ref, useId } from 'vue';
import { accordionKey } from './accordionContext';
import Icon from '../atoms/Icon.vue';

const props = withDefaults(
    defineProps<{
        title: string;
        // Key within the parent Accordion; defaults to the title.
        value?: string | null;
    }>(),
    { value: null },
);

const context = inject(accordionKey, null);
const key = computed(() => props.value ?? props.title);
const localOpen = ref(false);
const baseId = useId();

const open = computed(() => (context ? context.isOpen(key.value) : localOpen.value));

function toggle(): void {
    if (context) {
        context.toggle(key.value);
    } else {
        localOpen.value = !localOpen.value;
    }
}
</script>

<template>
  <div>
    <h3>
      <button
        :id="`${baseId}-header`"
        type="button"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="`${baseId}-panel`"
        class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-ink transition cursor-pointer hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
        @click="toggle"
      >
        {{ title }}
        <Icon
          name="chevron-down"
          size="sm"
          :class="['shrink-0 text-dim transition-transform', open ? 'rotate-180' : '']"
        />
      </button>
    </h3>
    <div
      v-show="open"
      :id="`${baseId}-panel`"
      role="region"
      :aria-labelledby="`${baseId}-header`"
      class="px-4 pb-4 text-sm text-muted"
    >
      <slot />
    </div>
  </div>
</template>
