<script setup lang="ts">
// Disclosure group: children are AccordionItem. Single mode (default) keeps
// at most one item open; `multiple` lets them open independently.
// v-model carries the open keys.
import { provide } from 'vue';
import { useControllable } from '../../composables/useControllable';
import { accordionKey } from './accordionContext';

export interface AccordionProps {
    modelValue?: readonly string[];
    multiple?: boolean;
}

const props = withDefaults(
    defineProps<AccordionProps>(),
    { modelValue: undefined, multiple: false },
);

const emit = defineEmits<{ 'update:modelValue': [keys: string[]] }>();

// `modelValue` is accepted as readonly and copied in, so a caller can bind a
// ReadonlyArray of keys; what goes back out on update stays mutable.
const openKeys = useControllable<string[]>(
    () => (props.modelValue === undefined ? undefined : [...props.modelValue]),
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
