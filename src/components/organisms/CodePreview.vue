<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { EditorView as EditorViewType } from '@codemirror/view';

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

    const [{ EditorState }, { EditorView, lineNumbers }, lang] = await Promise.all([
        import('@codemirror/state'),
        import('@codemirror/view'),
        loadLanguage(props.language),
    ]);

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
                EditorView.theme({
                    '&': {
                        fontSize: '12px',
                        backgroundColor: 'transparent',
                    },
                    '.cm-scroller': {
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        overflow: 'auto',
                        maxHeight: props.maxHeight,
                    },
                    '.cm-gutters': {
                        backgroundColor: 'transparent',
                        borderRight: '1px solid var(--color-line, #e5e7eb)',
                    },
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
