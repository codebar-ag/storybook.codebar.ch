import { onBeforeUnmount, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Calls `handler` on any mousedown outside `target` while `enabled` is true.
 * The document listener only exists while enabled, so closed overlays cost
 * nothing; it is always removed on unmount. SSR-safe (no-op without document).
 */
export function useClickOutside(
    target: Ref<HTMLElement | null>,
    handler: (event: MouseEvent) => void,
    enabled: Ref<boolean>,
): void {
    if (typeof document === 'undefined') {
        return;
    }

    function onDocumentMousedown(event: MouseEvent): void {
        const el = target.value;
        if (!el || el.contains(event.target as Node)) {
            return;
        }
        handler(event);
    }

    watch(enabled, (on) => {
        if (on) {
            document.addEventListener('mousedown', onDocumentMousedown);
        } else {
            document.removeEventListener('mousedown', onDocumentMousedown);
        }
    });

    onBeforeUnmount(() => document.removeEventListener('mousedown', onDocumentMousedown));
}
