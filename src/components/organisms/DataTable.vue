<script setup lang="ts" generic="T extends Record<string, unknown>">
// Sortable, selectable, paginated data table.
//
// Headless logic lives in useSort/useSelection/usePagination; this organism
// only renders. Two operating modes per concern:
//   - client (default): sorting/paging happen here from the full `rows`.
//   - server: the component is fully controlled — bind v-model:sort /
//     v-model:page / `total` and re-fetch on their update events.
//
// Cell rendering is overridable per column via #cell-<key>="{ row, value }";
// #row-actions adds a trailing actions cell, #bulk-actions a toolbar that
// appears while rows are selected, and #row-detail="{ row }" renders a
// full-width block directly beneath each row — for showing what a row is
// related to (its runs, its children) without a drilldown. The detail row is
// not clickable and carries no divider, so it reads as part of the row above
// rather than as a row of its own; a caller that wants nothing for a given
// row simply renders nothing inside the slot.
import { computed, getCurrentInstance } from 'vue';
import { useSort } from '../../composables/useSort';
import { useSelection } from '../../composables/useSelection';
import { usePagination } from '../../composables/usePagination';
import type { DataTableColumn, RowKey, SortState } from './dataTable.types';
import Alert from '../molecules/Alert.vue';
import Button from '../atoms/Button.vue';
import EmptyState from '../molecules/EmptyState.vue';
import Th from '../atoms/Th.vue';
import { touchTargetBoundsClasses, touchTargetLabelClasses } from '../../helpers/touchTarget';
import { warnOnce } from '../../helpers/dev';

export interface DataTableProps<T extends Record<string, unknown>> {
    columns: readonly DataTableColumn<T>[];
    rows: readonly T[];
    rowKey: keyof T | ((row: T) => RowKey);
    loading?: boolean;
    error?: string | null;
    selectable?: boolean;
    /** v-model:selected */
    selected?: readonly RowKey[];
    sortMode?: 'client' | 'server';
    /** v-model:sort */
    sort?: SortState | null;
    paginationMode?: 'client' | 'server' | 'none';
    /** v-model:page */
    page?: number;
    pageSize?: number;
    /** Total row count in server mode (client mode derives it). */
    total?: number | null;
    stickyHeader?: boolean;
    density?: 'comfortable' | 'compact';
}

const props = withDefaults(
    defineProps<DataTableProps<T>>(),
    {
        loading: false,
        error: null,
        selectable: false,
        selected: undefined,
        sortMode: 'client',
        sort: undefined,
        paginationMode: 'none',
        page: undefined,
        pageSize: 10,
        total: null,
        stickyHeader: false,
        density: 'comfortable',
    },
);

const emit = defineEmits<{
    'update:selected': [selected: RowKey[]];
    'update:sort': [sort: SortState | null];
    'update:page': [page: number];
    'row-click': [row: T];
}>();

// `emits` listeners are stripped from $attrs, so detect a bound `row-click`
// handler via the raw incoming vnode props instead.
//
// A function called from the template, deliberately NOT a `computed`:
// `instance.vnode` is REPLACED on every parent re-render and the instance is a
// plain object, so a computed over it answers for the vnode that existed at
// mount and never for the current one. A caller whose handler is itself
// conditional (`@row-click="editable ? open : undefined"`) would gain the
// handler without gaining the affordance that says the row is clickable.
const instance = getCurrentInstance();

function hasRowClick(): boolean {
    return Boolean(instance?.vnode.props?.onRowClick);
}

// `rowKey` is required and has no default, and until now nothing said so at
// runtime. Vue's own "Missing required prop" warning cannot fire for ANY prop
// in this package: the library is compiled with `isProd: true`, and
// @vue/compiler-sfc emits `required`/`type` only for a development build —
// dist/flows.js declares this prop as the bare `rowKey: {}`. So the check has
// to be written out, the same way the tone deprecation had to be (helpers/dev.ts).
//
// The cost of the silence was total rather than cosmetic: nine call sites in
// one consuming app omitted it, so every `:key` in those tables was `undefined`
// and Vue could not tell any row from any other — patching, transitions and
// selection all keyed on the same nothing.
function keyOf(row: T): RowKey {
    if (typeof props.rowKey === 'function') {
        return props.rowKey(row);
    }

    if (props.rowKey === undefined) {
        warnOnce(
            'DataTable:rowKey',
            '[flows] <DataTable> is missing the required `rowKey` prop, so every row is keyed '
                + '`undefined` and Vue cannot tell the rows apart. Pass the name of a unique row '
                + 'property (`row-key="id"`) or a function returning one (`:row-key="r => r.a + r.b"`).',
        );
    }

    return row[props.rowKey] as RowKey;
}

