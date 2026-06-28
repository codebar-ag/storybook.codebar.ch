<script setup lang="ts">
// A gapped grid of Metric tiles. The hairline gap (gap-px on bg-line) gives the
// tiles their dividers.
</script>

<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-control overflow-hidden"
  >
    <slot />
  </div>
</template>
