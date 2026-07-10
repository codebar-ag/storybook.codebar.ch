<script setup lang="ts">
// Side panel over a scrim — Modal's sibling for flows that need more room or
// list/detail context. v-model-driven like Modal; Escape, scrim click and the
// close button all request a close. Focus is trapped while open and page
// scrolling is locked.
import { computed, ref, useId } from 'vue';
import { useEscapeKey } from '../../composables/useEscapeKey';
import { useFocusTrap } from '../../composables/useFocusTrap';
import { useScrollLock } from '../../composables/useScrollLock';

const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        title?: string | null;
        description?: string | null;
        side?: 'right' | 'left';
        // Width utility class for the panel.
        width?: string;
        closeOnBackdrop?: boolean;
    }>(),
    {
        modelValue: false,
        title: null,
        description: null,
        side: 'right',
        width: 'max-w-md',
        closeOnBackdrop: true,
    },
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
useFocusTrap(panel, open);
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50"
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
          :class="[
            'absolute inset-y-0 flex w-full flex-col border-line bg-surface shadow-card-hover focus:outline-none',
            width,
            side === 'right' ? 'right-0 border-l drawer-panel-right' : 'left-0 border-r drawer-panel-left',
          ]"
        >
          <div
            v-if="title !== null || $slots.header"
            class="flex items-start justify-between gap-4 border-b border-line px-5 py-4"
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

          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
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
.drawer-enter-active,
.drawer-leave-active {
    transition: opacity 0.15s ease;
}
.drawer-enter-active .drawer-panel-right,
.drawer-leave-active .drawer-panel-right,
.drawer-enter-active .drawer-panel-left,
.drawer-leave-active .drawer-panel-left {
    transition: transform 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
}
.drawer-enter-from .drawer-panel-right,
.drawer-leave-to .drawer-panel-right {
    transform: translateX(1.5rem);
}
.drawer-enter-from .drawer-panel-left,
.drawer-leave-to .drawer-panel-left {
    transform: translateX(-1.5rem);
}
</style>
