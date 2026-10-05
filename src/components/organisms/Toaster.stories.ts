import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Toaster from './Toaster.vue';
import Button from '../atoms/Button.vue';
import { push } from '../../composables/useToast';

const meta: Meta<typeof Toaster> = {
    title: 'Organisms/Toaster',
    component: Toaster,
    parameters: { layout: 'padded' },
    argTypes: {
        maxWidth: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl', '2xl'],
        },
    },
    args: { maxWidth: 'sm' },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
    render: (args) => ({
        components: { Toaster, Button },
        setup: () => ({
            args,
            success: () => push({ message: 'Instance saved.', type: 'success' }),
            error: () => push({ message: 'Could not reach DocuWare.', type: 'error' }),
            info: () => push({ message: 'Copied to clipboard', type: 'info' }),
        }),
        template: `
            <div class="flex gap-2">
                <Button variant="secondary" @click="success">Success</Button>
                <Button variant="secondary" @click="error">Error</Button>
                <Button variant="secondary" @click="info">Info</Button>
                <Toaster v-bind="args" />
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Toasts render in a fixed overlay; query the whole document.
        const body = within(canvasElement.ownerDocument.body);

        await userEvent.click(canvas.getByRole('button', { name: 'Error' }));
        const toast = await body.findByText('Could not reach DocuWare.');
        // The toast fades in; wait out the enter transition.
        await waitFor(() => expect(toast).toBeVisible());

        // Manual dismiss clears it immediately (auto-dismiss timing stays in
        // the Playwright suite).
        await userEvent.click(body.getByRole('button', { name: 'Dismiss' }));
        await waitFor(() =>
            expect(body.queryByText('Could not reach DocuWare.')).not.toBeInTheDocument(),
        );
    },
};

// Long flash messages (e.g. echoing the submitted email back) stay on one or
// two lines instead of wrapping into a tall narrow block.
export const Wide: Story = {
    args: { maxWidth: 'xl' },
    render: (args) => ({
        components: { Toaster, Button },
        setup: () => ({
            args,
            success: () =>
                push({
                    message:
                        'If sebastian.burgin@codebar.ch is registered, you will receive a login link shortly.',
                    type: 'success',
                }),
        }),
        template: `
            <div>
                <Button variant="secondary" @click="success">Success</Button>
                <Toaster v-bind="args" />
            </div>`,
    }),
};

// No play function on purpose: tests/interactions.spec.ts drives this story
// for the auto-dismiss *timing*, which would race the play above on Default.
export const AutoDismiss: Story = {
    render: () => ({
        components: { Toaster, Button },
        setup: () => ({
            success: () => push({ message: 'Instance saved.', type: 'success' }),
        }),
        template: `
            <div>
                <Button variant="secondary" @click="success">Success</Button>
                <Toaster />
            </div>`,
    }),
};

// At the top, with a title, and sticky: an error that waits for its ✕
// (duration 0) — how an app surfaces a flashed server error.
export const TopWithTitle: Story = {
    render: () => ({
        components: { Toaster, Button },
        setup: () => ({
            error: () => push({ title: 'Link no longer valid', message: 'Request a new sign-in link.', type: 'error', duration: 0 }),
        }),
        template: `
            <div>
                <Button variant="secondary" @click="error">Sticky error</Button>
                <Toaster position="top" max-width="lg" />
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);

        await userEvent.click(canvas.getByRole('button', { name: 'Sticky error' }));
        const toast = await body.findByRole('alert');
        await waitFor(() => expect(toast).toBeVisible());
        await expect(toast).toHaveTextContent('Link no longer valid');

        await userEvent.click(body.getByRole('button', { name: 'Dismiss' }));
        await waitFor(() => expect(body.queryByRole('alert')).not.toBeInTheDocument());
    },
};
