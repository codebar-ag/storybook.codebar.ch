import type { Extension } from '@codemirror/state';
import type * as EditorViewModuleType from '@codemirror/view';

/**
 * Shared CodeMirror theme for every editor/preview surface in the kit
 * (CodeEditor, CodePreview). Colors reference the design tokens' CSS custom
 * properties directly (see tokens.css for the source of truth) instead of
 * embedding literal hex fallbacks, so every consumer stays in sync
 * automatically and never drifts from the token layer.
 *
 * Takes the dynamically-imported `@codemirror/view` module itself (rather
 * than importing it statically here) so this helper doesn't force the
 * optional-peer bundle cost on consumers who never render an editor.
 */
export function createCodeMirrorTheme(
    { EditorView }: Pick<typeof EditorViewModuleType, 'EditorView'>,
    { autoHeight = false }: { autoHeight?: boolean } = {},
): Extension {
    return EditorView.theme({
        '&': {
            fontSize: '13px',
            backgroundColor: 'transparent',
            ...(autoHeight ? {} : { height: '100%' }),
        },
        '.cm-scroller': {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            ...(autoHeight ? {} : { height: '100%', overflow: 'auto' }),
        },
        '.cm-gutters': {
            backgroundColor: 'transparent',
            borderRight: '1px solid var(--color-line)',
            color: 'var(--color-muted)',
        },
        '.cm-content': {
            padding: '12px 0',
            caretColor: 'var(--color-ink)',
        },
        '.cm-activeLine': {
            backgroundColor: 'color-mix(in srgb, var(--color-surface-2) 60%, transparent)',
        },
        '&.cm-focused .cm-cursor': {
            borderLeftColor: 'var(--color-ink)',
        },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
            backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent) !important',
        },
    });
}
