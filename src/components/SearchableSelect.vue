<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { formControlClasses } from '../helpers/formControlClasses';
import Icon from './Icon.vue';
import Input from './Input.vue';
import type { SelectOption } from './Select.vue';

const props = withDefaults(
    defineProps<{
        modelValue?: string | number | null;
        options?: SelectOption[];
        placeholder?: string;
        searchPlaceholder?: string;
        emptyMessage?: string;
    }>(),
    {
        modelValue: null,
        options: () => [],
        placeholder: 'Choose…',
        searchPlaceholder: 'Search…',
        emptyMessage: 'No results',
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>();

const open = ref(false);
const query = ref('');
const activeIndex = ref(-1);
const root = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
    const match = props.options.find((opt) => String(opt.value) === String(props.modelValue));
    return match?.label ?? null;
});

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) {
        return props.options;
    }
    return props.options.filter((opt) => opt.label.toLowerCase().includes(q));
});

const triggerClasses = computed(() =>
    formControlClasses(false, 'flex items-center justify-between gap-2 px-3 min-h-9 text-sm font-medium text-left cursor-pointer hover:border-line-2'),
);

function openMenu() {
    open.value = true;
    activeIndex.value = filtered.value.findIndex((opt) => String(opt.value) === String(props.modelValue));
    void nextTick(() => {
        const el = root.value?.querySelector('input');
        el?.focus();
    });
}

function closeMenu() {
    open.value = false;
    query.value = '';
    activeIndex.value = -1;
}

function selectOption(opt: SelectOption) {
    emit('update:modelValue', opt.value);
    closeMenu();
}

function onTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!open.value) {
            openMenu();
        }
    }
}

function onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (filtered.value.length === 0) {
            return;
        }
        activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1);
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (filtered.value.length === 0) {
            return;
        }
        activeIndex.value = Math.max(activeIndex.value - 1, 0);
        return;
    }

    if (event.key === 'Enter' && activeIndex.value >= 0) {
        event.preventDefault();
        const opt = filtered.value[activeIndex.value];
        if (opt) {
            selectOption(opt);
        }
    }
}

function onDocumentClick(event: MouseEvent) {
    if (!open.value || !root.value) {
        return;
    }
    if (!root.value.contains(event.target as Node)) {
        closeMenu();
    }
}

watch(open, (isOpen) => {
    if (isOpen) {
        document.addEventListener('mousedown', onDocumentClick);
    } else {
        document.removeEventListener('mousedown', onDocumentClick);
    }
});

watch(query, () => {
    activeIndex.value = filtered.value.length > 0 ? 0 : -1;
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocumentClick);
});
</script>

<template>
  <div
    ref="root"
    class="relative w-full"
  >
    <button
      type="button"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :class="triggerClasses"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onTriggerKeydown"
    >
      <span
        class="truncate"
        :class="selectedLabel ? 'text-ink' : 'text-muted'"
      >{{ selectedLabel ?? placeholder }}</span>
      <Icon
        name="chevron-down"
        size="sm"
        class="size-3.5 shrink-0 text-muted"
      />
    </button>

    <div
      v-if="open"
      class="absolute left-0 right-0 z-30 mt-1 rounded-surface border border-line bg-surface shadow-lg shadow-ink/5"
    >
      <div class="border-b border-line p-2">
        <Input
          v-model="query"
          type="search"
          :placeholder="searchPlaceholder"
          @keydown="onSearchKeydown"
        />
      </div>

      <ul
        role="listbox"
        class="max-h-56 overflow-y-auto py-1"
      >
        <li
          v-for="(opt, index) in filtered"
          :key="opt.value"
          role="option"
          :aria-selected="String(opt.value) === String(modelValue)"
          class="flex cursor-pointer items-center px-3 py-1.5 text-sm transition"
          :class="[
            index === activeIndex || String(opt.value) === String(modelValue)
              ? 'bg-surface-2 text-ink'
              : 'text-muted hover:bg-surface-2 hover:text-ink',
          ]"
          @mouseenter="activeIndex = index"
          @click="selectOption(opt)"
        >
          <span class="truncate">{{ opt.label }}</span>
        </li>
        <li
          v-if="filtered.length === 0"
          class="px-3 py-2 text-sm text-muted"
        >
          {{ emptyMessage }}
        </li>
      </ul>

      <div
        v-if="$slots.footer"
        class="border-t border-line p-1"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
