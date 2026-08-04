<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { EditorView as EditorViewType } from '@codemirror/view';
import { createCodeMirrorTheme } from '../../helpers/codeMirrorTheme';
import CopyButton from '../molecules/CopyButton.vue';

// CodeMirror is an OPTIONAL peer dependency: it is imported lazily so apps
// that never render an editor don't pay for the bundle (same convention as
// CodePreview, this component's read-only sibling).

const props = withDefaults(
    defineProps<{
        modelValue?: string;
        language?: 'json' | 'markdown';
        readonly?: boolean;
        /** Empty-state text shown only while readonly and there's no value. No default — the caller's copy. */
        placeholder?: string | null;
        autoHeight?: boolean;
        maxHeight?: string | null;
        /** Pins a copy-to-clipboard button over the top-right of the editor. Opt-in, so existing surfaces keep their chrome. */
        copyable?: boolean;
        copyLabel?: string;
        copiedMessage?: string;
    }>(),
    {
        modelValue: '',
        language: 'json',
        readonly: false,
        placeholder: null,
        autoHeight: false,
        maxHeight: null,
        copyable: false,
        copyLabel: 'Copy to clipboard',
        copiedMessage: 'Copied to clipboard',
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const host = ref<HTMLElement | null>(null);
let view: EditorViewType | null = null;

function formatValue(raw: string): string {
    if (!raw || props.language !== 'json') {
        return raw ?? '';
    }

    try {
        return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
        return raw;
    }
}

// Copies what the operator can actually see — the pretty-printed document,
// not the raw (often single-line) `modelValue` handed in by the caller.
const copyValue = computed(() => formatValue(props.modelValue ?? ''));

async function loadLanguage(language: string) {
    if (language === 'markdown') {
        const { markdown, markdownLanguage } = await import('@codemirror/lang-markdown');
        return markdown({ base: markdownLanguage });
    }

    return (await import('@codemirror/lang-json')).json();
}

async function mountEditor(): Promise<void> {
    if (!host.value) {
        return;
    }

    const [{ EditorState }, EditorViewModule, { defaultKeymap, history, historyKeymap }, { syntaxHighlighting, defaultHighlightStyle }, lang] =
        await Promise.all([
            import('@codemirror/state'),
            import('@codemirror/view'),
            import('@codemirror/commands'),
            import('@codemirror/language'),
            loadLanguage(props.language),
        ]);
    const { EditorView, keymap, lineNumbers } = EditorViewModule;

    if (!host.value) {
        return;
    }

    view?.destroy();

    view = new EditorView({
        state: EditorState.create({
            doc: formatValue(props.modelValue ?? ''),
            extensions: [
                lineNumbers(),
                history(),
                lang,
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                EditorView.lineWrapping,
                keymap.of([...defaultKeymap, ...historyKeymap]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged && !props.readonly) {
                        emit('update:modelValue', update.state.doc.toString());
                    }
                }),
                EditorView.editable.of(!props.readonly),
                EditorState.readOnly.of(props.readonly),
                createCodeMirrorTheme(EditorViewModule, { autoHeight: props.autoHeight }),
            ],
        }),
        parent: host.value,
    });
}

function syncDocument(value: string): void {
    if (!view) {
        return;
    }

    const formatted = formatValue(value ?? '');

    if (view.state.doc.toString() === formatted) {
        return;
    }

    view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: formatted },
    });
}

onMounted(mountEditor);

watch(
    () => props.readonly,
    () => mountEditor(),
);

watch(
    () => props.language,
    () => mountEditor(),
);

watch(
    () => props.modelValue,
    (value) => syncDocument(value ?? ''),
);

onBeforeUnmount(() => view?.destroy());
</script>

<template>
  <div
    class="relative flex flex-col rounded-control border border-line bg-surface"
    :class="autoHeight ? 'overflow-y-auto' : 'h-full min-h-0 overflow-hidden'"
    :style="autoHeight && maxHeight ? { maxHeight } : undefined"
  >
    <!--
      Sticky rather than absolute, and zero-height so it claims no layout: in
      `autoHeight` mode THIS element is the scroll container, and an absolutely
      positioned child would scroll out of sight on any document longer than
      the visible box.

      `items-start` is load-bearing: without it the default `align-items:
      stretch` squashes the button to this row's zero height, leaving a
      padding-only stadium with the icon spilling out top and bottom.
    -->
    <div
      v-if="copyable && modelValue"
      class="sticky top-0 z-10 flex h-0 items-start justify-end"
    >
      <CopyButton
        :value="copyValue"
        :label="copyLabel"
        :copied-message="copiedMessage"
        class="mt-1.5 mr-1.5 rounded-control border border-line bg-surface/90 text-dim backdrop-blur-sm hover:text-ink focus-visible:ring-accent/50"
      />
    </div>
    <div
      v-if="!modelValue && readonly && placeholder"
      :class="autoHeight ? 'flex min-h-16 items-center justify-center' : 'pointer-events-none absolute inset-0 flex items-center justify-center'"
      class="text-sm text-muted"
    >
      {{ placeholder }}
    </div>
    <div
      ref="host"
      :class="autoHeight ? '' : 'min-h-0 flex-1'"
    />
  </div>
</template>
