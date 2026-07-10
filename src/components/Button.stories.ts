import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Button from './Button.vue';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger', 'subtle', 'cta'],
        },
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
    args: { variant: 'primary', size: 'md' },
    render: (args) => ({
        components: { Button },
        setup: () => ({ args }),
        template: '<Button v-bind="args">Button</Button>',
    }),
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const Cta: Story = { args: { variant: 'cta' } };

export const AllVariants: Story = {
    render: () => ({
        components: { Button },
        template: `
            <div class="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="subtle">Subtle</Button>
                <Button variant="cta">CTA</Button>
            </div>`,
    }),
};
