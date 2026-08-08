import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
import MetricGrid from './MetricGrid.vue';
import Metric from '../atoms/Metric.vue';

// The filler tiles are `aria-hidden` and carry no text, so the count is the
// only thing to assert on and there is nothing else in the grid that matches.
const fillerCount = (canvasElement: HTMLElement): number =>
    canvasElement.querySelectorAll('[aria-hidden="true"]').length;

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

// A caller with a variable number of metrics writes `v-for`, which hands the
// grid a single Fragment holding the whole run rather than one vnode per tile.
// Counting the slot's vnodes therefore read three tiles as one and padded the
// row with three fillers — a 3/4-full grid drawn as a 1/4-full one.
export const TilesFromVFor: Story = {
    render: () => ({
        components: { MetricGrid, Metric },
        setup: () => ({ metrics: ref([
            { label: 'Calls (30d)', value: '12,408' },
            { label: 'Documents', value: '1,902' },
            { label: 'Seats', value: '8' },
        ]) }),
        template: `
            <MetricGrid class="max-w-xl">
                <Metric
                    v-for="metric in metrics"
                    :key="metric.label"
                    :label="metric.label"
                    :value="metric.value"
                />
            </MetricGrid>`,
    }),
    play: async ({ canvasElement }) => {
        await expect(fillerCount(canvasElement)).toBe(1);
    },
};

// A tile behind `v-if` leaves a Comment placeholder in the slot when it is
// false, so the row counted four tiles while three rendered — and the filler
// the gap needed was never drawn. The count also has to survive the toggle:
// it is read per render rather than cached from mount.
export const TileCountChangingAfterMount: Story = {
    render: () => ({
        components: { MetricGrid, Metric },
        setup: () => ({ showFourth: ref(false) }),
        template: `
            <div class="max-w-xl">
                <button
                    class="mb-3 text-sm underline"
                    @click="showFourth = !showFourth"
                >{{ showFourth ? 'Hide seats' : 'Show seats' }}</button>
                <MetricGrid>
                    <Metric label="Calls (30d)" value="12,408" />
                    <Metric label="Documents" value="1,902" />
                    <Metric label="Instances" value="3" />
                    <Metric
                        v-if="showFourth"
                        label="Seats"
                        value="8"
                    />
                </MetricGrid>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(fillerCount(canvasElement)).toBe(1);

        await userEvent.click(canvas.getByRole('button', { name: 'Show seats' }));
        await waitFor(() => expect(fillerCount(canvasElement)).toBe(0));

        await userEvent.click(canvas.getByRole('button', { name: 'Hide seats' }));
        await waitFor(() => expect(fillerCount(canvasElement)).toBe(1));
    },
};
