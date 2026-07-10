import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { typeScale } from './tokenCatalog';

const meta: Meta = {
    title: 'Foundations/Typography',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Scale: Story = {
    render: () => ({
        setup: () => ({ steps: typeScale }),
        template: `
            <div class="max-w-3xl">
                <p class="text-sm text-muted mb-4">
                    Single all-mono scale (JetBrains Mono); the text-* utilities are remapped in tokens.css.
                </p>
                <ul class="divide-y divide-line/40 border-y border-line/40">
                    <li v-for="step in steps" :key="step.token" class="flex items-baseline gap-6 py-3">
                        <span class="w-24 shrink-0 text-xs text-dim">{{ step.textClass }}</span>
                        <span class="w-28 shrink-0 text-xs text-dim tabular-nums">{{ step.px }}</span>
                        <span class="min-w-0">
                            <span :class="['block text-ink truncate', step.textClass]">Documents filed to e_invoices</span>
                            <span class="block text-2xs text-muted mt-0.5">{{ step.use }}</span>
                        </span>
                    </li>
                </ul>
            </div>`,
    }),
};
