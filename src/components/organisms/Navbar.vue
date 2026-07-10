<script setup lang="ts">
// Top app bar: brand (mobile), centered content and trailing actions.
// The menu button only shows below lg and asks the shell to open the sidebar.
import Icon from '../atoms/Icon.vue';

withDefaults(
    defineProps<{
        // Hide the mobile menu button when the page has no sidebar.
        menuButton?: boolean;
    }>(),
    { menuButton: true },
);

defineEmits<{ 'toggle-sidebar': [] }>();
</script>

<template>
  <header class="flex min-h-14 items-center gap-3 border-b border-line bg-surface px-4">
    <button
      v-if="menuButton"
      type="button"
      class="flex size-9 items-center justify-center rounded-control text-muted transition hover:text-ink lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      aria-label="Open navigation"
      @click="$emit('toggle-sidebar')"
    >
      <Icon
        name="menu"
        size="md"
      />
    </button>

    <div
      v-if="$slots.brand"
      class="flex items-center lg:hidden"
    >
      <slot name="brand" />
    </div>

    <div class="min-w-0 flex-1">
      <slot />
    </div>

    <div
      v-if="$slots.actions"
      class="flex shrink-0 items-center gap-2"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
