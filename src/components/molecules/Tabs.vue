<script setup lang="ts">
// In-page tab switcher (ARIA tabs pattern): roving tabindex, ArrowLeft/Right/
// Home/End, panels via named slots keyed by tab key. For URL-driven page
// navigation keep using the standalone `Tab` link pill instead.
//
//     <Tabs v-model="active" :tabs="[{ key: 'general', label: 'General' }, …]">
//         <template #general>…</template>
//     </Tabs>
//
// `#aside` renders beside the tab list (right-aligned, wraps below on narrow
// screens) for context that belongs to the tabs, such as a running total.
import { ref, useId } from 'vue';
import { useControllable } from '../../composables/useControllable';
import { segmentedTrackClasses, tabCountClasses } from '../../helpers/segmented';

export interface TabItem {
    key: string;
    label: string;
    disabled?: boolean;
    /** A number after the label, e.g. the items in that panel. */
    count?: number | null;
}

export interface TabsProps {
    tabs: readonly TabItem[];
    modelValue?: string;
}

const props = withDefaults(
    defineProps<TabsProps>(),
    { modelValue: undefined },
);

const emit = defineEmits<{ 'update:modelValue': [key: string] }>();

const active = useControllable(
    () => props.modelValue,
    (value) => emit('update:modelValue', value),
    props.tabs[0]?.key ?? '',
);

const baseId = useId();
const buttons = ref<HTMLButtonElement[]>([]);

function setButtonRef(el: unknown, index: number): void {
    if (el) {
        buttons.value[index] = el as HTMLButtonElement;
    }
}

function enabledIndexes(): number[] {
    return props.tabs.flatMap((tab, index) => (tab.disabled ? [] : [index]));
}

function activate(index: number): void {
    const tab = props.tabs[index];
    if (tab && !tab.disabled) {
        active.value = tab.key;
        buttons.value[index]?.focus();
    }
}

function onKeydown(index: number, event: KeyboardEvent): void {
    const enabled = enabledIndexes();
    const position = enabled.indexOf(index);
    if (position === -1) {
        return;
    }

    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            activate(enabled[(position + 1) % enabled.length]);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            activate(enabled[(position - 1 + enabled.length) % enabled.length]);
            break;
        case 'Home':
            event.preventDefault();
            activate(enabled[0]);
            break;
        case 'End':
            event.preventDefault();
            activate(enabled[enabled.length - 1]);
            break;
    }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div
        role="tablist"
        data-slot="tabs"
        :class="segmentedTrackClasses"
      >
        <button
          v-for="(tab, index) in tabs"
          :id="`${baseId}-tab-${tab.key}`"
          :key="tab.key"
          :ref="(el) => setButtonRef(el, index)"
          type="button"
          role="tab"
          data-slot="tab"
          :data-state="active === tab.key ? 'active' : undefined"
          :aria-selected="active === tab.key ? 'true' : 'false'"
          :aria-controls="`${baseId}-panel-${tab.key}`"
          :tabindex="active === tab.key ? 0 : -1"
          :disabled="tab.disabled"
          :class="[
            'relative inline-flex items-center justify-center min-h-11 whitespace-nowrap rounded-pill px-3.5 py-1 text-sm font-medium transition cursor-pointer',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-focus/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            active === tab.key ? 'bg-surface text-tab-active-fg shadow-card after:pointer-events-none after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:bg-tab-active-marker' : 'text-muted hover:text-ink',
          ]"
          @click="active = tab.key"
          @keydown="onKeydown(index, $event)"
        >
          {{ tab.label }}
          <span
            v-if="tab.count !== undefined && tab.count !== null"
            :class="tabCountClasses"
          >{{ tab.count }}</span>
        </button>
      </div>
      <div
        v-if="$slots.aside"
        class="text-sm text-muted"
      >
        <slot name="aside" />
      </div>
    </div>

    <div
      v-for="tab in tabs"
      v-show="active === tab.key"
      :id="`${baseId}-panel-${tab.key}`"
      :key="tab.key"
      role="tabpanel"
      :aria-labelledby="`${baseId}-tab-${tab.key}`"
      class="pt-4 focus:outline-none"
      tabindex="0"
    >
      <slot :name="tab.key" />
    </div>
  </div>
</template>
