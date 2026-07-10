import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Badge from './Badge.vue';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'select', options: ['gray', 'blue', 'green', 'amber', 'red'] },
        size: { control: 'inline-radio', options: ['sm', 'md'] },
    },
    args: { variant: 'gray', size: 'md' },
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
                <Badge variant="gray">gray</Badge>
                <Badge variant="blue">blue</Badge>
                <Badge variant="green">green</Badge>
                <Badge variant="amber">amber</Badge>
                <Badge variant="red">red</Badge>
            </div>`,
    }),
};
