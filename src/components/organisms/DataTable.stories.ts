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
