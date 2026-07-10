<script setup lang="ts">
import { computed } from 'vue';
import { useFieldA11y } from '../../composables/useFieldA11y';

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        name?: string | null;
        value?: string;
        invalid?: boolean;
        description?: string | null;
        disabled?: boolean;
    }>(),
    { modelValue: false, name: null, value: '1', invalid: false, description: null, disabled: false },
);

defineEmits<{ 'update:modelValue': [value: boolean] }>();

const { describedBy, ariaInvalid } = useFieldA11y(props);

const boxClasses = computed(
    () =>
        'mt-0.5 h-4 w-4 shrink-0 rounded accent-ink focus:outline-none focus-visible:ring-2 ' +
        'focus-visible:ring-accent/50 disabled:cursor-not-allowed ' +
        (props.invalid ? 'border-danger-line' : 'border-line'),
);
</script>

<template>
  <label
    class="flex items-start gap-2.5 min-h-11 py-1.5 cursor-pointer select-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
  >
    <input
      type="checkbox"
      :name="name ?? undefined"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      :aria-invalid="ariaInvalid"
      :aria-describedby="describedBy"
      :class="boxClasses"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    >
    <span class="min-w-0">
      <span class="block text-sm text-ink leading-relaxed"><slot /></span>
      <span
        v-if="description !== null"
        class="block text-xs text-muted mt-0.5 leading-relaxed"
      >{{ description }}</span>
    </span>
  </label>
</template>
