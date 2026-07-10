import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Badge from './Badge.vue';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Badge',
    component: Badge,
    argTypes: {
        variant: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
        size: { control: 'inline-radio', options: ['sm', 'md'] },
    },
    args: { variant: 'neutral', size: 'md' },
    render: (args) => ({
        components: { Badge },
        setup: () => ({ args }),
        template: '<Badge v-bind="args">Badge</Badge>',
    }),
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const All: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge variant="neutral">neutral</Badge>
                <Badge variant="info">info</Badge>
                <Badge variant="success">success</Badge>
                <Badge variant="warning">warning</Badge>
                <Badge variant="danger">danger</Badge>
            </div>`,
    }),
};

// The pre-1.3 color names keep rendering (mapped in helpers/tone.ts) until the
// next major release; this story is the living proof + migration reference.
export const LegacyAliases: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge variant="gray">gray → neutral</Badge>
                <Badge variant="blue">blue → info</Badge>
                <Badge variant="green">green → success</Badge>
                <Badge variant="amber">amber → warning</Badge>
                <Badge variant="red">red → danger</Badge>
            </div>`,
    }),
};
