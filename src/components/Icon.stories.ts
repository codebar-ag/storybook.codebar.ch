import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Icon from './Icon.vue';
import { icons } from '../icons';

const meta: Meta<typeof Icon> = {
    title: 'Atoms/Icon',
    component: Icon,
    tags: ['autodocs'],
    argTypes: {
        name: { control: 'select', options: Object.keys(icons) },
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
    args: { name: 'sparkles', size: 'md' },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Single: Story = {};

export const Gallery: Story = {
    render: () => ({
        components: { Icon },
        setup: () => ({ names: Object.keys(icons) }),
        template: `
            <div class="grid grid-cols-4 gap-4 text-ink">
                <div v-for="n in names" :key="n" class="flex flex-col items-center gap-1.5 text-2xs text-dim">
                    <Icon :name="n" size="md" />
                    <span>{{ n }}</span>
                </div>
            </div>`,
    }),
};
