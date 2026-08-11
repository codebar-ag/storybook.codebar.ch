import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
import SearchableSelect from './SearchableSelect.vue';
import Field from './Field.vue';

// Untyped Meta/StoryObj, same as DataTable: the component is generic over
// its option value, which Storybook's Meta<typeof X> inference can't
// represent. These stories drive the component from a template, not args,
// so nothing is lost.
const meta: Meta = {
    title: 'Molecules/SearchableSelect',
    component: SearchableSelect as unknown as Meta['component'],
};

export default meta;
type Story = StoryObj;

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

export const Clearable: Story = {
    render: () => ({
        components: { SearchableSelect, Field },
        setup: () => ({
            dialog: ref('d_default'),
            dialogs: [
                { value: 'd_default', label: 'Default store dialog' },
                { value: 'd_invoices', label: 'Invoice intake' },
            ],
        }),
        template: `
            <div class="max-w-md pb-64">
                <Field label="Store dialog" name="dialog" hint="Optional — leave empty to use the cabinet's default.">
                    <SearchableSelect
                        v-model="dialog"
                        :options="dialogs"
                        placeholder="Use default"
                        clearable
                        clear-label="Clear store dialog"
                    />
                </Field>
                <p data-testid="value">value: {{ dialog === '' ? '(empty)' : dialog }}</p>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('combobox');
        await expect(trigger).toHaveTextContent('Default store dialog');

        // Clearing empties the model, restores the placeholder, keeps the
        // menu closed, and hands focus back to the trigger — the ✕ it was on
        // has just unmounted.
        await userEvent.click(canvas.getByRole('button', { name: 'Clear store dialog' }));
        await expect(canvas.getByTestId('value')).toHaveTextContent('value: (empty)');
        await expect(trigger).toHaveTextContent('Use default');
        await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
        await expect(canvas.queryByRole('button', { name: 'Clear store dialog' })).not.toBeInTheDocument();
        await waitFor(() => expect(trigger).toHaveFocus());

        // A fresh pick brings the ✕ back.
        await userEvent.click(trigger);
        await userEvent.click(await canvas.findByRole('option', { name: 'Invoice intake' }));
        await expect(canvas.getByTestId('value')).toHaveTextContent('value: d_invoices');
        await expect(canvas.getByRole('button', { name: 'Clear store dialog' })).toBeInTheDocument();
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
