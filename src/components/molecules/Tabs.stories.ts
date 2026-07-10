import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import Tabs from './Tabs.vue';

const meta: Meta<typeof Tabs> = {
    title: 'Molecules/Tabs',
    component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: () => ({
        components: { Tabs },
        setup: () => ({
            tabs: [
                { key: 'general', label: 'General' },
                { key: 'indexing', label: 'Indexing' },
                { key: 'danger', label: 'Danger zone' },
            ],
        }),
        template: `
            <Tabs :tabs="tabs" class="w-96">
                <template #general><p class="text-sm text-muted">Instance name, region and default cabinet.</p></template>
                <template #indexing><p class="text-sm text-muted">Intellix trust thresholds and auto-filing rules.</p></template>
                <template #danger><p class="text-sm text-muted">Disconnect or delete this instance.</p></template>
            </Tabs>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tabs = canvas.getAllByRole('tab');

        await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        await expect(canvas.getByText(/Instance name/)).toBeVisible();

        // Click activates; arrow keys move with roving tabindex and wrap.
        await userEvent.click(tabs[1]);
        await expect(canvas.getByText(/Intellix trust/)).toBeVisible();
        await userEvent.keyboard('{ArrowRight}');
        await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        await expect(tabs[2]).toHaveFocus();
        await userEvent.keyboard('{ArrowRight}');
        await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    },
};

export const WithDisabled: Story = {
    render: () => ({
        components: { Tabs },
        setup: () => ({
            tabs: [
                { key: 'active', label: 'Active flows' },
                { key: 'archived', label: 'Archived', disabled: true },
                { key: 'drafts', label: 'Drafts' },
            ],
        }),
        template: `
            <Tabs :tabs="tabs" class="w-96">
                <template #active><p class="text-sm text-muted">3 flows processing documents.</p></template>
                <template #drafts><p class="text-sm text-muted">1 unfinished flow.</p></template>
            </Tabs>`,
    }),
};
