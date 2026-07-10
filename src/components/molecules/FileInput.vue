<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../helpers/cx';
import { formControlClasses } from '../../helpers/formControlClasses';
import { useFieldA11y } from '../../composables/useFieldA11y';

const props = withDefaults(
    defineProps<{
        // File inputs are write-only: the browser owns the selection, so the
        // model only flows outward (input → caller), never back in.
        modelValue?: File[] | null;
        name?: string | null;
        invalid?: boolean;
    }>(),
    { modelValue: null, name: null, invalid: false },
);

const emit = defineEmits<{
    'update:modelValue': [files: File[]];
    change: [files: FileList | null];
}>();

const { describedBy } = useFieldA11y(props);

const classes = computed(() =>
    cx(
        formControlClasses(props.invalid, 'px-2 py-1.5 cursor-pointer'),
        'text-sm file:mr-3 file:rounded-control file:border-0 file:bg-ink file:px-3.5 file:py-1.5 file:text-sm file:text-white file:cursor-pointer',
        'hover:file:opacity-90',
        props.invalid ? 'text-danger' : 'text-muted',
    ),
);

function onChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    emit('change', files);
    emit('update:modelValue', files ? Array.from(files) : []);
}
</script>

<template>
  <input
    :id="name ?? undefined"
    type="file"
    :name="name ?? undefined"
    :aria-invalid="invalid ? 'true' : undefined"
    :aria-describedby="describedBy"
    :class="classes"
    @change="onChange"
  >
</template>
