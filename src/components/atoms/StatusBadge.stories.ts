import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StatusBadge from './StatusBadge.vue';

const meta: Meta<typeof StatusBadge> = {
    title: 'Atoms/StatusBadge',
    component: StatusBadge,
    argTypes: {
        variant: {
            control: 'select',
            options: ['neutral', 'info', 'success', 'warning', 'danger'],
        },
        category: {
            control: 'select',
            options: [undefined, 'indigo', 'purple', 'magenta'],
        },
    },
    args: { variant: 'success', label: 'Connected', dot: true },
    render: (args) => ({
        components: { StatusBadge },
        setup: () => ({ args }),
        template: '<StatusBadge v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Success: Story = {};
export const Warning: Story = { args: { variant: 'warning', label: 'Pending' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Error' } };

// Instance status badges: the consuming app maps its own enum → { variant, label }.
export const InstanceStatuses: Story = {
    render: () => ({
        components: { StatusBadge },
        template: `<div class="flex gap-2">
            <StatusBadge variant="success" label="Connected" :dot="true" />
            <StatusBadge variant="warning" label="Pending" :dot="true" />
            <StatusBadge variant="danger" label="Error" :dot="true" />
            <StatusBadge variant="neutral" label="Disabled" :dot="true" />
        </div>`,
    }),
};

// The categorical vocabulary on the same component. `category` is a sibling of
// `variant`, not a value of it — pass one or the other. The dot inherits the
// category colour through `bg-current`, so it needs no extra token.
// Rendered explicitly rather than via `args`, so the meta's `variant: 'success'`
// is not merged in alongside `category` — the two props are mutually exclusive
// and passing both warns.
export const Categorical: Story = {
    render: () => ({
        components: { StatusBadge },
        template: `<div class="flex flex-wrap gap-2">
            <StatusBadge category="indigo" label="Enabled" :dot="true" />
            <StatusBadge category="purple" label="Overridden" :dot="true" />
            <StatusBadge category="magenta" label="Duplicate" :dot="true" />
        </div>`,
    }),
};

// The states this vocabulary exists for. None of them is a severity, and every
// one of them used to be rendered on the severity ramp: "enabled" as success,
// "duplicate" and "overridden" as info, "older version" as warning.
export const NonSeverityStates: Story = {
    render: () => ({
        components: { StatusBadge },
        template: `<div class="flex flex-wrap gap-2">
            <StatusBadge category="indigo" label="Enabled" :dot="true" />
            <StatusBadge variant="neutral" label="Disabled" :dot="true" />
            <StatusBadge category="purple" label="Overridden" />
            <StatusBadge category="magenta" label="Duplicate" />
            <StatusBadge category="indigo" label="Published" />
            <StatusBadge variant="neutral" label="Draft" />
        </div>`,
    }),
};

// Severity and identity side by side — the distinction the two props encode.
// A run that failed is a status; the kind of node that ran is not.
export const SeverityAndIdentityTogether: Story = {
    render: () => ({
        components: { StatusBadge },
        template: `<div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-2xs text-dim w-20">Severity</span>
                <StatusBadge variant="success" label="Succeeded" :dot="true" />
                <StatusBadge variant="warning" label="Retrying" :dot="true" />
                <StatusBadge variant="danger" label="Failed" :dot="true" />
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-2xs text-dim w-20">Identity</span>
                <StatusBadge category="indigo" label="Trigger" />
                <StatusBadge category="purple" label="Agent" />
                <StatusBadge category="magenta" label="Gateway" />
            </div>
        </div>`,
    }),
};

// `purple` is a deprecated legacy alias (rides `info`) for non-severity
// statuses like "seen this before" — e.g. a duplicate webhook delivery.
// `category="magenta"` (or any category) is the replacement; the alias itself
// still resolves to `info` and still warns.
export const LegacyPurpleAlias: Story = {
    args: { variant: 'purple', label: 'Duplicate', dot: false },
};
