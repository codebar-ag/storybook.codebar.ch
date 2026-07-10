import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
import Combobox from './Combobox.vue';
import Field from './Field.vue';

const cabinets = [
    { value: 'e_invoices', label: 'e_invoices' },
    { value: 'e_contracts', label: 'e_contracts' },
    { value: 'e_hr', label: 'e_hr' },
    { value: 'b_inbox', label: 'b_inbox (basket)' },
    { value: 'b_review', label: 'b_review (basket)' },
];

const meta: Meta<typeof Combobox> = {
    title: 'Molecules/Combobox',
    component: Combobox,
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
    render: () => ({
        components: { Combobox, Field },
        setup: () => ({ value: ref(''), cabinets }),
        template: `
            <div class="w-80 pb-48">
                <Field label="File cabinet" name="cabinet" hint="Type to filter, or enter a new cabinet name.">
                    <Combobox v-model="value" name="cabinet" :options="cabinets" placeholder="e_invoices" empty-message="No matching cabinet — a new one will be created." />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('combobox');

        // Typing filters the suggestions.
        await userEvent.type(input, 'e_');
        const listbox = await canvas.findByRole('listbox');
        await expect(within(listbox).getAllByRole('option')).toHaveLength(3);

        // Arrow + Enter picks a suggestion into the input.
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(input).toHaveValue('e_contracts');
        await waitFor(() => expect(canvas.queryByRole('listbox')).not.toBeInTheDocument());

        // Free text stays a valid value.
        await userEvent.clear(input);
        await userEvent.type(input, 'e_brand_new');
        await expect(input).toHaveValue('e_brand_new');
    },
};
