import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FullscreenPanel from './FullscreenPanel.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof FullscreenPanel> = {
    title: 'Molecules/FullscreenPanel',
    component: FullscreenPanel,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof FullscreenPanel>;

export const Default: Story = {
    render: () => ({
        components: { FullscreenPanel, Button },
        template: `<FullscreenPanel v-slot="{ isFullscreen, toggle }">
            <div class="flex items-center justify-between border-b border-line pb-2 mb-2">
                <span class="text-sm text-muted">{{ isFullscreen ? 'Fullscreen' : 'Inline' }}</span>
                <Button size="sm" variant="secondary" @click="toggle">
                    {{ isFullscreen ? 'Exit fullscreen' : 'Expand' }}
                </Button>
            </div>
            <p class="text-sm text-ink">Editor content lives in the default slot.</p>
        </FullscreenPanel>`,
    }),
};
