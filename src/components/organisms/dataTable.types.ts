import type { SortState } from '../../composables/useSort';
import type { RowKey } from '../../composables/useSelection';

export interface DataTableColumn<T = Record<string, unknown>> {
    /** Row property to display; also the slot name (`#cell-<key>`) and sort key. */
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'right';
    /** Width utility class or CSS width for the column, e.g. 'w-32' or '12rem'. */
    width?: string;
    /** Custom ascending comparator; defaults to a numeric-aware compare of row[key]. */
    sortFn?: (a: T, b: T) => number;
}

export type { SortState, RowKey };
