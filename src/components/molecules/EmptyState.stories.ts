import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EmptyState from './EmptyState.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof EmptyState> = {
    title: 'Molecules/EmptyState',
    component: EmptyState,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    render: () => ({
        components: { EmptyState },
        template: `
            <div class="bg-surface border border-line rounded-surface max-w-lg">
                <EmptyState icon="server" title="No instances yet" description="Connect your first DocuWare instance to start bridging documents to AI assistants." />
            </div>`,
    }),
};

export const WithActions: Story = {
    render: () => ({
        components: { EmptyState, Button },
        template: `
            <div class="bg-surface border border-line rounded-surface max-w-lg">
                <EmptyState icon="server" title="No instances yet" description="Connect your first DocuWare instance to start bridging documents to AI assistants.">
                    <template #actions><Button>Add instance</Button></template>
                </EmptyState>
            </div>`,
    }),
};
