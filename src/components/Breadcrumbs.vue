<script setup lang="ts">
// Generic breadcrumb trail. Renders a plain <a> for interior crumbs by
// default so it works with no framework dependency; pass `as` (e.g.
// Inertia's `Link`) for SPA navigation instead. The last crumb is always
// static text, de-emphasized and marked aria-current="page".
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

withDefaults(
    defineProps<{
        items?: BreadcrumbItem[];
        as?: string | object;
    }>(),
    { items: () => [], as: 'a' },
);
</script>

<template>
  <nav
    v-if="items.length"
    aria-label="Breadcrumb"
  >
    <ol class="flex flex-wrap items-center gap-1.5 text-xs text-muted">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex min-w-0 items-center gap-1.5"
      >
        <component
          :is="as"
          v-if="index < items.length - 1 && item.href"
          :href="item.href"
          class="truncate rounded transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >{{ item.label }}</component>
        <span
          v-else
          :aria-current="index === items.length - 1 ? 'page' : undefined"
          class="truncate"
          :class="index === items.length - 1 ? 'text-dim' : ''"
        >{{ item.label }}</span>
        <span
          v-if="index < items.length - 1"
          aria-hidden="true"
          class="text-dim"
        >/</span>
      </li>
    </ol>
  </nav>
</template>
