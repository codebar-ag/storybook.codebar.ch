import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Progress from './Progress.vue';

const meta: Meta<typeof Progress> = {
    title: 'Atoms/Progress',
    component: Progress,
    parameters: { layout: 'padded' },
    args: { value: 62 },
    render: (args) => ({
        components: { Progress },
        setup: () => ({ args }),
        template: '<div class="max-w-sm"><Progress v-bind="args" /></div>',
    }),
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const Values: Story = {
    render: () => ({
        components: { Progress },
        template: `
            <div class="space-y-3 max-w-sm">
                <Progress :value="0" />
                <Progress :value="20" />
                <Progress :value="62" />
                <Progress :value="95" />
                <Progress :value="100" />
            </div>`,
    }),
};
