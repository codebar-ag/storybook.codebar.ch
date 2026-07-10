<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useEscapeKey } from '../../composables/useEscapeKey';
import { useFocusTrap } from '../../composables/useFocusTrap';
import { useScrollLock } from '../../composables/useScrollLock';

// Centered dialog with a scrim. Open state is v-model-driven so callers keep
// ownership of visibility. Escape and backdrop clicks request a close. While
// open, focus is trapped in the panel and page scrolling is locked; focus
// returns to the previously focused element on close.
const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        title?: string | null;
        description?: string | null;
        closeOnBackdrop?: boolean;
        // CSS selector (scoped to the panel) for the element to focus on open,
        // e.g. 'input[name=email]'. Defaults to the first focusable element.
        initialFocus?: string | null;
    }>(),
    { modelValue: false, title: null, description: null, closeOnBackdrop: true, initialFocus: null },
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const panel = ref<HTMLElement | null>(null);
const titleId = useId();
const open = computed(() => props.modelValue);

function close(): void {
    emit('update:modelValue', false);
}

useEscapeKey(close, open);
useScrollLock(open);
useFocusTrap(panel, open, {
    initialFocus: () =>
        props.initialFocus ? panel.value?.querySelector<HTMLElement>(props.initialFocus) ?? null : null,
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title !== null ? titleId : undefined"
      >
        <div
          class="absolute inset-0 bg-ink/40"
          @click="closeOnBackdrop && close()"
        />
        <div
          ref="panel"
          tabindex="-1"
          class="relative z-10 w-full max-w-lg rounded-surface border border-line bg-surface shadow-card-hover focus:outline-none"
        >
          <div
            v-if="title !== null || $slots.header"
            :class="['flex items-start justify-between gap-4 px-5 py-4', { 'border-b border-line': $slots.default }]"
          >
            <div class="min-w-0">
              <slot name="header">
                <h2
                  :id="titleId"
                  class="text-lg font-semibold text-ink"
                >
                  {{ title }}
                </h2>
                <p
                  v-if="description !== null"
                  class="mt-1 text-sm text-muted"
                >
                  {{ description }}
                </p>
              </slot>
            </div>
            <button
              type="button"
              class="text-muted hover:text-ink"
              aria-label="Close"
              @click="close"
            >
              &times;
            </button>
          </div>
          <div
            v-if="$slots.default"
            class="px-5 py-4"
          >
            <slot />
          </div>
          <div
            v-if="$slots.footer"
            class="border-t border-line px-5 py-4"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
