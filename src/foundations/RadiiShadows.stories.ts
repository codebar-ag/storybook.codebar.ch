import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { radii, shadows } from './tokenCatalog';

const meta: Meta = {
    title: 'Foundations/Radii & Shadows',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Radii: Story = {
    render: () => ({
        setup: () => ({ radii }),
        template: `
            <div class="flex flex-wrap gap-4">
                <div
                    v-for="r in radii"
                    :key="r.token"
                    class="flex flex-col items-center gap-2"
                >
                    <span :class="['size-24 border border-line bg-surface-2', r.radiusClass]" />
                    <span class="text-xs font-medium text-ink">{{ r.radiusClass }} · {{ r.px }}</span>
                    <span class="text-2xs text-muted max-w-40 text-center">{{ r.use }}</span>
                </div>
            </div>`,
    }),
};

export const Shadows: Story = {
    render: () => ({
        setup: () => ({ shadows }),
        template: `
            <div class="flex flex-wrap gap-6 p-6 bg-bg">
                <div
                    v-for="s in shadows"
                    :key="s.token"
                    class="flex flex-col items-center gap-2"
                >
                    <span :class="['w-40 h-24 rounded-surface border border-line bg-surface', s.shadowClass]" />
                    <span class="text-xs font-medium text-ink">{{ s.shadowClass }}</span>
                    <span class="text-2xs text-muted">{{ s.use }}</span>
                </div>
            </div>`,
    }),
};
