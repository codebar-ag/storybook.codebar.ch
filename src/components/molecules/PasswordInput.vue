<script setup lang="ts">
// Password field with a visibility toggle. Wraps Input so sizing, invalid
// state and Field wiring stay identical to every other control.
import { computed, ref } from 'vue';
import Icon from '../atoms/Icon.vue';
import Input from '../atoms/Input.vue';

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        name?: string | null;
        invalid?: boolean;
    }>(),
    { modelValue: '', name: null, invalid: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const revealed = ref(false);
const type = computed(() => (revealed.value ? 'text' : 'password'));

const model = computed({
    get: () => props.modelValue,
    set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="relative">
    <Input
      v-model="model"
      :type="type"
      :name="name"
      :invalid="invalid"
      autocomplete="current-password"
      class="pr-11"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-dim transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-r-control"
      :aria-pressed="revealed ? 'true' : 'false'"
      :aria-label="revealed ? 'Hide password' : 'Show password'"
      @click="revealed = !revealed"
    >
      <Icon
        :name="revealed ? 'eye-slash' : 'eye'"
        size="sm"
      />
    </button>
  </div>
</template>
