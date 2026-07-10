import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type { VNode } from 'vue';
import Button from './Button.vue';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
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

// `as` accepts a component (e.g. Inertia's Link) for client-side navigation;
// Storybook stands in with a bare functional stub.
export const AsLinkComponent: Story = {
    render: () => ({
        components: { Button },
        setup: () => ({
            stub: (props: { href: string }, { slots }: { slots: { default?: () => VNode[] } }) =>
                h('a', { href: props.href, 'data-router-link': '' }, slots.default?.()),
        }),
        template: '<Button :as="stub" href="#" variant="secondary">Router-aware button</Button>',
    }),
};

// `loading` swaps in a spinner without collapsing the button's width and
// blocks interaction (disabled + aria-busy).
export const Loading: Story = {
    args: { loading: true },
};

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
