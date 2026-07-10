import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ErrorLayout from './ErrorLayout.vue';
import Button from '../atoms/Button.vue';
import IconBadge from '../atoms/IconBadge.vue';

const meta: Meta<typeof ErrorLayout> = {
    title: 'Layouts/ErrorLayout',
    component: ErrorLayout,
    parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof ErrorLayout>;

// The full error pages live under Pages/Errors — this is the bare shell.
export const Default: Story = {
    render: () => ({
        components: { ErrorLayout, Button, IconBadge },
        template: `
            <ErrorLayout code="Error 404" title="Page not found" description="The page you are looking for was moved or deleted.">
                <template #illustration>
                    <IconBadge icon="search" variant="neutral" size="md" class="mb-5" />
                </template>
                <template #actions>
                    <Button href="#" variant="secondary">Go back</Button>
                    <Button href="#">To the dashboard</Button>
                </template>
            </ErrorLayout>`,
    }),
};
