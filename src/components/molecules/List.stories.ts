import type { Meta, StoryObj } from '@storybook/vue3-vite';
import List from './List.vue';
import ListRow from './ListRow.vue';
import ListIcon from '../atoms/ListIcon.vue';
import Badge from '../atoms/Badge.vue';

const meta: Meta<typeof List> = {
    title: 'Molecules/List',
    component: List,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof List>;

// Dash-bulleted list used in setup instructions and callouts.
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

// ListRow stacks link rows with leading icon and trailing badge slots; the
// wrapper provides the surface and border, `first` suppresses the top divider.
export const StackedList: Story = {
    render: () => ({
        components: { ListRow, ListIcon, Badge },
        template: `
            <div class="bg-surface border border-line rounded-surface overflow-hidden max-w-lg">
                <ListRow href="#" :first="true">
                    <template #leading><ListIcon name="server" /></template>
                    <div class="font-medium text-ink">DocuWare Mustermann</div>
                    <div class="text-xs text-muted">mustermann.docuware.cloud</div>
                    <template #trailing><Badge variant="success">Connected</Badge></template>
                </ListRow>
                <ListRow href="#">
                    <template #leading><ListIcon name="server" /></template>
                    <div class="font-medium text-ink">codebar Solutions</div>
                    <template #trailing><Badge variant="neutral">Idle</Badge></template>
                </ListRow>
            </div>`,
    }),
};

// Without `href` a row renders as a static <div> with no hover treatment.
export const StaticRows: Story = {
    render: () => ({
        components: { ListRow, ListIcon },
        template: `
            <div class="bg-surface border border-line rounded-surface overflow-hidden max-w-lg">
                <ListRow :first="true">
                    <template #leading><ListIcon name="server" /></template>
                    <div class="font-medium text-ink">Invoices</div>
                    <div class="text-xs text-muted">File cabinet · 1,902 documents</div>
                </ListRow>
                <ListRow>
                    <template #leading><ListIcon name="server" /></template>
                    <div class="font-medium text-ink">b_Inbox</div>
                    <div class="text-xs text-muted">Document tray · 24 documents</div>
                </ListRow>
            </div>`,
    }),
};
