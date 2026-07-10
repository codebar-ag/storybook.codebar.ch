<script setup lang="ts">
// Disclosure group: children are AccordionItem. Single mode (default) keeps
// at most one item open; `multiple` lets them open independently.
// v-model carries the open keys.
import { provide } from 'vue';
import { useControllable } from '../../composables/useControllable';
import { accordionKey } from './accordionContext';

const props = withDefaults(
    defineProps<{
        modelValue?: string[];
        multiple?: boolean;
    }>(),
    { modelValue: undefined, multiple: false },
);

const emit = defineEmits<{ 'update:modelValue': [keys: string[]] }>();

const openKeys = useControllable(
    () => props.modelValue,
    (value) => emit('update:modelValue', value),
    [],
);

provide(accordionKey, {
    isOpen: (key: string) => openKeys.value.includes(key),
    toggle: (key: string) => {
        if (openKeys.value.includes(key)) {
            openKeys.value = openKeys.value.filter((k) => k !== key);
        } else {
            openKeys.value = props.multiple ? [...openKeys.value, key] : [key];
        }
    },
});
</script>

<template>
  <div class="divide-y divide-line/60 rounded-surface border border-line bg-surface">
    <slot />
  </div>
</template>
