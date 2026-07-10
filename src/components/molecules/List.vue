<script setup lang="ts">
// Dash-bulleted list. Single source of the en-dash bullet treatment used in
// setup instructions and callouts.
const classes =
    "space-y-1.5 [&_li]:relative [&_li]:pl-4 [&_li]:before:content-['–'] " +
    '[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-dim';
</script>

<template>
  <ul :class="classes">
    <slot />
  </ul>
</template>
