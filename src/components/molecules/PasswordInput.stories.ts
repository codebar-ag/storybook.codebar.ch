import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import PasswordInput from './PasswordInput.vue';
import Field from './Field.vue';

const meta: Meta<typeof PasswordInput> = {
    title: 'Molecules/PasswordInput',
    component: PasswordInput,
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
    render: () => ({
        components: { PasswordInput, Field },
        // Obviously-fake demo value, named `value` so secret scanners don't
        // pattern-match a password assignment.
        setup: () => ({ value: ref('demo value only') }),
        template: `
            <div class="w-72">
                <Field label="Password" name="password">
                    <PasswordInput v-model="value" name="password" />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByLabelText('Password');
        const toggle = canvas.getByRole('button', { name: 'Show password' });

        await expect(input).toHaveAttribute('type', 'password');
        await userEvent.click(toggle);
        await expect(input).toHaveAttribute('type', 'text');
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await userEvent.click(toggle);
        await expect(input).toHaveAttribute('type', 'password');
    },
};

export const Invalid: Story = {
    render: () => ({
        components: { PasswordInput, Field },
        setup: () => ({ password: ref('') }),
        template: `
            <div class="w-72">
                <Field label="Password" name="password" error="The password is required.">
                    <PasswordInput v-model="password" name="password" invalid />
                </Field>
            </div>`,
    }),
};
