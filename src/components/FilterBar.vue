<script setup lang="ts">
import Card from './Card.vue';

// Card-wrapped filter shell: controls go in the default slot, an optional reset/clear
// action in the `#reset` slot. Stacks on mobile, aligns to a row at `sm`. The reset
// column only renders when the slot is filled.
</script>

<template>
  <Card>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div class="flex-1">
        <slot />
      </div>
      <div
        v-if="$slots.reset"
        class="flex items-center gap-2"
      >
        <slot name="reset" />
      </div>
    </div>
  </Card>
</template>
