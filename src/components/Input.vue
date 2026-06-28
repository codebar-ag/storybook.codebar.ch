<script setup lang="ts">
import { computed } from 'vue';
import { formControlClasses } from '../helpers/formControlClasses';

const props = withDefaults(
    defineProps<{
        modelValue?: string | number | null;
        type?: string;
        name?: string | null;
        invalid?: boolean;
    }>(),
    { modelValue: '', type: 'text', name: null, invalid: false },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const describedBy = computed(() =>
    props.invalid && props.name ? `${props.name}-error` : undefined,
);
const classes = computed(() => formControlClasses(props.invalid, 'px-3.5 h-11'));
</script>

<template>
  <input
    :id="name ?? undefined"
    :type="type"
    :name="name ?? undefined"
    :value="modelValue"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="classes"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>
