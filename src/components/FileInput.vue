<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        name?: string | null;
        invalid?: boolean;
    }>(),
    { name: null, invalid: false },
);

defineEmits<{ change: [files: FileList | null] }>();

const describedBy = computed(() =>
    props.invalid && props.name ? `${props.name}-error` : undefined,
);
const classes = computed(
    () =>
        'block w-full text-sm transition cursor-pointer ' +
        'file:mr-4 file:rounded-control file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-white file:cursor-pointer ' +
        'hover:file:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ' +
        (props.invalid ? 'text-danger' : 'text-muted'),
);
</script>

<template>
  <input
    :id="name ?? undefined"
    type="file"
    :name="name ?? undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="classes"
    @change="$emit('change', ($event.target as HTMLInputElement).files)"
  >
</template>
