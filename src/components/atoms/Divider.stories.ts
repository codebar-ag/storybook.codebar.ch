import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Divider from './Divider.vue';

const meta: Meta<typeof Divider> = {
    title: 'Atoms/Divider',
    component: Divider,
    argTypes: {
        orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    },
    args: { orientation: 'horizontal', label: null },
    render: (args) => ({
        components: { Divider },
        setup: () => ({ args }),
        template: '<div class="w-72"><Divider v-bind="args" /></div>',
    }),
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {};

export const WithLabel: Story = { args: { label: 'or continue with' } };

export const Vertical: Story = {
    render: () => ({
        components: { Divider },
        template: `
            <div class="flex items-center gap-3 h-8 text-sm text-muted">
                <span>Instances</span>
                <Divider orientation="vertical" />
                <span>Flows</span>
                <Divider orientation="vertical" />
                <span>Logs</span>
            </div>`,
    }),
};
