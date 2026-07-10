<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useFieldA11y } from '../../composables/useFieldA11y';
import { usePasswordManagerAttrs } from '../../composables/usePasswordManagerAttrs';
import { useRootAttrs } from '../../composables/useRootAttrs';
import Icon from './Icon.vue';

export interface SelectOption {
    value: string | number;
    label: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        modelValue?: string | number | null;
        name?: string | null;
        options?: SelectOption[] | Record<string, string>;
        placeholder?: string | null;
        invalid?: boolean;
    }>(),
    { modelValue: null, name: null, options: () => [], placeholder: null, invalid: false },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const { rootAttrs, classAttr } = useRootAttrs();
const { describedBy } = useFieldA11y(props);
const passwordManagerAttrs = usePasswordManagerAttrs();

const normalized = computed<SelectOption[]>(() =>
    Array.isArray(props.options)
        ? props.options
        : Object.entries(props.options).map(([value, label]) => ({ value, label })),
);

const classes = computed(() =>
    cx(formControlClasses(props.invalid, 'appearance-none h-11 pl-3.5 pr-10'), classAttr.value),
);
</script>

<template>
  <div class="relative">
    <select
      :id="name ?? undefined"
      :name="name ?? undefined"
      :value="modelValue"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="classes"
      v-bind="{ ...passwordManagerAttrs, ...rootAttrs }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-if="placeholder !== null"
        value=""
        :selected="modelValue === null || modelValue === ''"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="opt in normalized"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <span
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-dim"
    >
      <Icon
        name="chevron-down"
        size="sm"
      />
    </span>
  </div>
</template>
