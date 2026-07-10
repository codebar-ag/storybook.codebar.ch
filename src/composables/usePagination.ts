import { computed } from 'vue';
import type { ComputedRef, WritableComputedRef } from 'vue';
import { useControllable } from './useControllable';

export interface UsePaginationOptions {
    pageSize?: () => number;
    /** Controlled page (v-model:page), or undefined for internal state. */
    page?: () => number | undefined;
    onChange?: (page: number) => void;
}

/**
 * Headless pagination over a total row count. `sliceOf` cuts the current
 * window out of a client-side row array; in server mode just read `page`.
 */
export function usePagination(
    total: () => number,
    options: UsePaginationOptions = {},
): {
    page: WritableComputedRef<number>;
    pageCount: ComputedRef<number>;
    canPrev: ComputedRef<boolean>;
    canNext: ComputedRef<boolean>;
    prev: () => void;
    next: () => void;
    sliceOf: <T>(rows: T[]) => T[];
} {
    const pageSize = computed(() => options.pageSize?.() ?? 10);

    const page = useControllable<number>(
        options.page ?? (() => undefined),
        (value) => options.onChange?.(value),
        1,
    );

    const pageCount = computed(() => Math.max(1, Math.ceil(total() / pageSize.value)));

    const canPrev = computed(() => page.value > 1);
    const canNext = computed(() => page.value < pageCount.value);

    function prev(): void {
        if (canPrev.value) {
            page.value = page.value - 1;
        }
    }

    function next(): void {
        if (canNext.value) {
            page.value = page.value + 1;
        }
    }

    function sliceOf<T>(rows: T[]): T[] {
        const start = (page.value - 1) * pageSize.value;
        return rows.slice(start, start + pageSize.value);
    }

    return { page, pageCount, canPrev, canNext, prev, next, sliceOf };
}
