import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import PinInput from './PinInput.vue';

const meta: Meta<typeof PinInput> = {
    title: 'Molecules/PinInput',
    component: PinInput,
};

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = {
    render: (args) => ({
        components: { PinInput },
        setup: () => ({ code: ref(''), onComplete: args.onComplete ?? (() => {}) }),
        template: '<PinInput v-model="code" :length="6" @complete="onComplete" />',
    }),
    args: { onComplete: fn() },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const cells = canvas.getAllByRole('textbox');
        await expect(cells).toHaveLength(6);

        // Typing auto-advances; filling the last cell fires `complete`.
        await userEvent.click(cells[0]);
        await userEvent.keyboard('482913');
        await expect(cells[5]).toHaveValue('3');
        await expect(args.onComplete).toHaveBeenCalledWith('482913');

        // Backspace on an empty cell retreats and clears the previous one.
        await userEvent.keyboard('{Backspace}{Backspace}');
        await expect(cells[4]).toHaveValue('');
    },
};

export const Invalid: Story = {
    render: () => ({
        components: { PinInput },
        setup: () => ({ code: ref('11111') }),
        template: `
            <div class="space-y-2">
                <PinInput v-model="code" :length="6" invalid name="otp" />
                <p id="otp-error" role="alert" class="text-xs text-danger">The code has expired — request a new one.</p>
            </div>`,
    }),
};
