import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
import SearchableSelect from './SearchableSelect.vue';
import Field from './Field.vue';

const meta: Meta<typeof SearchableSelect> = {
    title: 'Molecules/SearchableSelect',
    component: SearchableSelect,
};

export default meta;
type Story = StoryObj<typeof SearchableSelect>;

export const Default: Story = {
    render: () => ({
        components: { SearchableSelect, Field },
        setup: () => ({
            selected: ref(''),
            options: [
                { value: 'prod', label: 'Production' },
                { value: 'staging', label: 'Staging' },
                { value: 'dev', label: 'Development' },
            ],
        }),
        template: `
            <div class="max-w-md pb-64">
                <Field label="Tenant" name="tenant">
                    <SearchableSelect
                        v-model="selected"
                        :options="options"
                        placeholder="Choose tenant"
                    />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('combobox');

        // Click opens the menu and focuses the search input.
        await userEvent.click(trigger);
        const search = await canvas.findByRole('searchbox');
        await waitFor(() => expect(search).toHaveFocus());

        // Typing filters the option list.
        await userEvent.type(search, 'sta');
        const listbox = canvas.getByRole('listbox');
        await waitFor(() => expect(within(listbox).getAllByRole('option')).toHaveLength(1));

        // ArrowDown + Enter selects the highlighted option and closes.
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(trigger).toHaveTextContent('Staging');
        await waitFor(() => expect(canvas.queryByRole('listbox')).not.toBeInTheDocument());

        // Escape closes the reopened menu without changing the selection.
        await userEvent.click(trigger);
        const reopenedSearch = await canvas.findByRole('searchbox');
        await waitFor(() => expect(reopenedSearch).toHaveFocus());
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(canvas.queryByRole('listbox')).not.toBeInTheDocument());
        await expect(trigger).toHaveTextContent('Staging');
    },
};

export const CabinetPicker: Story = {
    render: () => ({
        components: { SearchableSelect, Field },
        setup: () => ({
            cabinet: ref('e_invoices'),
            cabinets: [
                { value: 'e_invoices', label: 'e_invoices' },
                { value: 'e_contracts', label: 'e_contracts' },
                { value: 'e_hr', label: 'e_hr' },
                { value: 'b_inbox', label: 'b_inbox (basket)' },
                { value: 'b_review', label: 'b_review (basket)' },
            ],
        }),
        template: `
            <div class="max-w-md pb-72">
                <Field label="File cabinet" name="cabinet" hint="Baskets are staging trays, not archives.">
                    <SearchableSelect
                        v-model="cabinet"
                        :options="cabinets"
                        placeholder="Choose cabinet"
                        search-placeholder="Filter cabinets…"
                        empty-message="No matching cabinet."
                    />
                </Field>
            </div>`,
    }),
};
