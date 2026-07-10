<script setup lang="ts">
// A right-aligned table cell for numeric columns. Renders <th> in a header row
// (pass :head="true") and <td> otherwise, with tabular-nums so digits align.
withDefaults(defineProps<{ head?: boolean }>(), { head: false });
</script>

<template>
  <th
    v-if="head"
    class="text-right"
  >
    <slot />
  </th>
  <td
    v-else
    class="text-right tabular-nums"
  >
    <slot />
  </td>
</template>
