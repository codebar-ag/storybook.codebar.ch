import { computed } from 'vue';
import type { ComputedRef, WritableComputedRef } from 'vue';
import { useControllable } from './useControllable';

export type SortDir = 'asc' | 'desc';

export interface SortState {
    key: string;
    dir: SortDir;
}

export interface UseSortOptions<T> {
    /** Custom comparator per column key (ascending order). */
    comparators?: Record<string, (a: T, b: T) => number>;
    /** Controlled state (server mode): current sort, or undefined for internal state. */
    state?: () => SortState | null | undefined;
    onChange?: (state: SortState | null) => void;
}

function defaultCompare(a: unknown, b: unknown): number {
    if (a === b) {
        return 0;
    }
    // Nulls sort last regardless of direction of the remaining values.
    if (a === null || a === undefined) {
        return 1;
    }
    if (b === null || b === undefined) {
        return -1;
    }
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/**
 * Headless client-side sorting: tracks a { key, dir } state (asc → desc →
 * none cycle) and derives the sorted rows. Server mode: pass `state`/
 * `onChange` and ignore `sortedRows` — the state is all you need to emit.
 */
export function useSort<T extends Record<string, unknown>>(
    rows: () => T[],
    options: UseSortOptions<T> = {},
): {
    sort: WritableComputedRef<SortState | null>;
    sortedRows: ComputedRef<T[]>;
    toggleSort: (key: string) => void;
} {
    const sort = useControllable<SortState | null>(
        options.state ?? (() => undefined),
        (value) => options.onChange?.(value),
        null,
    );

    function toggleSort(key: string): void {
        if (sort.value?.key !== key) {
            sort.value = { key, dir: 'asc' };
        } else if (sort.value.dir === 'asc') {
            sort.value = { key, dir: 'desc' };
        } else {
            sort.value = null;
        }
    }

    const sortedRows = computed(() => {
        const state = sort.value;
        if (!state) {
            return rows();
        }
        const comparator =
            options.comparators?.[state.key] ??
            ((a: T, b: T) => defaultCompare(a[state.key], b[state.key]));
        const factor = state.dir === 'asc' ? 1 : -1;
        return [...rows()].sort((a, b) => factor * comparator(a, b));
    });

    return { sort, sortedRows, toggleSort };
}
