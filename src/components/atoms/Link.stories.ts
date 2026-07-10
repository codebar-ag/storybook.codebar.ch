import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type { VNode } from 'vue';
import Link from './Link.vue';

const meta: Meta<typeof Link> = {
    title: 'Atoms/Link',
    component: Link,
    argTypes: {
        tone: { control: 'inline-radio', options: ['default', 'muted', 'accent'] },
    },
    args: { href: '#', tone: 'default' },
    render: (args) => ({
        components: { Link },
        setup: () => ({ args }),
        template: '<Link v-bind="args">MCP server documentation</Link>',
    }),
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};
export const Muted: Story = { args: { tone: 'muted' } };
export const Accent: Story = { args: { tone: 'accent' } };

export const Tones: Story = {
    render: () => ({
        components: { Link },
        template: `<p class="text-sm text-muted">
            A <Link href="#">default link</Link>, a <Link href="#" tone="muted">muted link</Link>,
            and an <Link href="#" tone="accent">accent link</Link> inside running text.
        </p>`,
    }),
};

// `as` accepts a link component (e.g. Inertia's Link) so consuming apps get
// client-side visits without this package ever depending on a router.
// Storybook stands in with a bare functional stub.
export const AsLinkComponent: Story = {
    render: () => ({
        components: { Link },
        setup: () => ({
            stub: (props: { href: string }, { slots }: { slots: { default?: () => VNode[] } }) =>
                h('a', { href: props.href, 'data-router-link': '' }, slots.default?.()),
        }),
        template: '<Link href="#" :as="stub">Router-aware link</Link>',
    }),
};
