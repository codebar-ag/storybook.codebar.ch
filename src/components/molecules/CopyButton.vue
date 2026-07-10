<script setup lang="ts">
import { push } from '../../composables/useToast';
import Icon from '../atoms/Icon.vue';

// Icon-only "copy to clipboard" button. Writes `value` to the clipboard and
// pushes a success toast. Colour/ring/icon-size ride in via class so both app
// chrome (theme tokens) and the DocuWare mirror (dw hex) reuse the behaviour.
const props = withDefaults(
    defineProps<{
        value?: string;
        label?: string;
        copiedMessage?: string;
        iconSize?: string;
    }>(),
    {
        value: '',
        label: 'Copy to clipboard',
        copiedMessage: 'Copied to clipboard',
        iconSize: 'size-3.5',
    },
);

async function copy(): Promise<void> {
    await navigator.clipboard?.writeText(props.value);
    push({ message: props.copiedMessage, type: 'success' });
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="shrink-0 inline-flex items-center justify-center p-1 transition rounded focus:outline-none focus-visible:ring-2"
    @click="copy"
  >
    <Icon
      name="copy"
      size="sm"
      :class="iconSize"
    />
  </button>
</template>
