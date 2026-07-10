<script setup lang="ts">
import Label from './Label.vue';

withDefaults(
    defineProps<{
        label?: string | null;
        name?: string | null;
        hint?: string | null;
        required?: boolean;
        // In the Blade original this fell back to Laravel's $errors bag; under
        // Inertia the consuming form passes the message in explicitly.
        error?: string | null;
    }>(),
    { label: null, name: null, hint: null, required: false, error: null },
);
</script>

<template>
  <div class="space-y-1.5">
    <Label
      v-if="label !== null"
      :for="name"
      :required="required"
    >{{ label }}</Label>

    <slot />

    <p
      v-if="hint !== null && error === null"
      :id="name ? `${name}-hint` : undefined"
      class="text-2xs text-dim"
    >
      {{ hint }}
    </p>

    <p
      v-if="error !== null"
      :id="name ? `${name}-error` : undefined"
      role="alert"
      class="text-xs text-danger"
    >
      {{ error }}
    </p>
  </div>
</template>
