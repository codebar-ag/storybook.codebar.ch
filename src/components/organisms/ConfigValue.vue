<script setup lang="ts">
import { computed } from 'vue';
import CodePreview from './CodePreview.vue';
import DescriptionItem from '../molecules/DescriptionItem.vue';

const props = defineProps<{
    label: string;
    value?: string | null;
}>();

type DisplayKind = 'empty' | 'text' | 'json' | 'markdown';

const display = computed((): { kind: DisplayKind; text: string } => {
    const raw = props.value ?? '';

    if (!raw) {
        return { kind: 'empty', text: '' };
    }

    try {
        JSON.parse(raw);

        return { kind: 'json', text: raw };
    } catch {
        // not JSON
    }

    if (raw.includes('\n') || raw.trimStart().startsWith('#')) {
        return { kind: 'markdown', text: raw };
    }

    return { kind: 'text', text: raw };
});

const isBlock = computed(() => display.value.kind === 'json' || display.value.kind === 'markdown');
</script>

<template>
  <div :class="isBlock ? 'sm:col-span-2 space-y-1' : ''">
    <DescriptionItem
      v-if="display.kind === 'text' || display.kind === 'empty'"
      :label="label"
    >
      {{ display.kind === 'empty' ? '—' : display.text }}
    </DescriptionItem>
    <template v-else>
      <p class="text-2xs uppercase tracking-wide text-muted">
        {{ label }}
      </p>
      <CodePreview
        :value="display.text"
        :language="display.kind"
      />
    </template>
  </div>
</template>
