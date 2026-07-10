import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { spacingSteps } from './tokenCatalog';

const meta: Meta = {
    title: 'Foundations/Spacing',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Scale: Story = {
    render: () => ({
        setup: () => ({ steps: spacingSteps }),
        template: `
            <div class="max-w-xl">
                <p class="text-sm text-muted mb-4">
                    Tailwind's default 4px scale — these are the steps the kit uses for gaps and padding.
                </p>
                <ul class="space-y-1.5">
                    <li v-for="step in steps" :key="step.name" class="flex items-center gap-4">
                        <span class="w-10 shrink-0 text-xs text-dim tabular-nums">{{ step.name }}</span>
                        <span class="w-12 shrink-0 text-xs text-dim tabular-nums">{{ step.px }}</span>
                        <span :class="['h-4 rounded-xs bg-ink/80', step.widthClass]" />
                    </li>
                </ul>
            </div>`,
    }),
};
