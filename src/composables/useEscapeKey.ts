import { onBeforeUnmount, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Calls `handler` when Escape is pressed anywhere in the document while
 * `enabled` is true. The listener only exists while enabled (checked
 * immediately, so an initially-open overlay is covered too) and is always
 * removed on unmount. SSR-safe (no-op without document).
 *
 * Pass `capture: true` when the overlay can contain a focused child that
 * binds its own Escape handling in the bubble phase (e.g. a CodeMirror
 * editor) and needs to be beaten to the key. Combine with
 * `event.stopPropagation()` inside `handler` to actually suppress it.
 */
export function useEscapeKey(
    handler: (event: KeyboardEvent) => void,
    enabled: Ref<boolean>,
    options: { capture?: boolean } = {},
): void {
    if (typeof document === 'undefined') {
        return;
    }

    const capture = options.capture ?? false;

    function onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            handler(event);
        }
    }

    watch(
        enabled,
        (on) => {
            if (on) {
                document.addEventListener('keydown', onKeydown, { capture });
            } else {
                document.removeEventListener('keydown', onKeydown, { capture });
            }
        },
        { immediate: true },
    );

    onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown, { capture }));
}
