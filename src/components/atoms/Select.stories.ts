import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import Select from './Select.vue';
import Field from '../molecules/Field.vue';

const environments = [
    { value: 'prod', label: 'Production' },
    { value: 'staging', label: 'Staging' },
];

const meta: Meta<typeof Select> = {
    title: 'Atoms/Select',
    component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    render: () => ({
        components: { Select, Field },
        setup: () => ({ value: ref('prod'), environments }),
        template: `
            <div class="max-w-md">
                <Field label="Environment" name="env">
                    <Select v-model="value" name="env" :options="environments" />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const select = canvas.getByLabelText('Environment');

        await expect(select).toHaveValue('prod');
        await userEvent.selectOptions(select, 'staging');
        await expect(select).toHaveValue('staging');
    },
};

export const WithPlaceholder: Story = {
    render: () => ({
        components: { Select, Field },
        setup: () => ({
            value: ref(''),
            cabinets: [
                { value: 'e_invoices', label: 'e_invoices' },
                { value: 'e_contracts', label: 'e_contracts' },
                { value: 'e_hr', label: 'e_hr' },
            ],
        }),
        template: `
            <div class="max-w-md">
                <Field label="File cabinet" name="cabinet" hint="Where new documents are filed.">
                    <Select v-model="value" name="cabinet" :options="cabinets" placeholder="Choose a cabinet" />
                </Field>
            </div>`,
    }),
};

export const States: Story = {
    render: () => ({
        components: { Select, Field },
        setup: () => ({ value: ref(''), environments }),
        template: `
            <div class="max-w-md space-y-4">
                <Field label="Environment" name="env_invalid" error="Pick an environment.">
                    <Select v-model="value" name="env_invalid" :options="environments" placeholder="Choose…" :invalid="true" />
                </Field>
                <Field label="Environment" name="env_disabled" hint="Locked by your subscription.">
                    <Select model-value="prod" name="env_disabled" :options="environments" disabled />
                </Field>
            </div>`,
    }),
};
