<script setup lang="ts">
// App navigation rail. Composes SidebarGroup/SidebarItem in the default slot;
// brand and footer slots frame it. AppShell handles the responsive collapse.
withDefaults(
    defineProps<{
        label?: string;
    }>(),
    { label: 'Main navigation' },
);
</script>

<template>
  <nav
    :aria-label="label"
    class="flex h-full w-60 flex-col border-r border-line bg-surface"
  >
    <div
      v-if="$slots.brand"
      class="flex min-h-14 items-center border-b border-line px-4"
    >
      <slot name="brand" />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-2 py-3">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="border-t border-line px-2 py-3"
    >
      <slot name="footer" />
    </div>
  </nav>
</template>
