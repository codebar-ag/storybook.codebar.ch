<script setup lang="ts">
import { useSlots } from 'vue';

// Semantic data table for true multi-column data grids. For simple stacked
// lists prefer ListRow. Slots: `head` (a series of <Th>), default (body <TableRow>s).
const slots = useSlots();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm">
      <thead v-if="slots.head">
        <tr
          class="border-b border-line text-2xs uppercase tracking-wider text-dim [&>th]:px-4 [&>th]:py-2.5 [&>th]:font-medium"
        >
          <slot name="head" />
        </tr>
      </thead>

      <tbody
        class="[&>tr]:border-t [&>tr]:border-line [&>tr:first-child]:border-t-0 [&_td]:px-4 [&_td]:py-3"
      >
        <slot />
      </tbody>
    </table>
  </div>
</template>
