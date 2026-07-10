import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import Toggle from './Toggle.vue';

const meta: Meta<typeof Toggle> = {
    title: 'Atoms/Toggle',
    component: Toggle,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
    render: () => ({
        components: { Toggle },
        setup: () => ({ enabled: ref(true) }),
        template:
            '<Toggle v-model="enabled" label="Enable flow" description="Process incoming documents." />',
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const checkbox = canvas.getByRole('checkbox');

        await expect(checkbox).toBeChecked();
        await userEvent.click(checkbox);
        await expect(checkbox).not.toBeChecked();
        await userEvent.click(checkbox);
        await expect(checkbox).toBeChecked();
    },
};
