<script setup lang="ts">
import { computed } from 'vue';
import { icons, type IconName } from '../../icons';

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

const body = computed(() => icons[props.name] ?? icons.plus);
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