const comparators = computed(() =>
    Object.fromEntries(
        props.columns.flatMap((col) => (col.sortFn ? [[col.key, col.sortFn]] : [])),
    ),
);

const { sort, sortedRows, toggleSort } = useSort<T>(() => props.rows, {
    comparators: comparators.value,
    state: () => props.sort,
    onChange: (state) => emit('update:sort', state),
});

const totalCount = computed(() =>
    props.paginationMode === 'server' ? (props.total ?? props.rows.length) : props.rows.length,
);

const { page, pageCount, canPrev, canNext, prev, next, sliceOf } = usePagination(
    () => totalCount.value,
    {
        pageSize: () => props.pageSize,
        page: () => props.page,
        onChange: (value) => emit('update:page', value),
    },
);

const visibleRows = computed(() => {
    const base = props.sortMode === 'client' ? sortedRows.value : props.rows;
    return props.paginationMode === 'client' ? sliceOf(base) : base;
});

const { selected, isSelected, toggle, toggleAll, clear, allSelected, someSelected } = useSelection(
    () => visibleRows.value.map(keyOf),
    {
        selected: () => props.selected,
        onChange: (value) => emit('update:selected', value),
    },
);

const columnCount = computed(
    () => props.columns.length + (props.selectable ? 1 : 0) + 1, // +1 covers an eventual actions cell
);

const cellPadding = computed(() => (props.density === 'compact' ? 'px-4 py-1.5' : 'px-4 py-3'));

// Plain input rather than the Checkbox atom: table cells need the bare box
// without Checkbox's label layout and its 44px of real vertical space.
//
// That leaves a 16x16 hit area, under the WCAG 2.5.8 floor, and an `<input>` is
// a replaced element so `touchTargetClasses` cannot grow it. Each input is
// wrapped in a `<label>` instead, whose `::before` fills the whole selection
// cell and forwards clicks to the input: the cell carries the bounds, the label
// carries the target. See helpers/touchTarget.ts.
const checkboxClasses =
    'size-4 shrink-0 rounded accent-ink cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

function sortDirFor(col: DataTableColumn<T>): 'asc' | 'desc' | null {
    return sort.value?.key === col.key ? sort.value.dir : null;
}

function onRowClick(row: T, event: MouseEvent): void {
    // Interactive descendants (checkboxes, action buttons, links) keep their
    // own click semantics.
    if ((event.target as HTMLElement).closest('a, button, input, label')) {
        return;
    }
    emit('row-click', row);
}
</script>

