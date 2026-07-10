import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Kbd from './Kbd.vue';

const meta: Meta<typeof Kbd> = {
    title: 'Atoms/Kbd',
    component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
    render: () => ({
        components: { Kbd },
        template: `
            <p class="text-sm text-muted">
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, <Kbd>Esc</Kbd> to close.
            </p>`,
    }),
};
