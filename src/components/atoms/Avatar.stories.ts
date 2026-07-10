import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Avatar from './Avatar.vue';

const meta: Meta<typeof Avatar> = {
    title: 'Atoms/Avatar',
    component: Avatar,
    argTypes: {
        size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
    args: { name: 'Max Mustermann', size: 'md' },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {};

export const Sizes: Story = {
    render: () => ({
        components: { Avatar },
        template: `
            <div class="flex items-center gap-3">
                <Avatar name="Max Mustermann" size="sm" />
                <Avatar name="Max Mustermann" size="md" />
                <Avatar name="Max Mustermann" size="lg" />
            </div>`,
    }),
};

export const WithImage: Story = {
    args: {
        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><rect width="36" height="36" fill="%2318181b"/><circle cx="18" cy="14" r="6" fill="%23f3f3f5"/><ellipse cx="18" cy="30" rx="11" ry="8" fill="%23f3f3f5"/></svg>',
    },
};