<template>
  <div>
    <!-- Bulk toolbar: appears while a selection exists. -->
    <div
      v-if="selectable && selected.length > 0 && $slots['bulk-actions']"
      class="mb-2 flex items-center gap-3 rounded-control border border-line bg-surface-2 px-3 py-2"
    >
      <span class="text-xs font-medium text-ink">{{ selected.length }} selected</span>
      <div class="flex flex-1 items-center gap-2">
        <slot
          name="bulk-actions"
          :selected="selected"
          :clear="clear"
        />
      </div>
      <button
        type="button"
        class="text-xs text-muted transition hover:text-ink cursor-pointer"
        @click="clear"
      >
        Clear
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr
            :class="[
              'border-b border-line text-2xs uppercase tracking-wider text-dim [&>th]:px-4 [&>th]:py-2.5 [&>th]:font-medium',
              stickyHeader ? '[&>th]:sticky [&>th]:top-0 [&>th]:z-10 [&>th]:bg-surface' : '',
            ]"
          >
            <th
              v-if="selectable"
              :class="['w-10', touchTargetBoundsClasses]"
            >
              <label :class="touchTargetLabelClasses">
                <input
                  type="checkbox"
                  :class="checkboxClasses"
                  :checked="allSelected"
                  :indeterminate="someSelected"
                  aria-label="Select all rows"
                  @change="toggleAll"
                >
              </label>
            </th>
            <Th
              v-for="col in columns"
              :key="col.key"
              :sortable="col.sortable"
              :sort-dir="sortDirFor(col)"
              :align="col.align"
              :style="col.width && !col.width.startsWith('w-') ? { width: col.width } : undefined"
              :class="col.width?.startsWith('w-') ? col.width : undefined"
              @sort="toggleSort(col.key)"
            >
              {{ col.label }}
            </Th>
            <th v-if="$slots['row-actions']">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <!-- The row divider lives on the data/state rows themselves, not on a
             `[&>tr]` rule here. A detail row is a `<tr>` too, so the rule
             drew a line between a row and its own detail block — and could
             not be cancelled from there either, since `.…\:border-t > tr`
             (0,1,1) out-specifies a plain `.border-t-0` (0,1,0). Every row
             that used to get the border still gets one, and `first:` keeps
             the first one flush under the header exactly as before. -->
        <tbody>
          <!-- Loading: one skeleton row per expected row. -->
          <template v-if="loading">
            <tr
              v-for="i in paginationMode === 'none' ? 5 : pageSize"
              :key="`skeleton-${i}`"
              class="border-t border-line first:border-t-0"
              aria-hidden="true"
            >
              <td
                v-if="selectable"
                :class="cellPadding"
              />
              <td
                v-for="col in columns"
                :key="col.key"
                :class="cellPadding"
              >
                <div class="h-4 w-3/4 animate-pulse rounded-xs bg-surface-2" />
              </td>
              <td
                v-if="$slots['row-actions']"
                :class="cellPadding"
              />
            </tr>
          </template>

          <!-- Error state. -->
          <tr
            v-else-if="error !== null"
            class="border-t border-line first:border-t-0"
          >
            <td
              :colspan="columnCount"
              class="px-4 py-4"
            >
              <slot
                name="error"
                :error="error"
              >
                <Alert
                  variant="danger"
                  title="Could not load rows"
                >
                  {{ error }}
                </Alert>
              </slot>
            </td>
          </tr>

          <!-- Empty state. -->
          <tr
            v-else-if="visibleRows.length === 0"
            class="border-t border-line first:border-t-0"
          >
            <td :colspan="columnCount">
              <slot name="empty">
                <EmptyState
                  icon="search"
                  title="Nothing here"
                  description="No rows match the current view."
                />
              </slot>
            </td>
          </tr>

          <!-- Data rows, each optionally followed by its own detail row. The
               loop is lifted into a <template> because an element carrying
               v-for renders exactly one element per iteration — the previous
               `<tr v-for v-else>` could not be given a sibling. -->
          <template v-else>
            <template
              v-for="row in visibleRows"
              :key="keyOf(row)"
            >
              <tr
                :class="[
                  isSelected(keyOf(row)) ? 'bg-surface-2/60' : 'hover:bg-surface-2/40',
                  hasRowClick() ? 'cursor-pointer' : '',
                ]"
                class="border-t border-line transition first:border-t-0"
                @click="onRowClick(row, $event)"
              >
                <td
                  v-if="selectable"
                  :class="[cellPadding, touchTargetBoundsClasses]"
                >
                  <label :class="touchTargetLabelClasses">
                    <input
                      type="checkbox"
                      :class="checkboxClasses"
                      :checked="isSelected(keyOf(row))"
                      :aria-label="`Select row ${keyOf(row)}`"
                      @change="toggle(keyOf(row))"
                    >
                  </label>
                </td>
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :class="[cellPadding, col.align === 'right' ? 'text-right tabular-nums' : '']"
                >
                  <slot
                    :name="`cell-${col.key}`"
                    :row="row"
                    :value="row[col.key]"
                  >
                    {{ row[col.key] }}
                  </slot>
                </td>
                <td
                  v-if="$slots['row-actions']"
                  :class="[cellPadding, 'w-px whitespace-nowrap text-right']"
                >
                  <slot
                    name="row-actions"
                    :row="row"
                  />
                </td>
              </tr>

              <!-- Deliberately not clickable and not bordered: it belongs to
                   the row above, so it must not read (or behave) as a row in
                   its own right. Only the interactive elements a caller puts
                   inside it do anything. -->
              <tr v-if="$slots['row-detail']">
                <td
                  :colspan="columnCount"
                  class="px-4 pt-0 pb-3"
                >
                  <slot
                    name="row-detail"
                    :row="row"
                  />
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Footer: custom slot or the built-in pager. -->
    <slot name="footer">
      <div
        v-if="paginationMode !== 'none' && !loading && error === null"
        class="mt-3 flex items-center justify-between gap-2"
      >
        <span class="text-xs text-muted tabular-nums">Page {{ page }} of {{ pageCount }}</span>
        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            :disabled="!canPrev"
            @click="prev"
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            :disabled="!canNext"
            @click="next"
          >
            Next
          </Button>
        </div>
      </div>
    </slot>
  </div>
</template>
