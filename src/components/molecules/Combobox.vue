<script setup lang="ts">
// Free-text input with filtered suggestions (ARIA combobox). Unlike
// SearchableSelect — which picks from a closed set — the typed text IS the
// value; suggestions are shortcuts. Built on the same useListNavigation core.
import { computed, ref } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useClickOutside } from '../../composables/useClickOutside';
import { useFieldA11y } from '../../composables/useFieldA11y';
import { useListNavigation } from '../../composables/useListNavigation';
import type { SelectOption } from '../atoms/Select.vue';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        options?: SelectOption[];
        name?: string | null;
        placeholder?: string | null;
        invalid?: boolean;
        emptyMessage?: string | null;
    }>(),
    {
        modelValue: '',
        options: () => [],
        name: null,
        placeholder: null,
        invalid: false,
        emptyMessage: null,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    select: [option: SelectOption];
}>();

const { describedBy } = useFieldA11y(props);

const root = ref<HTMLElement | null>(null);
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

const classes = computed(() => cx(formControlClasses(props.invalid, 'px-3.5 h-11')));

function close(): void {
    open.value = false;
    setActive(-1);
}

function selectOption(opt: SelectOption): void {
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
      @focus="open = filtered.length > 0"
    >

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
