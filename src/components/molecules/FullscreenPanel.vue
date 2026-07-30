<script setup lang="ts">
// Wraps a section and lets it expand to cover the whole viewport. Exposes
// { isFullscreen, toggle } as slot props so the caller keeps its own toolbar
// (save/versions/badges) visible while fullscreen. Escape exits; scrolling
// behind the panel is locked while open.
import { ref } from 'vue';
import { useEscapeKey } from '../../composables/useEscapeKey';
import { useScrollLock } from '../../composables/useScrollLock';

const isFullscreen = ref(false);

function toggle(): void {
    isFullscreen.value = !isFullscreen.value;
}

// Capture phase + stopPropagation: a CodeMirror editor inside the default
// slot binds its own Escape handling in the bubble phase, so this has to
// win the race to actually exit fullscreen instead of the editor eating it.
useEscapeKey(
    (event) => {
        event.stopPropagation();
        isFullscreen.value = false;
    },
    isFullscreen,
    { capture: true },
);

useScrollLock(isFullscreen);
</script>

<template>
  <div :class="isFullscreen ? 'fixed inset-0 z-50 flex flex-col overflow-hidden bg-bg p-4' : ''">
    <slot
      :is-fullscreen="isFullscreen"
      :toggle="toggle"
    />
  </div>
</template>
