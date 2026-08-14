<script setup lang="ts" generic="T extends string | number = string | number">
// Free-text input with filtered suggestions (ARIA combobox). Unlike
// SearchableSelect — which picks from a closed set — the typed text IS the
// value; suggestions are shortcuts. Built on the same useListNavigation core.
import { computed, ref } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useClickOutside } from '../../composables/useClickOutside';
import { useFieldA11y } from '../../composables/useFieldA11y';
import { useListNavigation } from '../../composables/useListNavigation';
import Icon from '../atoms/Icon.vue';
import type { SelectOption } from '../atoms/Select.vue';

/**
 * Generic over the option value. `modelValue` stays a plain string — here the
 * TYPED TEXT is the value and suggestions are only shortcuts — but `@select`
 * hands back the option that was picked, so its `value` should keep whatever
 * type the caller's options carry.
 */
export interface ComboboxProps<T extends string | number = string | number> {
    modelValue?: string;
    options?: readonly SelectOption<T>[];
    name?: string | null;
    placeholder?: string | null;
    invalid?: boolean;
    emptyMessage?: string | null;
    /**
     * Show an ✕ at the right end while the field holds anything, so a value
     * can be emptied in one gesture. Selecting a suggestion overwrites the
     * text wholesale, so without it the only way back to empty is to select
     * the field's contents by hand and delete them.
     */
    clearable?: boolean;
    clearLabel?: string;
}

const props = withDefaults(
    defineProps<ComboboxProps<T>>(),
    {
        modelValue: '',
        options: () => [],
        name: null,
        placeholder: null,
        invalid: false,
        emptyMessage: null,
        clearable: false,
        clearLabel: 'Clear value',
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    select: [option: SelectOption<T>];
}>();

const { describedBy } = useFieldA11y(props);

const root = ref<HTMLElement | null>(null);
const field = ref<HTMLInputElement | null>(null);

// Focus opens UNCONDITIONALLY (`@focus="open = true"` below), not only when
// options are already present. The list itself stays gated on having something
// to show (see the `v-if` on the listbox), so an open flag over an empty,
// message-less list renders nothing — but it is what lets options that arrive
// AFTER focus appear at all. With `open = filtered.length > 0` on focus, a
// consumer feeding options from a remote search lost that race whenever the
// response landed after the click, and the closed list never reopened: the
// user clicked into the field, saw nothing, and only typing or ArrowDown
// would recover. Measured in the consuming app's CI, where the runner is slow
// enough that the click reliably beat the response.
const open = ref(false);
const listId = `${props.name ?? 'combobox'}-listbox`;

const filtered = computed(() => {
    const q = props.modelValue.trim().toLowerCase();
    if (!q) {
        return props.options;
    }
    return props.options.filter((opt) => opt.label.toLowerCase().includes(q));
});

const { activeIndex, setActive, onKeydown: onListKeydown } = useListNavigation(
    () => filtered.value.length,
    {
        close: () => close(),
        select: (index) => {
            const opt = filtered.value[index];
            if (opt) {
                selectOption(opt);
            }
        },
    },
);

const showClear = computed(() => props.clearable && props.modelValue !== '');

// `pr-10` only while the ✕ is there: padding held unconditionally would
// indent every non-clearable Combobox against the Input atom it sits beside.
const classes = computed(() =>
    cx(formControlClasses(props.invalid, showClear.value ? 'pl-3.5 pr-10 h-11' : 'px-3.5 h-11')),
);

function close(): void {
    open.value = false;
    setActive(-1);
}

function clearValue(): void {
    emit('update:modelValue', '');
    setActive(-1);
    // The ✕ unmounts with the value it cleared; without a handoff, focus falls
    // to <body> and a keyboard user starts over from the page top. Focusing the
    // field also matches what clearing is FOR — entering something else — and
    // leaves the list open, which is what focus does here anyway.
    field.value?.focus();
    open.value = true;
}

function selectOption(opt: SelectOption<T>): void {
    emit('update:modelValue', opt.label);
    emit('select', opt);
    close();
}

function onInput(event: Event): void {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
    open.value = true;
    setActive(filtered.value.length > 0 ? 0 : -1);
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !open.value) {
        event.preventDefault();
        open.value = true;
        setActive(filtered.value.length > 0 ? 0 : -1);
        return;
    }
    onListKeydown(event);
}

useClickOutside(root, close, open);
</script>

<template>
  <div
    ref="root"
    class="relative"
  >
    <input
      :id="name ?? undefined"
      ref="field"
      type="text"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="listId"
      :aria-activedescendant="activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined"
      :name="name ?? undefined"
      :value="modelValue"
      :placeholder="placeholder ?? undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      autocomplete="off"
      data-1p-ignore
      data-lpignore="true"
      :class="classes"
      @input="onInput"
      @keydown="onKeydown"
      @focus="open = true"
    >

    <!-- Sibling of the field, not a child: an <input> is void and cannot
         contain anything. Absolutely positioned into its right end, full
         control height, so the hit area is 28px × the control. `mousedown` is
         prevented so the click does not blur the field on its way in — the
         blur would land before the click and the handoff below would fight
         it. -->
    <button
      v-if="showClear"
      type="button"
      :aria-label="clearLabel"
      class="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted transition hover:text-ink"
      @mousedown.prevent
      @click="clearValue"
    >
      <Icon
        name="x"
        size="sm"
        class="size-3.5 shrink-0"
      />
    </button>

    <ul
      v-if="open && (filtered.length > 0 || emptyMessage !== null)"
      :id="listId"
      role="listbox"
      class="absolute left-0 right-0 z-30 mt-1 max-h-56 overflow-y-auto rounded-surface border border-line bg-surface py-1 shadow-lg shadow-ink/5"
    >
      <li
        v-for="(opt, index) in filtered"
        :id="`${listId}-${index}`"
        :key="opt.value"
        role="option"
        :aria-selected="index === activeIndex"
        class="flex cursor-pointer items-center px-3 py-1.5 text-sm transition"
        :class="index === activeIndex ? 'bg-surface-2 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'"
        @mouseenter="setActive(index)"
        @mousedown.prevent="selectOption(opt)"
      >
        <span class="truncate">{{ opt.label }}</span>
      </li>
      <li
        v-if="filtered.length === 0 && emptyMessage !== null"
        class="px-3 py-2 text-sm text-muted"
      >
        {{ emptyMessage }}
      </li>
    </ul>
  </div>
</template>
