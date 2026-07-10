import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Table from './Table.vue';
import TableRow from '../molecules/TableRow.vue';
import Td from '../atoms/Td.vue';
import Th from '../atoms/Th.vue';
import NumericCell from '../atoms/NumericCell.vue';
import Badge from '../atoms/Badge.vue';

const meta: Meta<typeof Table> = {
    title: 'Organisms/Table',
    component: Table,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const DataTable: Story = {
    render: () => ({
        components: { Table, TableRow, Td, Th, NumericCell, Badge },
        template: `
            <Table>
                <template #head>
                    <Th>Tool</Th><Th>Instance</Th><NumericCell :head="true">Calls</NumericCell>
                </template>
                <TableRow>
                    <Td>search-documents</Td><Td>Mustermann</Td><NumericCell>1,204</NumericCell>
                </TableRow>
                <TableRow>
                    <Td>get-document</Td><Td>Mustermann</Td><NumericCell>318</NumericCell>
                </TableRow>
            </Table>`,
    }),
};

// Th's `sortable` prop turns the header cell into a sort button and carries
// aria-sort ('ascending' / 'descending' / 'none'). Clicking the header
// toggles the direction here to show the chevron flip.
export const SortableHeader: Story = {
    render: () => ({
        components: { Table, TableRow, Td, Th, NumericCell },
        setup() {
            const sortDir = ref<'asc' | 'desc' | null>('asc');
            const toggle = () => {
                sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
            };
            return { sortDir, toggle };
        },
        template: `
            <Table>
                <template #head>
                    <Th
                        :sortable="true"
                        :sort-dir="sortDir"
                        @sort="toggle"
                    >Tool</Th>
                    <Th>Instance</Th>
                    <NumericCell :head="true">Calls</NumericCell>
                </template>
                <TableRow>
                    <Td>get-document</Td><Td>Mustermann</Td><NumericCell>318</NumericCell>
                </TableRow>
                <TableRow>
                    <Td>search-documents</Td><Td>Mustermann</Td><NumericCell>1,204</NumericCell>
                </TableRow>
            </Table>`,
    }),
};

export const WithBadges: Story = {
    render: () => ({
        components: { Table, TableRow, Td, Th, NumericCell, Badge },
        template: `
            <Table>
                <template #head>
                    <Th>Instance</Th><Th>Status</Th><NumericCell :head="true">Documents</NumericCell>
                </template>
                <TableRow>
                    <Td>DocuWare Mustermann</Td>
                    <Td><Badge variant="success">Connected</Badge></Td>
                    <NumericCell>1,902</NumericCell>
                </TableRow>
                <TableRow>
                    <Td>codebar Solutions</Td>
                    <Td><Badge variant="neutral">Idle</Badge></Td>
                    <NumericCell>418</NumericCell>
                </TableRow>
            </Table>`,
    }),
};
