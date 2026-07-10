import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Skeleton from './Skeleton.vue';

const meta: Meta<typeof Skeleton> = {
    title: 'Atoms/Skeleton',
    component: Skeleton,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// Default block matches the most common loading-card height (h-24).
export const Default: Story = {
    render: () => ({
        components: { Skeleton },
        template: '<Skeleton class="max-w-md" />',
    }),
};

// Shapes are overridden via `class` — compose several to sketch the content
// that is still loading, e.g. a document card behind a Deferred prop.
export const LoadingCard: Story = {
    render: () => ({
        components: { Skeleton },
        template: `
            <div class="max-w-md space-y-3 bg-surface border border-line rounded-surface p-5">
                <Skeleton class="h-4 w-1/2" />
                <Skeleton class="h-3 w-full" />
                <Skeleton class="h-3 w-5/6" />
                <Skeleton class="h-24" />
            </div>`,
    }),
};
