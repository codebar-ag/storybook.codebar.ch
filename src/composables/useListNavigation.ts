import { ref } from 'vue';
import type { Ref } from 'vue';

export interface ListNavigationHandlers {
    /** Called on Enter when an item is active. */
    select?: (index: number) => void;
    /** Called on Escape. */
    close?: () => void;
}

/**
 * Keyboard core for listbox-style widgets (SearchableSelect, Combobox):
 * tracks the active index and maps ArrowUp/ArrowDown/Home/End/Enter/Escape
 * onto it. Extracted from SearchableSelect; index semantics are unchanged
 * (clamped at the edges, -1 = nothing active).
 */
export function useListNavigation(
    count: () => number,
    handlers: ListNavigationHandlers = {},
): {
    activeIndex: Ref<number>;
    setActive: (index: number) => void;
    onKeydown: (event: KeyboardEvent) => void;
} {
    const activeIndex = ref(-1);

    function setActive(index: number): void {
        activeIndex.value = index;
    }

    function onKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                if (handlers.close) {
                    event.preventDefault();
                    handlers.close();
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (count() > 0) {
                    activeIndex.value = Math.min(activeIndex.value + 1, count() - 1);
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (count() > 0) {
                    activeIndex.value = Math.max(activeIndex.value - 1, 0);
                }
                break;
            case 'Home':
                if (count() > 0) {
                    event.preventDefault();
                    activeIndex.value = 0;
                }
                break;
            case 'End':
                if (count() > 0) {
                    event.preventDefault();
                    activeIndex.value = count() - 1;
                }
                break;
            case 'Enter':
                if (activeIndex.value >= 0 && handlers.select) {
                    event.preventDefault();
                    handlers.select(activeIndex.value);
                }
                break;
        }
    }

    return { activeIndex, setActive, onKeydown };
}
