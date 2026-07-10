import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Input from './Input.vue';
import Field from '../molecules/Field.vue';

const meta: Meta<typeof Input> = {
    title: 'Atoms/Input',
    component: Input,
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'url', 'search', 'password'],
        },
        invalid: { control: 'boolean' },
    },
    args: { type: 'text', invalid: false },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    render: (args) => ({
        components: { Input, Field },
        setup: () => ({ args, value: ref('DocuWare Luxor') }),
        template: `
            <div class="max-w-md">
                <Field label="Instance name" name="name" hint="Shown in the dashboard.">
                    <Input v-model="value" name="name" v-bind="args" />
                </Field>
            </div>`,
    }),
};

export const Types: Story = {
    render: () => ({
        components: { Input, Field },
        setup: () => ({
            url: ref('https://luxor.docuware.cloud'),
            email: ref('info@codebar.ch'),
            query: ref(''),
        }),
        template: `
            <div class="max-w-md space-y-4">
                <Field label="Instance URL" name="instance_url" hint="The DocuWare cloud endpoint.">
                    <Input v-model="url" name="instance_url" type="url" />
                </Field>
                <Field label="Notification e-mail" name="email">
                    <Input v-model="email" name="email" type="email" />
                </Field>
                <Field label="Search cabinets" name="q">
                    <Input v-model="query" name="q" type="search" placeholder="e_invoices" />
                </Field>
            </div>`,
    }),
};

export const States: Story = {
    render: () => ({
        components: { Input, Field },
        setup: () => ({ value: ref('') }),
        template: `
            <div class="max-w-md space-y-4">
                <Field label="Instance URL" name="url" error="The URL is required.">
                    <Input v-model="value" name="url" type="url" :invalid="true" />
                </Field>
                <Field label="Cabinet id" name="cabinet_id" hint="Assigned by DocuWare; read-only.">
                    <Input model-value="fc-3f8a-e_invoices" name="cabinet_id" disabled />
                </Field>
            </div>`,
    }),
};
