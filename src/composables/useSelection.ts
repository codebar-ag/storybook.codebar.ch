import { computed } from 'vue';
import type { ComputedRef, WritableComputedRef } from 'vue';
import { useControllable } from './useControllable';

export type RowKey = string | number;

export interface UseSelectionOptions {
    /** Controlled selection (v-model:selected), or undefined for internal state. */
    selected?: () => RowKey[] | undefined;
    onChange?: (selected: RowKey[]) => void;
}

/**
 * Headless row selection over the currently visible keys: per-row toggle plus
 * a select-all that reports the indeterminate in-between state.
 */
export function useSelection(
    keys: () => RowKey[],
    options: UseSelectionOptions = {},
): {
    selected: WritableComputedRef<RowKey[]>;
    isSelected: (key: RowKey) => boolean;
    toggle: (key: RowKey) => void;
    toggleAll: () => void;
    clear: () => void;
    allSelected: ComputedRef<boolean>;
    someSelected: ComputedRef<boolean>;
} {
    const selected = useControllable<RowKey[]>(
        options.selected ?? (() => undefined),
        (value) => options.onChange?.(value),
        [],
    );

    function isSelected(key: RowKey): boolean {
        return selected.value.includes(key);
    }

    function toggle(key: RowKey): void {
        selected.value = isSelected(key)
            ? selected.value.filter((k) => k !== key)
            : [...selected.value, key];
    }

    const allSelected = computed(() => {
        const visible = keys();
        return visible.length > 0 && visible.every((key) => selected.value.includes(key));
    });

    const someSelected = computed(
        () => !allSelected.value && keys().some((key) => selected.value.includes(key)),
    );

    function toggleAll(): void {
        if (allSelected.value) {
            const visible = new Set(keys());
            selected.value = selected.value.filter((key) => !visible.has(key));
        } else {
            selected.value = [...new Set([...selected.value, ...keys()])];
        }
    }

    function clear(): void {
        selected.value = [];
    }

    return { selected, isSelected, toggle, toggleAll, clear, allSelected, someSelected };
}
