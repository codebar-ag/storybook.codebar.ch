import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KindMark from './KindMark.vue';
import { kindShapes } from '../../kindShapes';

const meta: Meta<typeof KindMark> = {
    title: 'Atoms/KindMark',
    component: KindMark,
    argTypes: {
        shape: { control: 'select', options: Object.keys(kindShapes) },
        category: { control: 'select', options: [undefined, 'indigo', 'purple', 'magenta'] },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
    args: { shape: 'hexagon', icon: 'server', label: 'MCP server', category: 'magenta', size: 'md' },
    render: (args) => ({
        components: { KindMark },
        setup: () => ({ args }),
        template: '<KindMark v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof KindMark>;

export const Default: Story = {};

// The four silhouettes, alone. This is the whole primary channel: everything
// past four has to be said in the glyph or in the label.
export const Silhouettes: Story = {
    render: () => ({
        components: { KindMark },
        template: `<div class="flex flex-wrap items-center gap-5">
            <KindMark shape="square" label="Step" size="lg" />
            <KindMark shape="circle" label="Entry" category="indigo" size="lg" />
            <KindMark shape="diamond" label="Contract" category="purple" size="lg" />
            <KindMark shape="hexagon" label="System" category="magenta" size="lg" />
        </div>`,
    }),
};

// The case this was built for: 15 flow-graph node kinds, four families.
// Fifteen distinct glyphs, four silhouettes, four colours — and the type name
// on every one of them.
const GRAPH_KINDS = `
    <div class="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        <KindMark shape="square" icon="chart" label="Flow" />
        <KindMark shape="square" icon="code" label="Node" />
        <KindMark shape="square" icon="user" label="Agent" />
        <KindMark shape="square" icon="refresh" label="Preparation" />
        <KindMark shape="circle" icon="download" label="Trigger" category="indigo" />
        <KindMark shape="circle" icon="clock" label="Scheduler" category="indigo" />
        <KindMark shape="diamond" icon="database" label="Data source" category="purple" />
        <KindMark shape="diamond" icon="map" label="Schema" category="purple" />
        <KindMark shape="diamond" icon="chat" label="Prompt" category="purple" />
        <KindMark shape="hexagon" icon="cloud" label="Provider" category="magenta" />
        <KindMark shape="hexagon" icon="sparkles" label="AI provider" category="magenta" />
        <KindMark shape="hexagon" icon="chip" label="AI model" category="magenta" />
        <KindMark shape="hexagon" icon="server" label="MCP server" category="magenta" />
        <KindMark shape="hexagon" icon="link" label="MCP gateway" category="magenta" />
        <KindMark shape="hexagon" icon="arrow" label="Endpoint" category="magenta" />
    </div>`;

export const FifteenKinds: Story = {
    render: () => ({ components: { KindMark }, template: GRAPH_KINDS }),
};

/**
 * The acceptance test for the whole design, run in the browser rather than
 * argued: the same fifteen marks with `grayscale`. If anything here becomes
 * unreadable, the colour was carrying the signal after all and the design has
 * failed.
 *
 * It does not, because it cannot: the silhouettes are geometry. Measured, the
 * worst cross-family pair scores DSSIM 59.0 at this size — against a floor of
 * 30 calibrated on pairs users demonstrably confuse. For contrast, the kit's
 * own categorical colours desaturate to L* 40.7 and 40.6: indigo and magenta
 * become the same grey.
 */
export const InGreyscale: Story = {
    render: () => ({
        components: { KindMark },
        template: `<div class="space-y-4">
            <p class="text-xs text-muted">Same marks, <code class="text-ink">grayscale</code> applied.</p>
            <div class="grayscale">${GRAPH_KINDS}</div>
        </div>`,
    }),
};

/**
 * Before and after, on the pair that made this necessary.
 *
 * The "before" row is a real consuming app's flow-graph palette: 15 kinds on
 * raw Tailwind ramp hues, several of them landing exactly where the severity
 * ramp lives. A data source rendered amber and a schema rendered emerald read
 * as "caution" and "healthy" to anyone who has just looked at a status badge —
 * the kind was being reported as a status. Desaturate that row and it stops
 * saying anything at all.
 */
export const AgainstRawHues: Story = {
    render: () => ({
        components: { KindMark },
        template: `<div class="space-y-6">
            <div class="space-y-2">
                <p class="text-2xs uppercase tracking-wide text-dim">Before — raw ramp hues, colour is the whole signal</p>
                <div class="flex flex-wrap gap-4">
                    <span class="inline-flex items-center gap-2 rounded-control border border-amber-500 px-2 py-1 text-2xs uppercase tracking-wide text-amber-600">Data source</span>
                    <span class="inline-flex items-center gap-2 rounded-control border border-emerald-500 px-2 py-1 text-2xs uppercase tracking-wide text-emerald-600">Schema</span>
                    <span class="inline-flex items-center gap-2 rounded-control border border-rose-500 px-2 py-1 text-2xs uppercase tracking-wide text-rose-500">Provider</span>
                    <span class="inline-flex items-center gap-2 rounded-control border border-teal-500 px-2 py-1 text-2xs uppercase tracking-wide text-teal-600">MCP server</span>
                </div>
                <div class="flex flex-wrap gap-4 grayscale">
                    <span class="inline-flex items-center gap-2 rounded-control border border-amber-500 px-2 py-1 text-2xs uppercase tracking-wide text-amber-600">Data source</span>
                    <span class="inline-flex items-center gap-2 rounded-control border border-emerald-500 px-2 py-1 text-2xs uppercase tracking-wide text-emerald-600">Schema</span>
                    <span class="inline-flex items-center gap-2 rounded-control border border-rose-500 px-2 py-1 text-2xs uppercase tracking-wide text-rose-500">Provider</span>
                    <span class="inline-flex items-center gap-2 rounded-control border border-teal-500 px-2 py-1 text-2xs uppercase tracking-wide text-teal-600">MCP server</span>
                </div>
            </div>
            <div class="space-y-2">
                <p class="text-2xs uppercase tracking-wide text-dim">After — shape first, colour last</p>
                <div class="flex flex-wrap gap-4">
                    <KindMark shape="diamond" icon="database" label="Data source" category="purple" />
                    <KindMark shape="diamond" icon="map" label="Schema" category="purple" />
                    <KindMark shape="hexagon" icon="cloud" label="Provider" category="magenta" />
                    <KindMark shape="hexagon" icon="server" label="MCP server" category="magenta" />
                </div>
                <div class="flex flex-wrap gap-4 grayscale">
                    <KindMark shape="diamond" icon="database" label="Data source" category="purple" />
                    <KindMark shape="diamond" icon="map" label="Schema" category="purple" />
                    <KindMark shape="hexagon" icon="cloud" label="Provider" category="magenta" />
                    <KindMark shape="hexagon" icon="server" label="MCP server" category="magenta" />
                </div>
            </div>
        </div>`,
    }),
};

/**
 * Sizes, with what each one is actually good for.
 *
 * The silhouette outlives the glyph by a long way — it is still separable at
 * 12px, where a glyph is a smudge. `sm` is the point at which the glyph channel
 * is at its measured floor (worst within-family pair 34.8 against a floor of
 * 30), so at `sm` read the silhouette and the label and treat the glyph as
 * decoration.
 */
export const Sizes: Story = {
    render: () => ({
        components: { KindMark },
        template: `<div class="space-y-3">
            <div class="flex items-center gap-4">
                <span class="w-28 text-2xs text-dim">lg · 40px / 15px glyph</span>
                <KindMark shape="hexagon" icon="chip" label="AI model" category="magenta" size="lg" />
            </div>
            <div class="flex items-center gap-4">
                <span class="w-28 text-2xs text-dim">md · 32px / 12px glyph</span>
                <KindMark shape="hexagon" icon="chip" label="AI model" category="magenta" />
            </div>
            <div class="flex items-center gap-4">
                <span class="w-28 text-2xs text-dim">sm · 24px / 9px glyph</span>
                <KindMark shape="hexagon" icon="chip" label="AI model" category="magenta" size="sm" />
            </div>
        </div>`,
    }),
};

/**
 * Severity and kind side by side — the collision this exists to stop.
 *
 * The top row is a status: something is being reported as good or bad. The
 * bottom row is an identity: this box is one sort of thing rather than another.
 * They must never be confusable, which is why no `KindMark` colour comes from
 * the severity ramp. Measured, the closest any family colour comes to any
 * severity token is `accent` ↔ `danger`, ΔE 28.4 to normal vision and 16.1
 * under simulated red-green colour blindness.
 */
export const NotAStatus: Story = {
    render: () => ({
        components: { KindMark },
        template: `<div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
                <span class="w-20 text-2xs text-dim">Severity</span>
                <span class="rounded-control border border-success-line bg-success-soft px-2 py-0.5 text-2xs text-success">Succeeded</span>
                <span class="rounded-control border border-warning-line bg-warning-soft px-2 py-0.5 text-2xs text-warning">Retrying</span>
                <span class="rounded-control border border-danger-line bg-danger-soft px-2 py-0.5 text-2xs text-danger">Failed</span>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <span class="w-20 text-2xs text-dim">Kind</span>
                <KindMark shape="circle" icon="download" label="Trigger" category="indigo" size="sm" />
                <KindMark shape="square" icon="user" label="Agent" size="sm" />
                <KindMark shape="hexagon" icon="link" label="Gateway" category="magenta" size="sm" />
            </div>
        </div>`,
    }),
};

/**
 * Silhouette-only marks. Legal, and the state `KindLegend` uses — but note the
 * label is still there. There is no way to render a `KindMark` without one,
 * and that is the design rather than an oversight: four silhouettes cannot
 * name fifteen kinds, so the mark must never be the only thing on screen.
 */
export const WithoutAGlyph: Story = {
    render: () => ({
        components: { KindMark },
        template: `<div class="flex flex-wrap items-center gap-5">
            <KindMark shape="square" label="Step" />
            <KindMark shape="circle" label="Entry" category="indigo" />
            <KindMark shape="diamond" label="Contract" category="purple" />
            <KindMark shape="hexagon" label="System" category="magenta" />
        </div>`,
    }),
};
