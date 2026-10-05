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
//
// `offsetTop` (a CSS length, e.g. "2.5rem") starts the sticky sidebar below a
// full-width bar the app renders above the shell (an impersonation or
// maintenance banner), so the bar does not cover the sidebar's top.
import { computed, ref } from 'vue';
import Drawer from '../organisms/Drawer.vue';

export interface AppShellProps {
    offsetTop?: string | null;
}

const props = withDefaults(defineProps<AppShellProps>(), { offsetTop: null });

const asideStyle = computed(() =>
    props.offsetTop === null ? undefined : { top: props.offsetTop, height: `calc(100dvh - ${props.offsetTop})` },
);

const sidebarOpen = ref(false);

function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
}

// Following a link in the drawer closes it. With a persistent layout (an SPA
// whose shell stays mounted across visits) nothing else would: the drawer
// stayed open over the page it had just navigated to.
function closeOnNavigate(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('a[href]')) {
        sidebarOpen.value = false;
    }
}
</script>

<template>
  <div class="flex min-h-dvh bg-bg text-ink">
    <aside
      v-if="$slots.sidebar"
      class="sticky top-0 hidden h-dvh shrink-0 lg:block"
      :style="asideStyle"
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
      <div
        class="-mx-5 -my-4"
        @click="closeOnNavigate"
      >
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
