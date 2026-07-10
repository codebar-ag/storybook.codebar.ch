import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Textarea from './Textarea.vue';
import Field from '../molecules/Field.vue';

const meta: Meta<typeof Textarea> = {
    title: 'Atoms/Textarea',
    component: Textarea,
    argTypes: {
        rows: { control: { type: 'number', min: 2, max: 12 } },
        invalid: { control: 'boolean' },
    },
    args: { rows: 4, invalid: false },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    render: (args) => ({
        components: { Textarea, Field },
        setup: () => ({
            args,
            value: ref('Migrated from on-premise in March; the e_invoices cabinet was re-indexed afterwards.'),
        }),
        template: `
            <div class="max-w-md">
                <Field label="Notes" name="notes" hint="Internal only — not visible to the tenant.">
                    <Textarea v-model="value" name="notes" v-bind="args" />
                </Field>
            </div>`,
    }),
};

export const States: Story = {
    render: () => ({
        components: { Textarea, Field },
        setup: () => ({ value: ref('') }),
        template: `
            <div class="max-w-md space-y-4">
                <Field label="Rejection reason" name="reason" error="A reason is required.">
                    <Textarea v-model="value" name="reason" :invalid="true" />
                </Field>
                <Field label="Audit note" name="audit" hint="Locked after sign-off.">
                    <Textarea model-value="Reviewed by finance on 2026-06-30." name="audit" :rows="2" disabled />
                </Field>
            </div>`,
    }),
};
