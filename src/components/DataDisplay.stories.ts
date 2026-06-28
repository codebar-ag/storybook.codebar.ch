import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Table from './Table.vue';
import TableRow from './TableRow.vue';
import Td from './Td.vue';
import Th from './Th.vue';
import NumericCell from './NumericCell.vue';
import List from './List.vue';
import ListRow from './ListRow.vue';
import ListIcon from './ListIcon.vue';
import Metric from './Metric.vue';
import MetricGrid from './MetricGrid.vue';
import DescriptionList from './DescriptionList.vue';
import DescriptionItem from './DescriptionItem.vue';
import Badge from './Badge.vue';

const meta: Meta = {
    title: 'Atoms/Data display',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const DataTable: Story = {
    render: () => ({
        components: { Table, TableRow, Td, Th, NumericCell, Badge },
        template: `
            <Table>
                <template #head>
                    <Th>Tool</Th><Th>Instance</Th><NumericCell :head="true">Calls</NumericCell>
                </template>
                <TableRow>
                    <Td>search-documents</Td><Td>Luxor</Td><NumericCell>1,204</NumericCell>
                </TableRow>
                <TableRow>
                    <Td>get-document</Td><Td>Luxor</Td><NumericCell>318</NumericCell>
                </TableRow>
            </Table>`,
    }),
};

export const StackedList: Story = {
    render: () => ({
        components: { List: ListRow, ListRow, ListIcon, Badge },
        template: `
            <div class="bg-surface border border-line rounded-surface overflow-hidden max-w-lg">
                <ListRow href="#" :first="true">
                    <template #leading><ListIcon name="server" /></template>
                    <div class="font-medium text-ink">DocuWare Luxor</div>
                    <div class="text-xs text-muted">luxor.docuware.cloud</div>
                    <template #trailing><Badge variant="green">Connected</Badge></template>
                </ListRow>
                <ListRow href="#">
                    <template #leading><ListIcon name="server" /></template>
                    <div class="font-medium text-ink">codebar Solutions</div>
                    <template #trailing><Badge variant="gray">Idle</Badge></template>
                </ListRow>
            </div>`,
    }),
};

export const Metrics: Story = {
    render: () => ({
        components: { MetricGrid, Metric },
        template: `
            <MetricGrid class="max-w-xl">
                <Metric label="Calls (30d)" value="12,408" />
                <Metric label="Documents" value="1,902" />
                <Metric label="Seats" value="8" />
                <Metric label="Instances" value="3" />
            </MetricGrid>`,
    }),
};

export const Metadata: Story = {
    render: () => ({
        components: { DescriptionList, DescriptionItem },
        template: `
            <DescriptionList class="max-w-md">
                <DescriptionItem label="URL">luxor.docuware.cloud</DescriptionItem>
                <DescriptionItem label="Auth">Authorization Code</DescriptionItem>
                <DescriptionItem label="Created" tone="muted">12 Jun 2026</DescriptionItem>
            </DescriptionList>`,
    }),
};

export const Bullets: Story = {
    render: () => ({
        components: { List },
        template: `<List class="max-w-md text-sm text-muted">
            <li>Sign in to DocuWare on the consent screen.</li>
            <li>Pick the cabinets the assistant may read.</li>
            <li>Copy the MCP server URL into Claude.</li>
        </List>`,
    }),
};
