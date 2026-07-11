import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
import Modal from './Modal.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof Modal> = {
    title: 'Organisms/Modal',
    component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
    render: () => ({
        components: { Modal, Button },
        setup: () => ({ open: ref(false) }),
        template: `
            <div>
                <Button @click="open = true">Open modal</Button>
                <Modal v-model="open" title="Confirm" description="This action cannot be undone.">
                    <p class="text-sm text-muted">Are you sure you want to continue?</p>
                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <Button variant="ghost" @click="open = false">Cancel</Button>
                            <Button variant="danger" @click="open = false">Delete</Button>
                        </div>
                    </template>
                </Modal>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // The dialog teleports to <body>, so query the whole document.
        const body = within(canvasElement.ownerDocument.body);

        await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
        const dialog = await body.findByRole('dialog');
        // The dialog fades in; wait out the enter transition.
        await waitFor(() => expect(dialog).toBeVisible());

        // Focus is trapped: initial focus lands on the first focusable element
        // (the Close button), and Tab cycles Close → Cancel → Delete → Close.
        const close = body.getByRole('button', { name: 'Close' });
        await waitFor(() => expect(close).toHaveFocus());
        await userEvent.tab();
        await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus();
        await userEvent.tab();
        await expect(body.getByRole('button', { name: 'Delete' })).toHaveFocus();
        await userEvent.tab();
        await expect(close).toHaveFocus();

        // Escape closes and focus returns to the opener.
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
        await expect(canvas.getByRole('button', { name: 'Open modal' })).toHaveFocus();
    },
};

export const FullSize: Story = {
    render: () => ({
        components: { Modal, Button },
        setup: () => ({ open: ref(false), rows: Array.from({ length: 60 }, (_, i) => `Row ${i + 1}`) }),
        template: `
            <div>
                <Button @click="open = true">Open full modal</Button>
                <Modal v-model="open" size="full" title="Pick an item">
                    <ul class="flex flex-col gap-2">
                        <li v-for="row in rows" :key="row" class="text-sm text-muted">{{ row }}</li>
                    </ul>
                    <template #footer>
                        <Button variant="primary" @click="open = false">Done</Button>
                    </template>
                </Modal>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);

        await userEvent.click(canvas.getByRole('button', { name: 'Open full modal' }));
        const dialog = await body.findByRole('dialog');
        await waitFor(() => expect(dialog).toBeVisible());

        // The panel fills the viewport (minus the p-4 overlay inset) and the
        // body scrolls instead of growing the dialog: the footer stays visible.
        const panel = dialog.querySelector<HTMLElement>('[tabindex="-1"]');
        await expect(panel).not.toBeNull();
        const inset = 2 * 16;
        await waitFor(() =>
            expect(Math.round(panel!.getBoundingClientRect().height)).toBe(
                Math.round(dialog.getBoundingClientRect().height - inset),
            ),
        );
        await expect(body.getByRole('button', { name: 'Done' })).toBeVisible();

        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    },
};
