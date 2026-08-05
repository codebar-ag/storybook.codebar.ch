<script setup lang="ts">
import { push } from '../../composables/useToast';
import { touchTargetClasses } from '../../helpers/touchTarget';
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

function copyFallback(value: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let succeeded = false;
    try {
        succeeded = document.execCommand('copy');
    } catch {
        succeeded = false;
    }
    document.body.removeChild(textarea);
    return succeeded;
}

async function copy(): Promise<void> {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(props.value);
        } else if (!copyFallback(props.value)) {
            throw new Error('Clipboard copy failed');
        }
        push({ message: props.copiedMessage, type: 'success' });
    } catch {
        push({ message: 'Could not copy to clipboard', type: 'error' });
    }
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :class="[
      'shrink-0 inline-flex items-center justify-center p-1 transition rounded focus:outline-none focus-visible:ring-2',
      touchTargetClasses,
    ]"
    @click="copy"
  >
    <Icon
      name="copy"
      size="sm"
      :class="iconSize"
    />
  </button>
</template>
