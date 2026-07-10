import type { Meta, StoryObj } from '@storybook/vue3-vite';
// Pages compose EXCLUSIVELY the public API.
import { Button, ErrorLayout, IconBadge } from '../../index';

const meta: Meta = {
    title: 'Pages/Errors',
    parameters: { layout: 'fullscreen' },
    tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

function errorPage(
    code: string,
    title: string,
    description: string,
    icon: string,
    actionLabel: string,
): Story {
    return {
        render: () => ({
            components: { Button, ErrorLayout, IconBadge },
            setup: () => ({ code, title, description, icon, actionLabel }),
            template: `
                <ErrorLayout :code="code" :title="title" :description="description">
                    <template #illustration>
                        <IconBadge :icon="icon" variant="neutral" size="md" shape="circle" class="mb-5" />
                    </template>
                    <template #actions>
                        <Button href="#" variant="secondary">Go back</Button>
                        <Button href="#">{{ actionLabel }}</Button>
                    </template>
                </ErrorLayout>`,
        }),
    };
}

export const NotFound = errorPage(
    'Error 404',
    'Page not found',
    'The document or page you are looking for was moved, deleted, or never existed.',
    'search',
    'To the dashboard',
);

export const Forbidden = errorPage(
    'Error 403',
    'No access',
    'Your account does not have permission to view this instance. Ask an admin to grant you access.',
    'lock',
    'Switch account',
);

export const ServerError = errorPage(
    'Error 500',
    'Something broke on our side',
    'The request could not be completed. The team has been notified — trying again usually helps.',
    'warning',
    'Try again',
);

export const Maintenance = errorPage(
    'Scheduled maintenance',
    'Back in a moment',
    'DocuHub is being updated. Document processing continues in the background; the UI returns shortly.',
    'clock',
    'Status page',
);
