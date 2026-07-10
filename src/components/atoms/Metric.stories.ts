import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Metric from './Metric.vue';

const meta: Meta<typeof Metric> = {
    title: 'Atoms/Metric',
    component: Metric,
    args: { label: 'Calls (30d)', value: '12,408' },
    render: (args) => ({
        components: { Metric },
        setup: () => ({ args }),
        template: '<Metric v-bind="args" class="min-w-40 border border-line rounded-control" />',
    }),
};

export default meta;
type Story = StoryObj<typeof Metric>;

export const Default: Story = {};
export const NumericValue: Story = { args: { label: 'Instances', value: 3 } };
