import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MetricGrid from './MetricGrid.vue';
import Metric from '../atoms/Metric.vue';

const meta: Meta<typeof MetricGrid> = {
    title: 'Organisms/MetricGrid',
    component: MetricGrid,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof MetricGrid>;

export const Metrics: Story = {
    render: () => ({
        components: { MetricGrid, Metric },
        template: `
            <MetricGrid class="max-w-xl">
                <Metric label="Calls (30d)" value="12,408" />
                <Metric label="Documents" value="1,902" />
                <Metric label="Seats" value="8" />
                <Metric label="Instances" value="3" />
            </MetricGrid>`,
    }),
};

// When the tile count doesn't divide evenly into `columns`, the grid pads the
// trailing cells with blank filler tiles so the hairline-gap background never
// shows through as a solid block.
export const UnevenTileCount: Story = {
    render: () => ({
        components: { MetricGrid, Metric },
        template: `
            <MetricGrid class="max-w-xl">
                <Metric label="Calls (30d)" value="12,408" />
                <Metric label="Documents" value="1,902" />
                <Metric label="Seats" value="8" />
            </MetricGrid>`,
    }),
};

export const TwoColumns: Story = {
    render: () => ({
        components: { MetricGrid, Metric },
        template: `
            <MetricGrid :columns="2" class="max-w-md">
                <Metric label="Green (auto-filed)" value="1,644" />
                <Metric label="Yellow (review)" value="212" />
                <Metric label="Red (no match)" value="46" />
                <Metric label="In progress" value="12" />
            </MetricGrid>`,
    }),
};
