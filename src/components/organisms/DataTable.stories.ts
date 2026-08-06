import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import DataTable from './DataTable.vue';
import Dropdown from '../molecules/Dropdown.vue';
import DropdownItem from '../molecules/DropdownItem.vue';
import Button from '../atoms/Button.vue';
import StatusBadge from '../atoms/StatusBadge.vue';
import Icon from '../atoms/Icon.vue';
import type { DataTableColumn } from './dataTable.types';

interface DocumentRow extends Record<string, unknown> {
    id: number;
    title: string;
    cabinet: string;
    trust: 'Green' | 'Yellow' | 'Red';
    amount: number;
}

const documents: DocumentRow[] = [
    { id: 4711, title: 'Invoice 2026-0142', cabinet: 'e_invoices', trust: 'Green', amount: 1240.5 },
    { id: 4712, title: 'Invoice 2026-0143', cabinet: 'e_invoices', trust: 'Yellow', amount: 320 },
    { id: 4713, title: 'Framework contract Mustermann', cabinet: 'e_contracts', trust: 'Green', amount: 15800 },
    { id: 4714, title: 'Delivery note 88-1204', cabinet: 'b_inbox', trust: 'Red', amount: 0 },
    { id: 4715, title: 'Invoice 2026-0144', cabinet: 'e_invoices', trust: 'Green', amount: 87.9 },
];

const columns: DataTableColumn<DocumentRow>[] = [
    { key: 'title', label: 'Document', sortable: true },
    { key: 'cabinet', label: 'Cabinet', sortable: true },
    { key: 'trust', label: 'Intellix trust' },
    { key: 'amount', label: 'Amount (CHF)', sortable: true, align: 'right' },
];

const trustTone: Record<string, string> = { Green: 'success', Yellow: 'warning', Red: 'danger' };

