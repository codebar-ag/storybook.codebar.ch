import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconBadge from './IconBadge.vue';

const meta: Meta<typeof IconBadge> = {
    title: 'Atoms/IconBadge',
    component: IconBadge,
    argTypes: {
        variant: {
            control: 'select',
            options: ['accent', 'danger', 'success', 'warning', 'neutral'],
        },
        size: { control: 'inline-radio', options: ['sm', 'md'] },
        shape: { control: 'inline-radio', options: ['circle', 'surface'] },
    },
    args: { icon: 'check', variant: 'accent', size: 'md', shape: 'circle' },
};

export default meta;
type Story = StoryObj<typeof IconBadge>;

export const Default: Story = {};

export const Variants: Story = {
    render: () => ({
        components: { IconBadge },
        template: `
            <div class="flex gap-4 items-center">
                <IconBadge icon="lock" variant="accent" />
                <IconBadge icon="x" variant="danger" />
                <IconBadge icon="check" variant="success" />
                <IconBadge icon="warning" variant="warning" />
                <IconBadge icon="server" variant="neutral" />
            </div>`,
    }),
};

export const Sizes: Story = {
    render: () => ({
        components: { IconBadge },
        template: `
            <div class="flex gap-4 items-center">
                <IconBadge icon="check" size="sm" />
                <IconBadge icon="check" size="md" />
            </div>`,
    }),
};

export const Shapes: Story = {
    render: () => ({
        components: { IconBadge },
        template: `
            <div class="flex gap-4 items-center">
                <IconBadge icon="lock" shape="circle" />
                <IconBadge icon="lock" shape="surface" />
            </div>`,
    }),
};
