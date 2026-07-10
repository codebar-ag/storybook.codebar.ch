<script setup lang="ts">
withDefaults(defineProps<{ label?: string | null }>(), { label: null });
</script>

<template>
  <fieldset class="space-y-3">
    <legend
      v-if="label !== null"
      class="sr-only"
    >
      {{ label }}
    </legend>
    <slot />
  </fieldset>
</template>
