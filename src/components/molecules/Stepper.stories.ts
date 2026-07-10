import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Stepper from './Stepper.vue';

const meta: Meta<typeof Stepper> = {
    title: 'Molecules/Stepper',
    component: Stepper,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
    render: () => ({
        components: { Stepper },
        setup: () => ({
            steps: [
                { key: 'docuware', label: 'DocuWare' },
                { key: 'mcp', label: 'MCP' },
                { key: 'mistral', label: 'Mistral' },
                { key: 'prompts', label: 'Prompts' },
                { key: 'review', label: 'Review' },
            ],
        }),
        template: '<div class="max-w-2xl"><Stepper :steps="steps" :current="2" /></div>',
    }),
};
