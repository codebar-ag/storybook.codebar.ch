import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StatusBadge from './StatusBadge.vue';

const meta: Meta<typeof StatusBadge> = {
    title: 'Atoms/StatusBadge',
    component: StatusBadge,
    argTypes: {
        variant: {
            control: 'select',
            options: ['neutral', 'info', 'success', 'warning', 'danger'],
        },
    },
    args: { variant: 'success', label: 'Connected', dot: true },
    render: (args) => ({
        components: { StatusBadge },
        setup: () => ({ args }),
        template: '<StatusBadge v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Success: Story = {};
export const Warning: Story = { args: { variant: 'warning', label: 'Pending' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Error' } };

// Instance status badges: the consuming app maps its own enum → { variant, label }.
export const InstanceStatuses: Story = {
    render: () => ({
        components: { StatusBadge },
        template: `<div class="flex gap-2">
            <StatusBadge variant="success" label="Connected" :dot="true" />
            <StatusBadge variant="warning" label="Pending" :dot="true" />
            <StatusBadge variant="danger" label="Error" :dot="true" />
            <StatusBadge variant="neutral" label="Disabled" :dot="true" />
        </div>`,
    }),
};
