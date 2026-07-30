import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
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
        setup: () => ({ args, value: ref('DocuWare Mustermann') }),
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
            url: ref('https://mustermann.docuware.cloud'),
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

export const CredentialAutocomplete: Story = {
    render: () => ({
        components: { Input, Field },
        setup: () => ({ email: ref(''), query: ref('') }),
        template: `
            <div class="max-w-md space-y-4">
                <Field label="Email" name="login_email">
                    <Input v-model="email" name="login_email" type="email" autocomplete="username" />
                </Field>
                <Field label="Search cabinets" name="q_no_autocomplete">
                    <Input v-model="query" name="q_no_autocomplete" type="search" />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // An explicit autocomplete is a credential signal: password managers
        // must be allowed to see it, and their own value must survive.
        const email = canvas.getByLabelText('Email');
        await expect(email).toHaveAttribute('autocomplete', 'username');
        await expect(email).not.toHaveAttribute('data-1p-ignore');
        await expect(email).not.toHaveAttribute('data-lpignore');

        // No autocomplete given: this is a plain field, keep it hidden from
        // password manager suggestions.
        const query = canvas.getByLabelText('Search cabinets');
        await expect(query).toHaveAttribute('autocomplete', 'off');
        await expect(query).toHaveAttribute('data-1p-ignore');
        await expect(query).toHaveAttribute('data-lpignore', 'true');
    },
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
