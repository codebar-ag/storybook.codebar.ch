import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import Accordion from './Accordion.vue';
import AccordionItem from './AccordionItem.vue';

const meta: Meta<typeof Accordion> = {
    title: 'Molecules/Accordion',
    component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
    render: () => ({
        components: { Accordion, AccordionItem },
        template: `
            <Accordion class="w-96">
                <AccordionItem title="What is Intellix trust?">
                    A per-document confidence level (Red → Yellow → Green) describing how sure the auto-indexing is.
                </AccordionItem>
                <AccordionItem title="When are documents filed automatically?">
                    Green documents can be filed unattended; Yellow and Red wait for review in the basket.
                </AccordionItem>
                <AccordionItem title="Can I undo a filing?">
                    Yes — documents can be moved back to a basket or restored from the trash.
                </AccordionItem>
            </Accordion>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const first = canvas.getByRole('button', { name: 'What is Intellix trust?' });
        const second = canvas.getByRole('button', { name: 'When are documents filed automatically?' });

        await expect(first).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(first);
        await expect(first).toHaveAttribute('aria-expanded', 'true');
        await expect(canvas.getByText(/per-document confidence/)).toBeVisible();

        // Single mode: opening another item closes the first.
        await userEvent.click(second);
        await expect(second).toHaveAttribute('aria-expanded', 'true');
        await expect(first).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(second);
        await expect(second).toHaveAttribute('aria-expanded', 'false');
    },
};

export const Multiple: Story = {
    render: () => ({
        components: { Accordion, AccordionItem },
        template: `
            <Accordion multiple :model-value="['Cabinets', 'Baskets']" class="w-96">
                <AccordionItem title="Cabinets">Permanent archives documents are filed into.</AccordionItem>
                <AccordionItem title="Baskets">Staging inboxes where incoming documents land.</AccordionItem>
                <AccordionItem title="Dialogs">Search and store masks defined per cabinet.</AccordionItem>
            </Accordion>`,
    }),
};
