import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import { ref } from 'vue';
import Field from './Field.vue';
import Input from '../atoms/Input.vue';

const meta: Meta<typeof Field> = {
    title: 'Molecules/Field',
    component: Field,
    argTypes: {
        label: { control: 'text' },
        name: { control: 'text' },
        hint: { control: 'text' },
        required: { control: 'boolean' },
        error: { control: 'text' },
    },
    args: {
        label: 'Instance name',
        name: 'name',
        hint: 'Shown in the dashboard.',
        required: false,
        error: null,
    },
    render: (args) => ({
        components: { Field, Input },
        setup: () => ({ args, value: ref('DocuWare Luxor') }),
        template: `
            <div class="max-w-md">
                <Field v-bind="args">
                    <Input v-model="value" :name="args.name" :invalid="!!args.error" />
                </Field>
            </div>`,
    }),
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {};

export const Required: Story = {
    args: { label: 'Instance URL', name: 'instance_url', hint: 'The DocuWare cloud endpoint.', required: true },
};

// Field renders the error as <p id="{name}-error" role="alert"> and the
// control inside points aria-describedby at it when invalid.
export const WithError: Story = {
    render: () => ({
        components: { Field, Input },
        setup: () => ({ value: ref('') }),
        template: `
            <div class="max-w-md">
                <Field label="Instance URL" name="url" error="The URL is required.">
                    <Input v-model="value" name="url" type="url" :invalid="true" />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const input = canvas.getByRole('textbox');
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(input).toHaveAttribute('aria-describedby', 'url-error');

        const error = canvas.getByRole('alert');
        await expect(error).toBeVisible();
        await expect(error).toHaveAttribute('id', 'url-error');
        await expect(error).toHaveTextContent('The URL is required.');
    },
};
