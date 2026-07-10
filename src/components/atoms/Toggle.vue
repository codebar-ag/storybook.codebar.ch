<script setup lang="ts">
import { computed } from 'vue';

// An on/off switch. Mirrors the native-checkbox accessibility of Checkbox.vue
// but renders the PlanetScale-style pill so boolean settings read as toggles.
const props = withDefaults(
    defineProps<{
        modelValue?: boolean;
        name?: string | null;
        disabled?: boolean;
        label?: string | null;
        description?: string | null;
    }>(),
    { modelValue: false, name: null, disabled: false, label: null, description: null },
);

defineEmits<{ 'update:modelValue': [value: boolean] }>();

const trackClasses = computed(
    () =>
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ' +
        (props.modelValue ? 'bg-ink' : 'bg-line-2'),
);

const knobClasses = computed(
    () =>
        'inline-block h-4 w-4 transform rounded-full bg-white shadow transition ' +
        (props.modelValue ? 'translate-x-4' : 'translate-x-0.5'),
);
</script>

<template>
  <label
    class="flex items-start gap-3 min-h-11 py-1.5 cursor-pointer select-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
  >
    <span class="mt-0.5">
      <input
        type="checkbox"
        class="peer sr-only"
        :name="name ?? undefined"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      >
      <span :class="[trackClasses, 'peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50']">
        <span :class="knobClasses" />
      </span>
    </span>
    <span
      v-if="label !== null || description !== null || $slots.default"
      class="min-w-0"
    >
      <span class="block text-sm text-ink leading-relaxed"><slot>{{ label }}</slot></span>
      <span
        v-if="description !== null"
        class="block text-xs text-muted mt-0.5 leading-relaxed"
      >{{ description }}</span>
    </span>
  </label>
</template>
