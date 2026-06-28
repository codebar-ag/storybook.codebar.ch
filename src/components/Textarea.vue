<script setup lang="ts">
import { computed } from 'vue';
import { formControlClasses } from '../helpers/formControlClasses';

const props = withDefaults(
    defineProps<{
        modelValue?: string | null;
        name?: string | null;
        rows?: number;
        invalid?: boolean;
    }>(),
    { modelValue: '', name: null, rows: 4, invalid: false },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const describedBy = computed(() =>
    props.invalid && props.name ? `${props.name}-error` : undefined,
);
const classes = computed(() =>
    formControlClasses(props.invalid, 'px-3.5 py-2.5 min-h-24 leading-relaxed'),
);
</script>

<template>
  <textarea
    :id="name ?? undefined"
    :name="name ?? undefined"
    :rows="rows"
    :value="modelValue ?? ''"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="classes"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
