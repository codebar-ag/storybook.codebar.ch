import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PageHeading from './PageHeading.vue';

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
