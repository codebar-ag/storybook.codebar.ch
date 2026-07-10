<script setup lang="ts">
// Application frame: fixed sidebar (≥lg) + navbar + scrolling main region.
// Below lg the #sidebar slot renders inside a Drawer, opened by the navbar's
// menu button (Navbar emits toggle-sidebar; the shell wires it up via the
// scoped `toggleSidebar` slot prop).
//
//     <AppShell>
//         <template #sidebar><Sidebar>…</Sidebar></template>
//         <template #navbar="{ toggleSidebar }">
//             <Navbar @toggle-sidebar="toggleSidebar">…</Navbar>
//         </template>
//         <main content…>
//     </AppShell>
import { ref } from 'vue';
import Drawer from '../organisms/Drawer.vue';

const sidebarOpen = ref(false);

function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
}
</script>

<template>
  <div class="flex min-h-dvh bg-bg text-ink">
    <aside
      v-if="$slots.sidebar"
      class="sticky top-0 hidden h-dvh shrink-0 lg:block"
    >
      <slot name="sidebar" />
    </aside>

    <Drawer
      v-if="$slots.sidebar"
      v-model="sidebarOpen"
      side="left"
      width="max-w-64"
      title="Navigation"
    >
      <div class="-mx-5 -my-4">
        <slot name="sidebar" />
      </div>
    </Drawer>

    <div class="flex min-w-0 flex-1 flex-col">
      <slot
        name="navbar"
        :toggle-sidebar="toggleSidebar"
      />

      <main class="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <slot />
      </main>
    </div>
  </div>
</template>
