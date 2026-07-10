import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import InputNumber from './InputNumber.vue';
import Field from './Field.vue';

const meta: Meta<typeof InputNumber> = {
    title: 'Molecules/InputNumber',
    component: InputNumber,
};

export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
    render: () => ({
        components: { InputNumber, Field },
        setup: () => ({ value: ref(3) }),
        template: `
            <div class="w-56">
                <Field label="Retry attempts" name="retries" hint="Between 0 and 10.">
                    <InputNumber v-model="value" name="retries" :min="0" :max="10" />
                </Field>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByLabelText('Retry attempts');

        await expect(input).toHaveValue(3);
        await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
        await expect(input).toHaveValue(4);
        await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }));
        await expect(input).toHaveValue(2);
    },
};

export const States: Story = {
    render: () => ({
        components: { InputNumber, Field },
        setup: () => ({ value: ref(11) }),
        template: `
            <div class="w-56 space-y-4">
                <Field label="Invalid" name="inv" error="Must be 10 or fewer.">
                    <InputNumber v-model="value" name="inv" :max="10" invalid />
                </Field>
                <Field label="Disabled" name="dis">
                    <InputNumber :model-value="5" name="dis" disabled />
                </Field>
            </div>`,
    }),
};
