<script setup lang="ts">
import { computed } from 'vue';
import { useFieldA11y } from '../../composables/useFieldA11y';

const props = withDefaults(
    defineProps<{
        modelValue?: string | number | boolean | null;
        value: string | number | boolean;
        name?: string | null;
        label?: string | null;
        description?: string | null;
        invalid?: boolean;
        disabled?: boolean;
    }>(),
    { modelValue: null, name: null, label: null, description: null, invalid: false, disabled: false },
);

defineEmits<{ 'update:modelValue': [value: string | number | boolean] }>();

const { describedBy, ariaInvalid } = useFieldA11y(props);

const checked = computed(() => props.modelValue === props.value);

const cardClasses = computed(
    () =>
        'flex cursor-pointer items-start gap-3 rounded-control border p-3 transition ' +
        'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 ' +
        (checked.value
            ? 'border-accent bg-surface-2'
            : props.invalid
              ? 'border-danger-line'
              : 'border-line'),
);
</script>

<template>
  <label :class="cardClasses">
    <input
      type="radio"
      class="mt-1 accent-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      :name="name ?? undefined"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
      @change="$emit('update:modelValue', value)"
    >
    <span class="min-w-0 flex-1">
      <span
        v-if="label !== null"
        class="block text-sm font-medium text-ink"
      >{{ label }}</span>
      <span
        v-if="description !== null"
        class="block text-xs text-muted"
      >{{ description }}</span>
    </span>
  </label>
</template>
