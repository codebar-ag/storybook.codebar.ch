<script setup lang="ts">
withDefaults(
    defineProps<{
        for?: string | null;
        required?: boolean;
    }>(),
    { for: null, required: false },
);
</script>

<template>
  <label
    :for="$props.for ?? undefined"
    class="block text-sm font-medium text-muted"
  >
    <slot />
    <span
      v-if="required"
      class="text-danger ml-0.5"
      aria-hidden="true"
    >*</span>
  </label>
</template>
