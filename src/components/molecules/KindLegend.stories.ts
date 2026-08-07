import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KindLegend from './KindLegend.vue';
import type { KindLegendItem } from './KindLegend.vue';

const FAMILIES: KindLegendItem[] = [
    { shape: 'square', label: 'Step' },
    { shape: 'circle', label: 'Entry', category: 'indigo' },
    { shape: 'diamond', label: 'Contract', category: 'purple' },
    { shape: 'hexagon', label: 'System', category: 'magenta' },
];

const meta: Meta<typeof KindLegend> = {
    title: 'Molecules/KindLegend',
    component: KindLegend,
    args: { items: FAMILIES, label: 'Kinds' },
    render: (args) => ({
        components: { KindLegend },
        setup: () => ({ args }),
        template: '<KindLegend v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof KindLegend>;

export const Default: Story = {};

export const WithoutACaption: Story = { args: { label: '' } };

/**
 * The point of the component in one picture: fifteen kinds above, four legend
 * rows below.
 *
 * The legend does not list kinds and must not be made to. Every kind names
 * itself on its own mark, so the only thing left to explain is the silhouette —
 * a claim about which kinds belong together, which no single mark can make. A
 * legend that grew to fifteen rows would be conceding that the encoding had
 * stopped working; at that point the reader is just reading labels and the
 * marks are decoration.
 */
export const FourRowsForFifteenKinds: Story = {
    render: () => ({
        components: { KindLegend },
        setup: () => ({ families: FAMILIES }),
        template: `<div class="max-w-xl space-y-4">
            <p class="text-xs text-muted">
                A graph of 15 node kinds. Each card carries its own type name, so the
                legend explains the four shapes and nothing else.
            </p>
            <div class="rounded-surface border border-line bg-surface p-3">
                <KindLegend :items="families" label="Kinds" />
            </div>
        </div>`,
    }),
};
