<script setup lang="ts">
// One-time-code input: n single-character cells with auto-advance,
// backspace-retreat and paste splitting. v-model carries the joined string;
// `complete` fires once every cell is filled.
import { computed, ref } from 'vue';
import { cx } from '../../helpers/cx';
import { useFieldA11y } from '../../composables/useFieldA11y';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        length?: number;
        name?: string | null;
        invalid?: boolean;
        disabled?: boolean;
        label?: string;
    }>(),
    {
        modelValue: '',
        length: 6,
        name: null,
        invalid: false,
        disabled: false,
        label: 'Verification code',
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    complete: [value: string];
}>();

const { describedBy } = useFieldA11y(props);
const cells = ref<HTMLInputElement[]>([]);

const chars = computed(() => {
    const value = props.modelValue.slice(0, props.length).split('');
    return Array.from({ length: props.length }, (_, i) => value[i] ?? '');
});

const cellClasses = computed(() =>
    cx(
        'size-11 rounded-control border text-center text-lg font-semibold text-ink transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2',
        props.invalid ? 'border-danger-line bg-danger-soft/40' : 'border-line bg-bg',
    ),
);

function commit(next: string[]): void {
    const value = next.join('');
    emit('update:modelValue', value);
    if (value.length === props.length && next.every((c) => c !== '')) {
        emit('complete', value);
    }
}

function setCellRef(el: unknown, index: number): void {
    if (el) {
        cells.value[index] = el as HTMLInputElement;
    }
}

function focusCell(index: number): void {
    cells.value[Math.max(0, Math.min(index, props.length - 1))]?.focus();
}

function onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const char = input.value.slice(-1);
    input.value = char;
    const next = [...chars.value];
    next[index] = char;
    commit(next);
    if (char !== '') {
        focusCell(index + 1);
    }
}

function onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && chars.value[index] === '' && index > 0) {
        event.preventDefault();
        const next = [...chars.value];
        next[index - 1] = '';
        commit(next);
        focusCell(index - 1);
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        focusCell(index - 1);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        focusCell(index + 1);
    }
}

function onPaste(index: number, event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\s/g, '');
    if (!pasted) {
        return;
    }
    const next = [...chars.value];
    for (let i = 0; i < pasted.length && index + i < props.length; i++) {
        next[index + i] = pasted[i];
    }
    commit(next);
    focusCell(index + pasted.length);
}
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    :aria-describedby="describedBy"
    class="flex items-center gap-2"
  >
    <input
      v-for="(char, index) in chars"
      :key="index"
      :ref="(el) => setCellRef(el, index)"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="2"
      :value="char"
      :disabled="disabled"
      :aria-label="`${label}: digit ${index + 1} of ${length}`"
      :aria-invalid="invalid ? 'true' : undefined"
      :class="cellClasses"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste(index, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    >
    <input
      v-if="name !== null"
      type="hidden"
      :name="name"
      :value="modelValue"
    >
  </div>
</template>
