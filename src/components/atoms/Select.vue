<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useFieldA11y } from '../../composables/useFieldA11y';
import { usePasswordManagerAttrs } from '../../composables/usePasswordManagerAttrs';
import { useRootAttrs } from '../../composables/useRootAttrs';
import Icon from './Icon.vue';

/**
 * An option's `value` type is a parameter so a caller whose values are all
 * strings can say so — `SelectOption<string>[]` — and have that flow through
 * SearchableSelect's and Combobox's payloads instead of coercing
 * `string | number` back down at every call site.
 *
 * The default stays `string | number`, NOT `string`: narrowing it would
 * silently break every existing `SelectOption[]` annotation carrying numeric
 * ids, which this package supports on purpose.
 */
export interface SelectOption<T extends string | number = string | number> {
    value: T;
    label: string;
}

defineOptions({ inheritAttrs: false });

export interface SelectProps {
    modelValue?: string | number | null;
    name?: string | null;
    options?: SelectOption[] | Record<string, string>;
    placeholder?: string | null;
    invalid?: boolean;
}

const props = withDefaults(
    defineProps<SelectProps>(),
    { modelValue: null, name: null, options: () => [], placeholder: null, invalid: false },
);

// Deliberately NOT generic over the option value, unlike SearchableSelect and
// Combobox. This is a native <select>: the change event carries
// `HTMLSelectElement.value`, which the DOM has already stringified, so a
// `SelectOption<number>` here would emit "1" and not 1. Typing the emit as `T`
// would be a lie the compiler could not catch.
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
