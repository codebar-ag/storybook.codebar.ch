import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type { VNode } from 'vue';
import Tab from './Tab.vue';

const meta: Meta<typeof Tab> = {
    title: 'Atoms/Tab',
    component: Tab,
    args: { href: '#', active: false },
    render: (args) => ({
        components: { Tab },
        setup: () => ({ args }),
        template: '<Tab v-bind="args">Overview</Tab>',
    }),
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {};

// The active tab is filled, elevated, and carries aria-current="page".
export const Active: Story = { args: { active: true } };

export const TabBar: Story = {
    render: () => ({
        components: { Tab },
        template: `<nav class="inline-flex items-center gap-1 rounded-control border border-line bg-surface-2 p-1">
            <Tab href="#" :active="true">Overview</Tab>
            <Tab href="#">Members</Tab>
            <Tab href="#">Settings</Tab>
        </nav>`,
    }),
};

// `as` accepts a link component (e.g. Inertia's Link) for SPA navigation;
// Storybook stands in with a bare functional stub.
export const AsLinkComponent: Story = {
    render: () => ({
        components: { Tab },
        setup: () => ({
            stub: (props: { href: string }, { slots }: { slots: { default?: () => VNode[] } }) =>
                h('a', { href: props.href, 'data-router-link': '' }, slots.default?.()),
        }),
        template: '<Tab href="#" :as="stub" :active="true">Router-aware tab</Tab>',
    }),
};
