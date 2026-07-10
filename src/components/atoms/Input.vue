<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useFieldA11y } from '../../composables/useFieldA11y';
import { usePasswordManagerAttrs } from '../../composables/usePasswordManagerAttrs';
import { useRootAttrs } from '../../composables/useRootAttrs';

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

const { rootAttrs, classAttr } = useRootAttrs();
const { describedBy } = useFieldA11y(props);
// Password managers should engage on actual password fields only.
const passwordManagerAttrs = usePasswordManagerAttrs(() => props.type !== 'password');
const inputRef = ref<HTMLInputElement | null>(null);

const classes = computed(() =>
    cx(formControlClasses(props.invalid, 'px-3.5 h-11'), classAttr.value),
);

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
