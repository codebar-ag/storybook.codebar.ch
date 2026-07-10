import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type { VNode } from 'vue';
import Breadcrumbs from './Breadcrumbs.vue';

const meta: Meta<typeof Breadcrumbs> = {
    title: 'Molecules/Breadcrumbs',
    component: Breadcrumbs,
    args: {
        items: [
            { label: 'Instances', href: '#' },
            { label: 'Mustermann AG', href: '#' },
            { label: 'File cabinets' },
        ],
    },
    render: (args) => ({
        components: { Breadcrumbs },
        setup: () => ({ args }),
        template: '<Breadcrumbs v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// The last crumb is always static text, de-emphasized and marked
// aria-current="page" — even when it carries an href.
export const Default: Story = {};

export const SingleItem: Story = {
    args: { items: [{ label: 'Dashboard' }] },
};

export const LongTrail: Story = {
    args: {
        items: [
            { label: 'Instances', href: '#' },
            { label: 'Mustermann AG', href: '#' },
            { label: 'File cabinets', href: '#' },
            { label: 'Invoices', href: '#' },
            { label: 'INV-2026-00841' },
        ],
    },
};

// `as` accepts a link component (e.g. Inertia's Link) for SPA navigation on
// interior crumbs; Storybook stands in with a bare functional stub.
export const AsLinkComponent: Story = {
    render: () => ({
        components: { Breadcrumbs },
        setup: () => ({
            items: [
                { label: 'Instances', href: '#' },
                { label: 'Mustermann AG', href: '#' },
                { label: 'File cabinets' },
            ],
            stub: (props: { href: string }, { slots }: { slots: { default?: () => VNode[] } }) =>
                h('a', { href: props.href, 'data-router-link': '' }, slots.default?.()),
        }),
        template: '<Breadcrumbs :items="items" :as="stub" />',
    }),
};
