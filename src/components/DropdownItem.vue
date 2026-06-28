<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        href?: string | null;
        active?: boolean;
        // `submit` lets the item act as a form submit button (e.g. tenant switch).
        type?: 'button' | 'submit';
    }>(),
    { href: null, active: false, type: 'button' },
);

const classes = computed(
    () =>
        'flex items-center w-full text-left min-h-11 px-3 py-1.5 text-sm cursor-pointer transition ' +
        'focus:outline-none focus-visible:bg-surface-2 focus-visible:text-ink ' +
        (props.active
            ? 'bg-surface-2 text-ink'
            : 'text-muted hover:text-ink hover:bg-surface-2'),
);
</script>

<template>
  <a
    v-if="href !== null"
    :href="href"
    role="menuitem"
    :class="classes"
  ><slot /></a>
  <button
    v-else
    :type="type"
    role="menuitem"
    :class="classes"
  >
    <slot />
  </button>
</template>
