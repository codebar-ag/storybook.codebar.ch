import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IdCell from './IdCell.vue';

const meta: Meta<typeof IdCell> = {
    title: 'Atoms/IdCell',
    component: IdCell,
    args: {
        id: 1902,
        uuid: '9f2b6c1e-4a7d-4c3b-8f5e-2d0a7b3dcb6d',
    },
};

export default meta;
type Story = StoryObj<typeof IdCell>;

// Renders `#{id}` with the uuid shortened to its first 8 characters below.
export const WithUuid: Story = {};

export const IdOnly: Story = {
    args: { id: 318, uuid: null },
};
