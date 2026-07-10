import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Alert from './Alert.vue';

const meta: Meta<typeof Alert> = {
    title: 'Molecules/Alert',
    component: Alert,
    argTypes: {
        variant: { control: 'select', options: ['info', 'success', 'warning', 'danger', 'neutral'] },
    },
    args: { variant: 'info', title: 'Heads up' },
    render: (args) => ({
        components: { Alert },
        setup: () => ({ args }),
        template: '<Alert v-bind="args">This is the alert body copy.</Alert>',
    }),
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {};
export const Success: Story = { args: { variant: 'success' } };
export const Warning: Story = { args: { variant: 'warning' } };
export const Error: Story = { args: { variant: 'danger' } };
export const Neutral: Story = { args: { variant: 'neutral' } };
