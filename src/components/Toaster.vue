<script setup lang="ts">
import { useToast, type ToastType, type Toast } from '../composables/useToast';
import type { IconName } from '../icons';
import Icon from './Icon.vue';

// Unified toast overlay. Mount once near the app root; producers call `push()`
// from the useToast composable (copy buttons, Inertia flash bridging, etc.).
const { toasts, dismiss, pause, resume } = useToast();

const iconFor: Record<ToastType, IconName> = {
    success: 'check',
    error: 'x',
    warning: 'warning',
    info: 'info',
};

const styleFor: Record<ToastType, string> = {
    success: 'bg-success-soft border-success-line text-success',
    error: 'bg-danger-soft border-danger-line text-danger',
    warning: 'bg-warning-soft border-warning-line text-warning',
    info: 'bg-accent/5 border-accent/20 text-ink',
};
</script>

<template>
  <div
    aria-live="polite"
    aria-atomic="true"
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none"
  >
    <TransitionGroup
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-for="t in (toasts as Toast[])"
        v-show="t.show"
        :key="t.id"
        :class="[
          'pointer-events-auto w-full flex items-start gap-2.5 rounded-control border px-3.5 py-2.5 text-sm shadow-lg',
          styleFor[t.type],
        ]"
        role="status"
        @mouseenter="pause(t)"
        @mouseleave="resume(t)"
      >
        <span class="mt-px shrink-0"><Icon
          :name="iconFor[t.type]"
          size="sm"
        /></span>
        <span class="flex-1 break-words">{{ t.message }}</span>
        <button
          type="button"
          class="shrink-0 -mr-2 -my-1.5 flex items-center justify-center min-h-11 min-w-11 leading-none opacity-50 hover:opacity-100 transition"
          aria-label="Dismiss"
          @click="dismiss(t.id)"
        >
          <Icon
            name="x"
            size="sm"
            class="size-3.5"
          />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
