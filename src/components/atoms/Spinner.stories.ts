import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Spinner from './Spinner.vue';

const meta: Meta<typeof Spinner> = {
    title: 'Atoms/Spinner',
    component: Spinner,
    argTypes: {
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
    args: { size: 'md', label: 'Loading…' },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => ({
        components: { Spinner },
        template: `
            <div class="flex items-center gap-4 text-ink">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
            </div>`,
    }),
};
