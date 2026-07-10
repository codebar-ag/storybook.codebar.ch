<script setup lang="ts">
// Header cell. Plain passthrough by default; `sortable` turns it into a
// sort button carrying aria-sort (used by DataTable, usable standalone).
import Icon from './Icon.vue';

withDefaults(
    defineProps<{
        sortable?: boolean;
        sortDir?: 'asc' | 'desc' | null;
        align?: 'left' | 'right';
    }>(),
    { sortable: false, sortDir: null, align: 'left' },
);

defineEmits<{ sort: [] }>();
</script>

<template>
  <th
    v-if="!sortable"
    :class="align === 'right' ? 'text-right' : undefined"
  >
    <slot />
  </th>
  <th
    v-else
    :aria-sort="sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'"
    :class="align === 'right' ? 'text-right' : undefined"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1 uppercase tracking-wider cursor-pointer transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-xs"
      @click="$emit('sort')"
    >
      <slot />
      <Icon
        name="chevron-up"
        size="sm"
        :class="[
          'size-3 shrink-0 transition-transform',
          sortDir === null ? 'opacity-0' : '',
          sortDir === 'desc' ? 'rotate-180' : '',
        ]"
      />
    </button>
  </th>
</template>
