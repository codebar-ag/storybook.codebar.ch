<script setup lang="ts">
export interface RadioGroupProps { label?: string | null }

withDefaults(defineProps<RadioGroupProps>(), { label: null });
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
