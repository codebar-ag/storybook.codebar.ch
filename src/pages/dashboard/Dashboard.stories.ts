import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
// Pages compose EXCLUSIVELY the public API.
import {
    Alert,
    AppShell,
    areaChartOptions,
    Avatar,
    Badge,
    Button,
    Card,
    Chart,
    DataTable,
    Field,
    FilterBar,
    FormActions,
    FormGrid,
    Input,
    InputNumber,
    Label,
    MetricGrid,
    Navbar,
    PageHeading,
    Select,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    StatusBadge,
    Tabs,
    Toggle,
    useFormErrors,
} from '../../index';
import type { DataTableColumn } from '../../index';

const meta: Meta = {
    title: 'Pages/Dashboard',
    parameters: { layout: 'fullscreen' },
    tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

interface DocumentRow extends Record<string, unknown> {
    id: number;
    title: string;
    cabinet: string;
    trust: 'Green' | 'Yellow' | 'Red';
    filedAt: string;
}

const documents: DocumentRow[] = [
    { id: 4711, title: 'Invoice 2026-0142', cabinet: 'e_invoices', trust: 'Green', filedAt: '2026-07-09' },
    { id: 4712, title: 'Invoice 2026-0143', cabinet: 'e_invoices', trust: 'Yellow', filedAt: '2026-07-09' },
    { id: 4713, title: 'Framework contract Sonepar', cabinet: 'e_contracts', trust: 'Green', filedAt: '2026-07-08' },
    { id: 4714, title: 'Delivery note 88-1204', cabinet: 'b_inbox', trust: 'Red', filedAt: '2026-07-08' },
    { id: 4715, title: 'Invoice 2026-0144', cabinet: 'e_invoices', trust: 'Green', filedAt: '2026-07-07' },
    { id: 4716, title: 'HR onboarding P. Meier', cabinet: 'e_hr', trust: 'Yellow', filedAt: '2026-07-07' },
];

const columns: DataTableColumn<DocumentRow>[] = [
    { key: 'title', label: 'Document', sortable: true },
    { key: 'cabinet', label: 'Cabinet', sortable: true },
    { key: 'trust', label: 'Intellix trust' },
    { key: 'filedAt', label: 'Filed', sortable: true, align: 'right' },
];

const trustTone: Record<string, string> = { Green: 'success', Yellow: 'warning', Red: 'danger' };

const shell = `
    <template #sidebar>
        <Sidebar>
            <template #brand><span class="text-sm font-semibold text-ink">DocuHub</span></template>
            <SidebarGroup label="Workspace">
                <SidebarItem href="#" icon="chart" :active="active === 'dashboard'">Dashboard</SidebarItem>
                <SidebarItem href="#" icon="server" :active="active === 'documents'">Documents</SidebarItem>
                <SidebarItem href="#" icon="sparkles">Flows</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Admin">
                <SidebarItem href="#" icon="cog" :active="active === 'settings'">Settings</SidebarItem>
            </SidebarGroup>
        </Sidebar>
    </template>
    <template #navbar="{ toggleSidebar }">
        <Navbar @toggle-sidebar="toggleSidebar">
            <template #brand><span class="text-sm font-semibold text-ink">DocuHub</span></template>
            <template #actions>
                <Badge variant="success">Connected</Badge>
                <Avatar name="Sebastian Burgin" size="sm" />
            </template>
        </Navbar>
    </template>`;

export const Overview: Story = {
    render: () => ({
        components: {
            AppShell, Avatar, Badge, Card, Chart, DataTable, MetricGrid, Navbar,
            PageHeading, Sidebar, SidebarGroup, SidebarItem, StatusBadge,
        },
        setup: () => ({
            active: 'dashboard',
            documents,
            columns,
            trustTone,
            metrics: [
                { label: 'Documents (30d)', value: "12'408" },
                { label: 'Auto-filed (Green)', value: '86%' },
                { label: 'Waiting for review', value: '37' },
                { label: 'Failed extractions', value: '4' },
            ],
            series: [{ name: 'Documents', data: [140, 210, 184, 260, 231, 305, 289] }],
            chartOptions: areaChartOptions({
                xaxis: {
                    type: 'category',
                    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
            }),
        }),
        template: `
            <AppShell>${shell}
                <PageHeading eyebrow="Workspace">Dashboard</PageHeading>
                <div class="mt-6 space-y-6">
                    <MetricGrid :metrics="metrics" />
                    <Card title="Documents processed" description="Last 7 days">
                        <Chart type="area" :series="series" :options="chartOptions" :height="220" />
                    </Card>
                    <Card title="Latest documents" :padded="false">
                        <DataTable :columns="columns" :rows="documents" row-key="id">
                            <template #cell-trust="{ value }">
                                <StatusBadge :variant="trustTone[value]" :label="String(value)" dot />
                            </template>
                        </DataTable>
                    </Card>
                </div>
            </AppShell>`,
    }),
};

export const List: Story = {
    render: () => ({
        components: {
            AppShell, Avatar, Badge, Button, Card, DataTable, FilterBar, Label, Navbar,
            PageHeading, Select, Sidebar, SidebarGroup, SidebarItem, StatusBadge,
        },
        setup: () => ({
            active: 'documents',
            documents,
            columns,
            trustTone,
            cabinet: ref(''),
            selected: ref<Array<string | number>>([]),
        }),
        template: `
            <AppShell>${shell}
                <div class="flex items-start justify-between gap-4">
                    <PageHeading eyebrow="Workspace">Documents</PageHeading>
                    <Button>Upload document</Button>
                </div>
                <div class="mt-6 space-y-4">
                    <FilterBar>
                        <Label for="cabinet-filter">Cabinet</Label>
                        <Select v-model="cabinet" name="cabinet-filter" class="w-56" placeholder="All cabinets"
                            :options="[{ value: 'e_invoices', label: 'e_invoices' }, { value: 'e_contracts', label: 'e_contracts' }, { value: 'b_inbox', label: 'b_inbox' }]" />
                    </FilterBar>
                    <Card :padded="false">
                        <DataTable
                            v-model:selected="selected"
                            :columns="columns"
                            :rows="documents"
                            row-key="id"
                            selectable
                            pagination-mode="client"
                            :page-size="5"
                            class="px-4 pb-4"
                        >
                            <template #cell-trust="{ value }">
                                <StatusBadge :variant="trustTone[value]" :label="String(value)" dot />
                            </template>
                            <template #bulk-actions="{ selected: keys, clear }">
                                <Button variant="ghost" size="sm" @click="clear">Refile {{ keys.length }}</Button>
                                <Button variant="ghost" size="sm" @click="clear">Export</Button>
                            </template>
                        </DataTable>
                    </Card>
                </div>
            </AppShell>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Bulk selection surfaces the action bar.
        await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all rows' }));
        await expect(canvas.getByText('5 selected')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));

        // Sorting by cabinet works on the composed page.
        await userEvent.click(canvas.getByRole('button', { name: /Cabinet/ }));
        const firstDataCell = canvas.getAllByRole('cell')[1];
        await expect(firstDataCell).toHaveTextContent('Delivery note 88-1204');
    },
};

export const Settings: Story = {
    render: () => ({
        components: {
            Alert, AppShell, Avatar, Badge, Button, Card, Field, FormActions, FormGrid,
            Input, InputNumber, Navbar, PageHeading, Sidebar, SidebarGroup, SidebarItem, Tabs, Toggle,
        },
        setup: () => {
            const name = ref('Luxor Haushaltsapparate AG');
            const url = ref('luxor.docuware.cloud');
            const retries = ref(3);
            const autoFile = ref(true);
            const errors = ref<Record<string, string> | null>(null);
            const { errorFor, invalid, hasErrors } = useFormErrors(() => errors.value);

            function save(): void {
                const bag: Record<string, string> = {};
                if (!/^https:\/\//.test(url.value)) {
                    bag.url = 'The URL must start with https://.';
                }
                errors.value = Object.keys(bag).length ? bag : null;
            }

            return {
                active: 'settings',
                tabs: [
                    { key: 'general', label: 'General' },
                    { key: 'indexing', label: 'Indexing' },
                    { key: 'danger', label: 'Danger zone' },
                ],
                name, url, retries, autoFile, errorFor, invalid, hasErrors, save,
            };
        },
        template: `
            <AppShell>${shell}
                <PageHeading eyebrow="Admin">Settings</PageHeading>
                <div class="mt-6 max-w-3xl">
                    <Tabs :tabs="tabs">
                        <template #general>
                            <Card title="Instance" description="Connection to your DocuWare cloud.">
                                <form class="space-y-4" novalidate @submit.prevent="save">
                                    <Alert v-if="hasErrors" variant="danger" title="Could not save">
                                        Please fix the highlighted fields.
                                    </Alert>
                                    <FormGrid :cols="2">
                                        <Field label="Display name" name="name">
                                            <Input v-model="name" name="name" />
                                        </Field>
                                        <Field label="DocuWare URL" name="url" :error="errorFor('url')">
                                            <Input v-model="url" name="url" :invalid="invalid('url')" />
                                        </Field>
                                        <Field label="Retry attempts" name="retries" hint="Between 0 and 10.">
                                            <InputNumber v-model="retries" name="retries" :min="0" :max="10" />
                                        </Field>
                                    </FormGrid>
                                    <Toggle v-model="autoFile" label="Auto-file Green documents" description="Documents with high Intellix trust are filed unattended." />
                                    <FormActions>
                                        <Button variant="ghost" type="button">Cancel</Button>
                                        <Button type="submit">Save changes</Button>
                                    </FormActions>
                                </form>
                            </Card>
                        </template>
                        <template #indexing>
                            <Card title="Indexing" description="Intellix trust thresholds.">
                                <p class="text-sm text-muted">Threshold configuration lives here.</p>
                            </Card>
                        </template>
                        <template #danger>
                            <Card title="Danger zone" variant="danger">
                                <div class="flex items-center justify-between gap-4">
                                    <p class="text-sm text-muted">Disconnect this instance and stop all flows.</p>
                                    <Button variant="danger">Disconnect</Button>
                                </div>
                            </Card>
                        </template>
                    </Tabs>
                </div>
            </AppShell>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Validation pattern: bad URL → server-shaped error on save.
        await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
        await expect(canvas.getByText('The URL must start with https://.')).toBeVisible();

        // Tab navigation reaches the danger zone.
        await userEvent.click(canvas.getByRole('tab', { name: 'Danger zone' }));
        await expect(canvas.getByRole('button', { name: 'Disconnect' })).toBeVisible();
    },
};
