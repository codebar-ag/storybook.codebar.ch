<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';
import { formControlClasses } from '../helpers/formControlClasses';

defineOptions({ inheritAttrs: false });

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

const attrs = useAttrs();

const describedBy = computed(() =>
    props.invalid && props.name ? `${props.name}-error` : undefined,
);
const classes = computed(() =>
    twMerge(formControlClasses(props.invalid, 'px-3.5 py-2.5 min-h-24 leading-relaxed'), attrs.class as string),
);

// Forward every attribute except `class` (already merged above).
const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
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
    v-bind="rootAttrs"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
