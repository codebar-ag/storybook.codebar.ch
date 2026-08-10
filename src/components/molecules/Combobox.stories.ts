import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { onMounted, ref } from 'vue';
import Combobox from './Combobox.vue';
import Field from './Field.vue';

const cabinets = [
    { value: 'e_invoices', label: 'e_invoices' },
    { value: 'e_contracts', label: 'e_contracts' },
    { value: 'e_hr', label: 'e_hr' },
    { value: 'b_inbox', label: 'b_inbox (basket)' },
    { value: 'b_review', label: 'b_review (basket)' },
];

// Untyped Meta/StoryObj, same as DataTable: the component is generic over
// its option value, which Storybook's Meta<typeof X> inference can't
// represent. These stories drive the component from a template, not args,
// so nothing is lost.
const meta: Meta = {
    title: 'Molecules/Combobox',
    component: Combobox as unknown as Meta['component'],
};

export default meta;
type Story = StoryObj;

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

/**
 * Options that arrive AFTER the field is focused — the remote-search shape,
 * where a consumer replaces `options` with each debounced response.
 *
 * This pins the focus handler opening unconditionally. With the previous
 * `open = filtered.length > 0` on focus, a click that landed before the first
 * response found an empty list, left the dropdown closed, and nothing ever
 * reopened it when the options arrived — the user saw a combobox that showed
 * nothing until they typed. Locally the response tends to win that race, which
 * is exactly why it shipped: the failure needed a slow network or a loaded CI
 * runner to show itself.
 */
export const RemoteOptions: Story = {
    render: () => ({
        components: { Combobox, Field },
        setup: () => {
            const value = ref('');
            const options = ref<{ value: string; label: string }[]>([]);

            // Long enough that the play function's click below reliably beats
            // it — the point is focus-before-options, not a realistic latency.
            onMounted(() => {
                setTimeout(() => {
                    options.value = cabinets;
                }, 600);
            });

            return { value, options };
        },
        template: `
            <div class="w-80 pb-48">
                <Field label="File cabinet" name="cabinet" hint="Options load remotely.">
                    <Combobox v-model="value" name="cabinet" :options="options" placeholder="e_invoices" />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByRole('combobox');

        // Focus while the list is still empty: no options, no empty-message,
        // so nothing may render yet — an open flag alone must not paint a box.
        await userEvent.click(input);
        await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();

        // The options land ~600ms later. No typing, no ArrowDown, no second
        // click — the already-focused field must show them on its own.
        const listbox = await canvas.findByRole('listbox', {}, { timeout: 3000 });
        await expect(within(listbox).getAllByRole('option')).toHaveLength(cabinets.length);

        // And the late-arriving list is live, not just visible.
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(input).toHaveValue('e_invoices');
    },
};
