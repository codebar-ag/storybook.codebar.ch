import { nextTick, onBeforeUnmount, watch } from 'vue';
import type { Ref } from 'vue';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

function focusableIn(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
    );
}

/**
 * Traps Tab/Shift+Tab inside `container` while `enabled` is true, moves focus
 * into the container on activation (initialFocus > first focusable > the
 * container itself) and restores focus to the previously focused element on
 * deactivation or unmount. SSR-safe (no-op without document).
 */
export function useFocusTrap(
    container: Ref<HTMLElement | null>,
    enabled: Ref<boolean>,
    options: { initialFocus?: () => HTMLElement | null } = {},
): void {
    if (typeof document === 'undefined') {
        return;
    }

    let previouslyFocused: HTMLElement | null = null;

    function onKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Tab' || !container.value) {
            return;
        }

        const focusable = focusableIn(container.value);
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        // Wrap at the edges; also pull focus back in if it escaped the container.
        if (event.shiftKey && (active === first || !container.value.contains(active))) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && (active === last || !container.value.contains(active))) {
            event.preventDefault();
            first.focus();
        }
    }

    function activate(): void {
        previouslyFocused = document.activeElement as HTMLElement | null;
        document.addEventListener('keydown', onKeydown);
        void nextTick(() => {
            if (!container.value) {
                return;
            }
            const target =
                options.initialFocus?.() ?? focusableIn(container.value)[0] ?? container.value;
            target.focus();
        });
    }

    function deactivate(): void {
        document.removeEventListener('keydown', onKeydown);
        previouslyFocused?.focus();
        previouslyFocused = null;
    }

    watch(enabled, (on) => (on ? activate() : deactivate()), { immediate: true });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', onKeydown);
    });
}
