import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Toaster from './Toaster.vue';
import Button from './Button.vue';
import EmptyState from './EmptyState.vue';
import IconBadge from './IconBadge.vue';
import Progress from './Progress.vue';
import { push } from '../composables/useToast';

const meta: Meta = {
    title: 'Atoms/Feedback',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Toasts: Story = {
    render: () => ({
        components: { Toaster, Button },
        setup: () => ({
            success: () => push({ message: 'Instance saved.', type: 'success' }),
            error: () => push({ message: 'Could not reach DocuWare.', type: 'error' }),
            info: () => push({ message: 'Copied to clipboard', type: 'info' }),
        }),
        template: `
            <div class="flex gap-2">
                <Button variant="secondary" @click="success">Success</Button>
                <Button variant="secondary" @click="error">Error</Button>
                <Button variant="secondary" @click="info">Info</Button>
                <Toaster />
            </div>`,
    }),
};

export const Empty: Story = {
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

export const Badges: Story = {
    render: () => ({
        components: { IconBadge },
        template: `
            <div class="flex gap-4 items-center">
                <IconBadge icon="check" variant="success" />
                <IconBadge icon="warning" variant="warning" />
                <IconBadge icon="x" variant="danger" />
                <IconBadge icon="lock" variant="accent" shape="surface" size="sm" />
            </div>`,
    }),
};

export const Bars: Story = {
    render: () => ({
        components: { Progress },
        template: `
            <div class="space-y-3 max-w-sm">
                <Progress :value="20" />
                <Progress :value="62" />
                <Progress :value="95" />
            </div>`,
    }),
};
