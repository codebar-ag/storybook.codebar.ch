import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Icon from '../components/atoms/Icon.vue';
import CopyButton from '../components/molecules/CopyButton.vue';
import Toaster from '../components/organisms/Toaster.vue';
import { icons } from '../icons';

const meta: Meta = {
    title: 'Foundations/Icons',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Registry: Story = {
    render: () => ({
        components: { Icon, CopyButton, Toaster },
        setup: () => ({ names: Object.keys(icons) }),
        template: `
            <div>
                <p class="text-sm text-muted mb-4 max-w-2xl">
                    Hand-maintained registry in <code class="text-ink">src/icons.ts</code> —
                    24×24 stroke paths, typed via <code class="text-ink">IconName</code>.
                    Click a name to copy it.
                </p>
                <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    <li
                        v-for="name in names"
                        :key="name"
                        class="flex items-center gap-2.5 rounded-control border border-line bg-surface px-3 py-2"
                    >
                        <Icon :name="name" size="md" class="shrink-0 text-ink" />
                        <span class="min-w-0 flex-1 truncate text-xs text-muted">{{ name }}</span>
                        <CopyButton :value="name" class="shrink-0 text-dim" />
                    </li>
                </ul>
                <Toaster />
            </div>`,
    }),
};
