<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useFieldA11y } from '../../composables/useFieldA11y';
import { useRootAttrs } from '../../composables/useRootAttrs';

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

const { rootAttrs, classAttr } = useRootAttrs();
const { describedBy } = useFieldA11y(props);

const classes = computed(() =>
    cx(formControlClasses(props.invalid, 'px-3.5 py-2.5 min-h-24 leading-relaxed'), classAttr.value),
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
    v-bind="rootAttrs"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
