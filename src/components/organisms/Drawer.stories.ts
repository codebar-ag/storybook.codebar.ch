import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
import Drawer from './Drawer.vue';
import Button from '../atoms/Button.vue';
import DescriptionList from '../molecules/DescriptionList.vue';
import DescriptionItem from '../molecules/DescriptionItem.vue';

const meta: Meta<typeof Drawer> = {
    title: 'Organisms/Drawer',
    component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    render: () => ({
        components: { Drawer, Button, DescriptionList, DescriptionItem },
        setup: () => ({ open: ref(false) }),
        template: `
            <div>
                <Button @click="open = true">Show document details</Button>
                <Drawer v-model="open" title="Invoice 2026-0142" description="Filed to e_invoices · Intellix trust: Green">
                    <DescriptionList>
                        <DescriptionItem label="Company">Mustermann AG</DescriptionItem>
                        <DescriptionItem label="Amount">CHF 1'240.50</DescriptionItem>
                        <DescriptionItem label="Status">Filed</DescriptionItem>
                    </DescriptionList>
                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <Button variant="ghost" @click="open = false">Close</Button>
                            <Button variant="primary" @click="open = false">Open in DocuWare</Button>
                        </div>
                    </template>
                </Drawer>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);

        await userEvent.click(canvas.getByRole('button', { name: 'Show document details' }));
        const dialog = await body.findByRole('dialog');
        await waitFor(() => expect(dialog).toBeVisible());

        // Focus lands inside the trapped panel.
        await waitFor(() =>
            expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(true),
        );

        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    },
};

// A drawer opened from far down a long page: the page stays put behind it and
// comes back at the same scroll position. Exercised by tests/scroll-lock.spec.ts.
export const OverLongPage: Story = {
    render: () => ({
        components: { Drawer, Button },
        setup: () => ({ open: ref(false) }),
        template: `
            <div>
                <div class="h-[150vh] text-sm text-muted">Scroll down to open the drawer.</div>
                <Button @click="open = true">Open drawer</Button>
                <div class="h-[150vh]" />
                <Drawer v-model="open" title="Details">
                    <p class="text-sm text-muted">The page behind this drawer does not scroll.</p>
                </Drawer>
            </div>`,
    }),
};
