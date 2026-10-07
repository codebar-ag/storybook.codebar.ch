import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PageHeading from './PageHeading.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof PageHeading> = {
    title: 'Molecules/PageHeading',
    component: PageHeading,
    args: { eyebrow: null },
    render: (args) => ({
        components: { PageHeading },
        setup: () => ({ args }),
        template: '<PageHeading v-bind="args">File cabinets</PageHeading>',
    }),
};

export default meta;
type Story = StoryObj<typeof PageHeading>;

export const Default: Story = {};

export const WithEyebrow: Story = { args: { eyebrow: 'Mustermann AG' } };

export const WithDescription: Story = {
    render: () => ({
        components: { PageHeading },
        template: `<PageHeading eyebrow="Mustermann AG">
            File cabinets
            <template #description>
                Archives and document trays available to the connected MCP gateway.
            </template>
        </PageHeading>`,
    }),
};

export const WithActions: Story = {
    render: () => ({
        components: { PageHeading, Button },
        template: `<PageHeading eyebrow="Mustermann AG">
            File cabinets
            <template #description>
                Archives and document trays available to the connected MCP gateway.
            </template>
            <template #actions>
                <Button variant="secondary" size="sm">Export</Button>
                <Button size="sm">New cabinet</Button>
            </template>
        </PageHeading>`,
    }),
};

export const WithBreadcrumbs: Story = {
    args: {
        breadcrumbs: [
            { label: 'Gateways', href: '#' },
            { label: 'Mustermann AG', href: '#' },
            { label: 'File cabinets' },
        ],
    },
};

// The everything case, and what most consuming pages actually render: trail,
// title, description and an action cluster as one heading block.
export const WithBreadcrumbsAndActions: Story = {
    render: () => ({
        components: { PageHeading, Button },
        setup: () => ({
            breadcrumbs: [
                { label: 'Gateways', href: '#' },
                { label: 'Mustermann AG', href: '#' },
                { label: 'File cabinets' },
            ],
        }),
        template: `<PageHeading :breadcrumbs="breadcrumbs">
            File cabinets
            <template #description>
                Archives and document trays available to the connected MCP gateway.
            </template>
            <template #actions>
                <Button variant="secondary" size="sm">Export</Button>
                <Button size="sm">New cabinet</Button>
            </template>
        </PageHeading>`,
    }),
};

// Four actions: more than fit beside the title on a phone. The cluster drops
// below the title and wraps its own buttons instead of widening the page.
// Exercised at phone and desktop width by tests/page-heading.spec.ts.
export const ManyActions: Story = {
    render: () => ({
        components: { PageHeading, Button },
        template: `<PageHeading eyebrow="Mustermann AG" data-testid="title">
            File cabinets
            <template #actions>
                <Button variant="secondary" size="sm">Export</Button>
                <Button variant="secondary" size="sm">Import</Button>
                <Button variant="secondary" size="sm">Sync now</Button>
                <Button size="sm">New cabinet</Button>
            </template>
        </PageHeading>`,
    }),
};
