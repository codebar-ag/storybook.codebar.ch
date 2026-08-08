<script setup lang="ts">
import { computed, inject } from 'vue';
import { descriptionListKey } from './descriptionListContext';

export interface DescriptionItemProps {
    label: string;
    tone?: 'ink' | 'muted';
}

// `tone` is a text-emphasis axis (ink = primary value, muted = secondary),
// intentionally NOT `variant` (which app-wide denotes a status colour).
const props = withDefaults(
    defineProps<DescriptionItemProps>(),
    { tone: 'ink' },
);

// The row shape belongs to the list, not the item: see DescriptionList's
// `layout` prop. An item rendered outside a list falls back to `gutter`, the
// shape this component has always had.
const layout = inject(descriptionListKey, undefined);

const shape = computed(() => layout?.value ?? 'gutter');

const toneClass = computed(() => ({ ink: 'text-ink', muted: 'text-muted' })[props.tone]);

const rootClass = computed(
    () =>
        ({
            gutter: 'flex flex-wrap items-baseline gap-x-4 gap-y-1',
            rows: 'flex items-baseline justify-between gap-x-8 py-2.5 first:pt-0 last:pb-0',
        })[shape.value],
);

// `whitespace-nowrap` is the whole point of the `rows` shape — the label keeps
// its line no matter how long it runs, and the value it belongs to stays
// beside it rather than below a fold of wrapped words.
const labelClass = computed(
    () =>
        ({
            gutter: 'w-36 shrink-0',
            rows: 'whitespace-nowrap',
        })[shape.value],
);

const valueClass = computed(
    () =>
        ({
            gutter: '',
            rows: 'text-right',
        })[shape.value],
);
</script>

<template>
  <div :class="rootClass">
    <dt :class="['text-2xs text-dim uppercase tracking-wider', labelClass]">
      {{ label }}
    </dt>
    <dd :class="['min-w-0 text-sm', toneClass, valueClass]">
      <slot />
    </dd>
  </div>
</template>
