<script setup lang="ts">
// Menu disclosure with full keyboard support: Enter/Space toggles, Arrow keys
// move through items (Down on the trigger opens + focuses the first item,
// Up the last), Home/End jump, Escape closes and returns focus to the
// trigger, clicking outside closes. Open state is internal by default;
// bind `v-model:open` to control it.
//
// Migration note (v1.3): the root element changed from <details>/<summary>
// to <div><button aria-haspopup="menu">. Props and slots are unchanged, but
// any consumer CSS targeting `details`/`summary` must move to the new DOM.
import { computed, nextTick, ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';
import { useControllable } from '../../composables/useControllable';
import { useEscapeKey } from '../../composables/useEscapeKey';

const props = withDefaults(
    defineProps<{
        align?: 'left' | 'right';
        // Width utility class for the menu panel, e.g. `w-80` for wider menus.
        width?: string;
        // Optional v-model:open; leave unbound for internal state.
        open?: boolean;
    }>(),
    { align: 'right', width: 'w-56', open: undefined },
);

const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const isOpen = useControllable(
    () => props.open,
    (value) => emit('update:open', value),
    false,
);

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLElement | null>(null);

const menuAlign = computed(() => (props.align === 'left' ? 'left-0' : 'right-0'));

const triggerBase =
    'inline-flex items-center gap-1.5 rounded-control transition cursor-pointer ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/50';

function menuItems(): HTMLElement[] {
    return Array.from(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
}

function focusItem(index: number): void {
    const items = menuItems();
    if (items.length === 0) {
        return;
    }
    const clamped = ((index % items.length) + items.length) % items.length;
    items[clamped].focus();
}

function openMenu(focusIndex: number | null = null): void {
    isOpen.value = true;
    if (focusIndex !== null) {
        void nextTick(() => focusItem(focusIndex));
    }
}

function closeMenu(returnFocus = true): void {
    if (!isOpen.value) {
        return;
    }
    isOpen.value = false;
    if (returnFocus) {
        trigger.value?.focus();
    }
}

function onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        openMenu(0);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu(-1);
    }
}

function onMenuKeydown(event: KeyboardEvent): void {
    const items = menuItems();
    const current = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            focusItem(current + 1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            focusItem(current - 1);
            break;
        case 'Home':
            event.preventDefault();
            focusItem(0);
            break;
        case 'End':
            event.preventDefault();
            focusItem(items.length - 1);
            break;
        case 'Tab':
            // Let focus move on naturally, but don't leave the menu hanging open.
            closeMenu(false);
            break;
    }
}

function onMenuClick(event: MouseEvent): void {
    // Activating an item performs its action (navigate/submit/emit) — the
    // menu's job is done. Focus is not forced back so navigation stays clean.
    if ((event.target as HTMLElement).closest('[role="menuitem"]')) {
        closeMenu(false);
    }
}

useClickOutside(root, () => closeMenu(false), isOpen);
useEscapeKey(() => closeMenu(), isOpen);
</script>

<template>
  <div
    ref="root"
    class="relative inline-block"
  >
    <button
      ref="trigger"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :class="triggerBase"
      @click="isOpen ? closeMenu() : openMenu()"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger" />
    </button>

    <div
      v-if="isOpen"
      ref="menu"
      role="menu"
      :class="[
        'absolute mt-2 max-w-[calc(100vw-1rem)] origin-top rounded-surface bg-surface border border-line shadow-lg shadow-ink/5 focus:outline-none z-30',
        width,
        menuAlign,
      ]"
      @click="onMenuClick"
      @keydown="onMenuKeydown"
    >
      <div class="py-1">
        <slot />
      </div>
    </div>
  </div>
</template>
