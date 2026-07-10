import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed } from 'vue';
import Chart from './Chart.vue';
import { areaChartOptions } from '../helpers/chartTheme';

const meta: Meta<typeof Chart> = {
    title: 'Atoms/Chart',
    component: Chart,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Chart>;

function sampleSeries() {
    const start = new Date('2025-08-16T00:00:00Z');
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

    return [{
        name: 'Runs',
        data: data.map((value, index) => {
            const day = new Date(start);
            day.setUTCDate(start.getUTCDate() + index);

            return { x: day.toISOString().slice(0, 10), y: value };
        }),
    }];
}

export const AreaRuns: Story = {
    render: () => ({
        components: { Chart },
        setup() {
            const series = computed(() => sampleSeries());
            const options = computed(() => areaChartOptions({
                yaxis: {
                    labels: {
                        formatter: (value: number) => String(Math.round(value)),
                    },
                },
            }));

            return { series, options };
        },
        template: `
            <div class="max-w-3xl rounded-card border border-line bg-surface p-4">
                <Chart type="area" :series="series" :options="options" :height="240" />
            </div>`,
    }),
};
