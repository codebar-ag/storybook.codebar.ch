import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { onMounted, ref } from 'vue';
import { cssToken } from '../helpers/chartTheme';
import { colorGroups } from './tokenCatalog';

const meta: Meta = {
    title: 'Foundations/Colors',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Palette: Story = {
    render: () => ({
        setup: () => {
            const groups = colorGroups;
            // Live values are read from the document so the docs never drift
            // from tokens.css.
            const values = ref<Record<string, string>>({});
            onMounted(() => {
                const next: Record<string, string> = {};
                for (const group of groups) {
                    for (const { token } of group.tokens) {
                        next[token] = cssToken(token, '');
                    }
                }
                values.value = next;
            });
            return { groups, values };
        },
        template: `
            <div class="space-y-8 max-w-3xl">
                <section v-for="group in groups" :key="group.title">
                    <h2 class="text-lg font-semibold text-ink">{{ group.title }}</h2>
                    <p class="text-sm text-muted mt-0.5 mb-3">{{ group.description }}</p>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <li
                            v-for="t in group.tokens"
                            :key="t.token"
                            class="flex items-center gap-3 rounded-control border border-line bg-surface px-3 py-2"
                        >
                            <span :class="['size-10 shrink-0 rounded-control border border-line/50', t.swatchClass]" />
                            <span class="min-w-0">
                                <span class="block text-sm font-medium text-ink">{{ t.token }}</span>
                                <span class="block text-xs text-muted">{{ t.role }}</span>
                                <span class="block text-2xs text-dim">{{ values[t.token] }}</span>
                            </span>
                        </li>
                    </ul>
                </section>
            </div>`,
    }),
};