// Untyped Meta/StoryObj: DataTable is a generic component, which Storybook's
// Meta<typeof X> inference can't represent (and the stories add spy args like
// onEdit that aren't component props).
const meta: Meta = {
    title: 'Organisms/DataTable',
    component: DataTable as unknown as Meta['component'],
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;
// Stories only add spy args (fn()); Storybook's untyped Args need a local cast.
type SpyArgs = Record<string, ReturnType<typeof fn>>;

export const Full: Story = {
    render: (args) => ({
        components: { DataTable, Dropdown, DropdownItem, Button, StatusBadge, Icon },
        setup: () => ({
            documents,
            columns,
            trustTone,
            selected: ref<Array<string | number>>([]),
            onEdit: (args as SpyArgs).onEdit ?? (() => {}),
            onDelete: (args as SpyArgs).onDelete ?? (() => {}),
        }),
        template: `
            <DataTable
                v-model:selected="selected"
                :columns="columns"
                :rows="documents"
                row-key="id"
                selectable
                pagination-mode="client"
                :page-size="4"
            >
                <template #cell-trust="{ value }">
                    <StatusBadge :variant="trustTone[value]" :label="String(value)" dot />
                </template>
                <template #cell-amount="{ value }">
                    {{ value === 0 ? '—' : Number(value).toFixed(2) }}
                </template>
                <template #row-actions="{ row }">
                    <Dropdown align="right" width="w-44">
                        <template #trigger>
                            <span class="flex size-8 items-center justify-center text-dim hover:text-ink" :aria-label="'Actions for ' + row.title">⋯</span>
                        </template>
                        <DropdownItem @click="onEdit(row)">Edit index fields</DropdownItem>
                        <DropdownItem @click="onDelete(row)">Move to trash</DropdownItem>
                    </Dropdown>
                </template>
                <template #bulk-actions="{ selected: keys, clear }">
                    <Button variant="ghost" size="sm" @click="clear">Refile {{ keys.length }}</Button>
                </template>
            </DataTable>`,
    }),
    args: { onEdit: fn(), onDelete: fn() },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Sorting cycles asc → desc → none and carries aria-sort.
        const header = canvas.getByRole('button', { name: /Document/ });
        const th = header.closest('th')!;
        await expect(th).toHaveAttribute('aria-sort', 'none');
        await userEvent.click(header);
        await expect(th).toHaveAttribute('aria-sort', 'ascending');
        await userEvent.click(header);
        await expect(th).toHaveAttribute('aria-sort', 'descending');
        await userEvent.click(header);
        await expect(th).toHaveAttribute('aria-sort', 'none');

        // Selection: one row → indeterminate select-all + bulk bar; select-all → all.
        const selectAll = canvas.getByRole('checkbox', { name: 'Select all rows' });
        const firstRow = canvas.getByRole('checkbox', { name: 'Select row 4711' });
        await userEvent.click(firstRow);
        await expect(canvas.getByText('1 selected')).toBeVisible();
        await expect((selectAll as HTMLInputElement).indeterminate).toBe(true);
        await userEvent.click(selectAll);
        await expect(canvas.getByText('4 selected')).toBeVisible();
        await expect(selectAll).toBeChecked();

        // Clear via the bulk bar.
        await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
        await expect(canvas.queryByText('4 selected')).not.toBeInTheDocument();

        // Client pagination: 5 rows, page size 4.
        await expect(canvas.getByText('Page 1 of 2')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
        await expect(canvas.getByText('Page 2 of 2')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    },
};

export const ServerMode: Story = {
    render: (args) => ({
        components: { DataTable },
        setup: () => ({
            documents: documents.slice(0, 3),
            columns,
            onSort: (args as SpyArgs)['onUpdate:sort'] ?? (() => {}),
            onPage: (args as SpyArgs)['onUpdate:page'] ?? (() => {}),
        }),
        template: `
            <DataTable
                :columns="columns"
                :rows="documents"
                row-key="id"
                sort-mode="server"
                :sort="null"
                pagination-mode="server"
                :page="1"
                :page-size="3"
                :total="42"
                @update:sort="onSort"
                @update:page="onPage"
            />`,
    }),
    args: { 'onUpdate:sort': fn(), 'onUpdate:page': fn() },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const spies = args as SpyArgs;

        // Server mode is fully controlled: interactions only emit.
        await userEvent.click(canvas.getByRole('button', { name: /Cabinet/ }));
        await expect(spies['onUpdate:sort']).toHaveBeenCalledWith({ key: 'cabinet', dir: 'asc' });

        await expect(canvas.getByText('Page 1 of 14')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
        await expect(spies['onUpdate:page']).toHaveBeenCalledWith(2);
    },
};

export const Loading: Story = {
    render: () => ({
        components: { DataTable },
        setup: () => ({ columns }),
        template: '<DataTable :columns="columns" :rows="[]" row-key="id" loading pagination-mode="client" :page-size="4" />',
    }),
};

export const Empty: Story = {
    render: () => ({
        components: { DataTable },
        setup: () => ({ columns }),
        template: '<DataTable :columns="columns" :rows="[]" row-key="id" />',
    }),
};

export const ErrorState: Story = {
    render: () => ({
        components: { DataTable },
        setup: () => ({ columns }),
        template: '<DataTable :columns="columns" :rows="[]" row-key="id" error="DocuWare did not respond (timeout after 30s)." />',
    }),
};

export const Compact: Story = {
    render: () => ({
        components: { DataTable },
        setup: () => ({ documents, columns }),
        template: '<DataTable :columns="columns" :rows="documents" row-key="id" density="compact" sticky-header />',
    }),
};

// The tightest arrangement the table offers: compact rows *and* a selection
// column, with the header stuck. This is the case where a fixed 44px checkbox
// target would not fit — the rows are shorter than that — so it is the one the
// target sizing has to be measured against.
export const CompactSelectable: Story = {
    render: () => ({
        components: { DataTable },
        setup: () => ({ documents, columns, selected: ref<Array<string | number>>([]) }),
        template: `
            <DataTable
                v-model:selected="selected"
                :columns="columns"
                :rows="documents"
                row-key="id"
                selectable
                density="compact"
                sticky-header
            />`,
    }),
};

// A row's related records, rendered beneath the row itself rather than behind a
// drilldown. Three things this story exists to hold still: the detail block sits
// inside its row's band with no divider between the two; a row with nothing to
// show (4713) renders no block and no empty space; and a link inside the block
// does not also fire the row click, which the counter below makes visible.
export const RowDetail: Story = {
    render: () => ({
        components: { DataTable, StatusBadge },
        setup: () => {
            const opened = ref<string[]>([]);
            const runsFor: Record<number, Array<{ id: string; status: string }>> = {
                4711: [{ id: 'run-8842', status: 'success' }, { id: 'run-8830', status: 'danger' }],
                4712: [{ id: 'run-8821', status: 'warning' }],
                4713: [],
                4714: [{ id: 'run-8804', status: 'danger' }],
                4715: [{ id: 'run-8799', status: 'success' }],
            };
            return {
                documents,
                columns,
                runsFor,
                opened,
                selected: ref<Array<string | number>>([]),
                onRowClick: (row: DocumentRow) => opened.value.push(row.title),
            };
        },
        template: `
            <div>
                <DataTable
                    v-model:selected="selected"
                    :columns="columns"
                    :rows="documents"
                    row-key="id"
                    selectable
                    @row-click="onRowClick"
                >
                    <template #cell-amount="{ value }">
                        {{ value === 0 ? '—' : Number(value).toFixed(2) }}
                    </template>
                    <template #row-detail="{ row }">
                        <div v-if="runsFor[row.id].length" class="ml-6 border-l border-line pl-4">
                            <p class="mb-1 text-2xs uppercase tracking-wider text-dim">Processing runs</p>
                            <div
                                v-for="run in runsFor[row.id]"
                                :key="run.id"
                                class="flex flex-wrap items-center gap-x-3 gap-y-1 py-0.5 text-xs"
                            >
                                <a :href="'#' + run.id" class="font-mono underline">{{ run.id }}</a>
                                <StatusBadge :variant="run.status" :label="run.status" dot />
                                <span class="text-muted">2026-07-13 09:10:41</span>
                            </div>
                        </div>
                    </template>
                </DataTable>
                <p data-testid="opened-count">Opened: {{ opened.length }}</p>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByText('run-8842')).toBeVisible();
        // 4713 has no runs: the slot renders nothing rather than an empty box.
        await expect(canvas.queryByText('run-8813')).not.toBeInTheDocument();

        // A link inside the block keeps its own semantics — onRowClick already
        // ignores interactive descendants, and the detail row has no handler
        // of its own to begin with.
        await userEvent.click(canvas.getByText('run-8842'));
        await expect(canvas.getByTestId('opened-count')).toHaveTextContent('Opened: 0');
    },
};

// Selection and row navigation on the same rows. The checkbox's hit area covers
// its whole cell, so this is where a click on the target must select the row and
// must *not* count as opening it — both counters are rendered so the assertion
// can be made from outside the component.
export const RowClick: Story = {
    render: () => ({
        components: { DataTable },
        setup: () => {
            const opened = ref<string[]>([]);
            return {
                documents,
                columns,
                opened,
                selected: ref<Array<string | number>>([]),
                onRowClick: (row: DocumentRow) => opened.value.push(row.title),
            };
        },
        template: `
            <div>
                <DataTable
                    v-model:selected="selected"
                    :columns="columns"
                    :rows="documents"
                    row-key="id"
                    selectable
                    @row-click="onRowClick"
                />
                <p data-testid="selected-count">Selected: {{ selected.length }}</p>
                <p data-testid="opened-count">Opened: {{ opened.length }}</p>
            </div>`,
    }),
};
