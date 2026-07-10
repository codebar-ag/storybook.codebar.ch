import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Toaster from './Toaster.vue';
import Button from '../atoms/Button.vue';
import { push } from '../../composables/useToast';

const meta: Meta<typeof Toaster> = {
    title: 'Organisms/Toaster',
    component: Toaster,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
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
