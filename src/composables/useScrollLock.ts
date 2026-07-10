import { onBeforeUnmount, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Locks page scrolling while `locked` is true, compensating for the vanished
 * scrollbar with padding so the layout doesn't shift. Restores the previous
 * inline styles on release or unmount. SSR-safe (no-op without document).
 */
export function useScrollLock(locked: Ref<boolean>): void {
    if (typeof document === 'undefined') {
        return;
    }

    let previousOverflow = '';
    let previousPaddingRight = '';
    let active = false;

    function lock(): void {
        if (active) {
            return;
        }
        const root = document.documentElement;
        const scrollbarWidth = window.innerWidth - root.clientWidth;
        previousOverflow = root.style.overflow;
        previousPaddingRight = root.style.paddingRight;
        root.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
            root.style.paddingRight = `${scrollbarWidth}px`;
        }
        active = true;
    }

    function unlock(): void {
        if (!active) {
            return;
        }
        const root = document.documentElement;
        root.style.overflow = previousOverflow;
        root.style.paddingRight = previousPaddingRight;
        active = false;
    }

    watch(locked, (on) => (on ? lock() : unlock()), { immediate: true });

    onBeforeUnmount(unlock);
}
