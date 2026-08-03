<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { EditorView as EditorViewType } from '@codemirror/view';
import { createCodeMirrorTheme } from '../../helpers/codeMirrorTheme';

// CodeMirror is an OPTIONAL peer dependency: it is imported lazily so apps
// that never render a code preview don't pay for the bundle.

const props = withDefaults(
    defineProps<{
        value?: string;
        language?: 'text' | 'json' | 'markdown';
        maxHeight?: string;
    }>(),
    {
        value: '',
        language: 'text',
        maxHeight: '24rem',
    },
);

const host = ref<HTMLElement | null>(null);
let view: EditorViewType | null = null;

function formatValue(raw: string, language: string): string {
    if (!raw) {
        return '';
    }

    if (language === 'json') {
        try {
            return JSON.stringify(JSON.parse(raw), null, 2);
        } catch {
            return raw;
        }
    }

    return raw;
}

async function loadLanguage(language: string) {
    if (language === 'json') {
        return (await import('@codemirror/lang-json')).json();
    }

    if (language === 'markdown') {
        return (await import('@codemirror/lang-markdown')).markdown();
    }

    return [];
}

async function mount(): Promise<void> {
    if (!host.value) {
        return;
    }

    const [{ EditorState }, EditorViewModule, { syntaxHighlighting, defaultHighlightStyle }, lang] = await Promise.all([
        import('@codemirror/state'),
        import('@codemirror/view'),
        import('@codemirror/language'),
        loadLanguage(props.language),
    ]);
    const { EditorView, lineNumbers } = EditorViewModule;

    if (!host.value) {
        return;
    }

    view?.destroy();
    view = new EditorView({
        state: EditorState.create({
            doc: formatValue(props.value, props.language),
            extensions: [
                EditorState.readOnly.of(true),
                EditorView.editable.of(false),
                EditorView.lineWrapping,
                lineNumbers(),
                lang,
                // Same highlighter as CodeEditor — a preview surface that
                // renders code as flat grey text is the one thing it exists
                // not to do.
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                // Shared theme (same as CodeEditor) plus this component's own
                // maxHeight cap, which only makes sense for a preview surface.
                createCodeMirrorTheme(EditorViewModule, { autoHeight: true }),
                EditorView.theme({
                    '&': { fontSize: '12px' },
                    '.cm-scroller': { maxHeight: props.maxHeight },
                }),
            ],
        }),
        parent: host.value,
    });
}

onMounted(mount);

watch(
    () => [props.value, props.language, props.maxHeight],
    () => mount(),
);

onBeforeUnmount(() => view?.destroy());
</script>

<template>
  <div
    class="overflow-hidden rounded-control border border-line bg-surface-2"
    :class="!value ? 'p-3 text-xs text-muted' : ''"
  >
    <div
      v-if="value"
      ref="host"
    />
    <span v-else>—</span>
  </div>
</template>
