import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import Checkbox from './Checkbox.vue';

const meta: Meta<typeof Checkbox> = {
    title: 'Atoms/Checkbox',
    component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    render: () => ({
        components: { Checkbox },
        setup: () => ({ value: ref(false) }),
        template: `
            <div class="max-w-md">
                <Checkbox v-model="value" name="agree" description="Required to proceed.">I accept the terms</Checkbox>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const checkbox = canvas.getByRole('checkbox');

        await expect(checkbox).not.toBeChecked();
        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();
    },
};

export const States: Story = {
    render: () => ({
        components: { Checkbox },
        setup: () => ({ checked: ref(true), invalid: ref(false) }),
        template: `
            <div class="max-w-md space-y-1">
                <Checkbox v-model="checked" name="notify" description="Sends a mail per stored document.">Notify on new e_invoices documents</Checkbox>
                <Checkbox v-model="invalid" name="agree_invalid" :invalid="true" description="You must accept before saving.">I accept the terms</Checkbox>
                <Checkbox :model-value="true" name="sso" disabled description="Enforced by your subscription.">Single sign-on</Checkbox>
            </div>`,
    }),
};
