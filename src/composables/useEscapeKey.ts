import { onBeforeUnmount, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Calls `handler` when Escape is pressed anywhere in the document while
 * `enabled` is true. The listener only exists while enabled (checked
 * immediately, so an initially-open overlay is covered too) and is always
 * removed on unmount. SSR-safe (no-op without document).
 */
export function useEscapeKey(
    handler: (event: KeyboardEvent) => void,
    enabled: Ref<boolean>,
): void {
    if (typeof document === 'undefined') {
        return;
    }

    function onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            handler(event);
        }
    }

    watch(
        enabled,
        (on) => {
            if (on) {
                document.addEventListener('keydown', onKeydown);
            } else {
                document.removeEventListener('keydown', onKeydown);
            }
        },
        { immediate: true },
    );

    onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
}
