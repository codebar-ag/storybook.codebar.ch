<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';
import { formControlClasses } from '../helpers/formControlClasses';

defineOptions({ inheritAttrs: false });

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

const attrs = useAttrs();
const inputRef = ref<HTMLInputElement | null>(null);

const describedBy = computed(() =>
    props.invalid && props.name ? `${props.name}-error` : undefined,
);
const classes = computed(() =>
    twMerge(formControlClasses(props.invalid, 'px-3.5 h-11'), attrs.class as string),
);

const passwordManagerAttrs = computed(() => {
    if (props.type === 'password') {
        return {};
    }

    const hasAutocomplete = 'autocomplete' in attrs;

    return {
        'data-1p-ignore': true,
        'data-lpignore': 'true',
        ...(hasAutocomplete ? {} : { autocomplete: 'off' }),
    };
});

// Forward every attribute except `class` (already merged above).
const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});

defineExpose({
    focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <input
    ref="inputRef"
    :id="name ?? undefined"
    :type="type"
    :name="name ?? undefined"
    :value="modelValue"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="classes"
    v-bind="{ ...passwordManagerAttrs, ...rootAttrs }"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
</template>
