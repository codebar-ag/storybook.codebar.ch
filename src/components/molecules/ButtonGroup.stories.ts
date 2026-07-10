import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ButtonGroup from './ButtonGroup.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof ButtonGroup> = {
    title: 'Molecules/ButtonGroup',
    component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

// Row of related actions: shared gap, equal heights.
export const Default: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        template: `<ButtonGroup>
            <Button variant="secondary">Edit</Button>
            <Button variant="ghost">Duplicate</Button>
            <Button variant="danger">Delete</Button>
        </ButtonGroup>`,
    }),
};

export const RowActions: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        template: `<div class="flex items-center justify-between max-w-lg rounded-control border border-line bg-surface px-4 py-3">
            <span class="text-sm text-ink">invoice-extraction</span>
            <ButtonGroup>
                <Button variant="ghost" size="sm">Configure</Button>
                <Button variant="secondary" size="sm">Run</Button>
            </ButtonGroup>
        </div>`,
    }),
};
