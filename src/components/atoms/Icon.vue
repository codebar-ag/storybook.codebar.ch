<script setup lang="ts">
import { computed } from 'vue';
import { icons, type IconName } from '../../icons';
import { pick } from '../../helpers/pick';

const props = withDefaults(
    defineProps<{
        name?: IconName;
        size?: 'sm' | 'md' | 'lg';
    }>(),
    { name: 'plus', size: 'md' },
);

const sizeClass = computed(
    () => ({ sm: 'size-4', md: 'size-5', lg: 'size-6' })[props.size],
);

// A typo'd icon name silently rendered a plus sign — visually plausible,
// so it survived review. Now it still renders the plus, but says so.
const body = computed(() => pick(icons, props.name, 'plus', 'Icon.name'));
</script>

<template>
  <svg
    :class="[sizeClass, 'shrink-0']"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    viewBox="0 0 24 24"
    aria-hidden="true"
    v-html="body"
  />
</template>
