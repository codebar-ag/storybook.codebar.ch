<script setup lang="ts">
// Numeric input with stepper buttons. Builds on the native number input, so
// ArrowUp/ArrowDown and min/max/step come from the platform; the buttons
// mirror that stepping for pointer users.
import { computed, ref } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useFieldA11y } from '../../composables/useFieldA11y';
import Icon from '../atoms/Icon.vue';

const props = withDefaults(
    defineProps<{
        modelValue?: number | null;
        name?: string | null;
        min?: number | null;
        max?: number | null;
        step?: number;
        invalid?: boolean;
        disabled?: boolean;
    }>(),
    { modelValue: null, name: null, min: null, max: null, step: 1, invalid: false, disabled: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();

const { describedBy } = useFieldA11y(props);
const inputRef = ref<HTMLInputElement | null>(null);

const classes = computed(() =>
    cx(
        formControlClasses(props.invalid, 'pl-3.5 pr-20 h-11'),
        // The native spinner would collide with our buttons.
        '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    ),
);

function clamp(value: number): number {
    let next = value;
    if (props.min !== null) {
        next = Math.max(props.min, next);
    }
    if (props.max !== null) {
        next = Math.min(props.max, next);
    }
    return next;
}

function onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    emit('update:modelValue', raw === '' ? null : Number(raw));
}

function stepBy(direction: 1 | -1): void {
    if (props.disabled) {
        return;
    }
    const current = props.modelValue ?? (props.min !== null ? props.min - direction * props.step : 0);
    emit('update:modelValue', clamp(current + direction * props.step));
    inputRef.value?.focus();
}
</script>

<template>
  <div class="relative">
    <input
      ref="inputRef"
      :id="name ?? undefined"
      type="number"
      :name="name ?? undefined"
      :value="modelValue ?? ''"
      :min="min ?? undefined"
      :max="max ?? undefined"
      :step="step"
      :disabled="disabled"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="classes"
      @input="onInput"
    >
    <span class="absolute inset-y-1 right-1 flex items-stretch gap-px">
      <button
        type="button"
        tabindex="-1"
        aria-label="Decrease"
        :disabled="disabled"
        class="flex w-9 items-center justify-center rounded-l-pill text-dim transition hover:bg-surface-2 hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed"
        @click="stepBy(-1)"
      >
        <Icon
          name="minus"
          size="sm"
        />
      </button>
      <button
        type="button"
        tabindex="-1"
        aria-label="Increase"
        :disabled="disabled"
        class="flex w-9 items-center justify-center rounded-r-pill text-dim transition hover:bg-surface-2 hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed"
        @click="stepBy(1)"
      >
        <Icon
          name="plus"
          size="sm"
        />
      </button>
    </span>
  </div>
</template>
