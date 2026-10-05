import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import TabGroup from './TabGroup.vue';
import Tab from '../atoms/Tab.vue';

const meta: Meta<typeof TabGroup> = {
    title: 'Molecules/TabGroup',
    component: TabGroup,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof TabGroup>;

// URL-driven filter tabs with result counts. Each Tab is a link; the active
// one carries aria-current="page".
export const WithCounts: Story = {
    render: () => ({
        components: { TabGroup, Tab },
        template: `
            <TabGroup label="Filter">
                <Tab href="?status=open" :active="true" :count="4">Open</Tab>
                <Tab href="?status=accepted" :count="12">Accepted</Tab>
                <Tab href="?status=declined" :count="0">Declined</Tab>
            </TabGroup>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const nav = canvas.getByRole('navigation', { name: 'Filter' });

        await expect(within(nav).getByRole('link', { name: /Open/ })).toHaveAttribute('aria-current', 'page');
        // A count of 0 is still shown: "none" is information for a filter.
        await expect(within(nav).getByRole('link', { name: /Declined/ })).toHaveTextContent('0');
    },
};
