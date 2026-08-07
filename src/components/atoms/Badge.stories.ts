import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Badge from './Badge.vue';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Badge',
    component: Badge,
    argTypes: {
        variant: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
        category: { control: 'select', options: [undefined, 'indigo', 'purple', 'magenta'] },
        size: { control: 'inline-radio', options: ['sm', 'md'] },
    },
    args: { variant: 'neutral', size: 'md' },
    render: (args) => ({
        components: { Badge },
        setup: () => ({ args }),
        template: '<Badge v-bind="args">Badge</Badge>',
    }),
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const All: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge variant="neutral">neutral</Badge>
                <Badge variant="info">info</Badge>
                <Badge variant="success">success</Badge>
                <Badge variant="warning">warning</Badge>
                <Badge variant="danger">danger</Badge>
            </div>`,
    }),
};

// `category` is a SIBLING vocabulary to `variant`, not an extension of it.
// `variant` answers "how bad is this"; `category` answers "which kind is this".
// Three is the measured ceiling on the categorical set — see src/tokens.css for
// the contrast and colour-blindness figures that fix it there.
export const Categorical: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge category="indigo">indigo</Badge>
                <Badge category="purple">purple</Badge>
                <Badge category="magenta">magenta</Badge>
                <Badge variant="neutral">neutral (no category)</Badge>
            </div>`,
    }),
};

// The point of the whole vocabulary, in one picture: the same four states, once
// borrowing the severity ramp and once labelled as identities. On the top row a
// user reads "something needs attention" from every colour — nothing here is a
// problem. On the bottom row the colour carries identity and nothing else.
export const SeverityVersusIdentity: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="space-y-4">
                <div>
                    <p class="text-2xs text-dim mb-1.5">Before — non-severity state on the severity ramp</p>
                    <div class="flex flex-wrap gap-2">
                        <Badge variant="success">enabled</Badge>
                        <Badge variant="info">overridden</Badge>
                        <Badge variant="info">duplicate</Badge>
                        <Badge variant="warning">older version</Badge>
                    </div>
                </div>
                <div>
                    <p class="text-2xs text-dim mb-1.5">After — the categorical vocabulary</p>
                    <div class="flex flex-wrap gap-2">
                        <Badge category="indigo">enabled</Badge>
                        <Badge category="purple">overridden</Badge>
                        <Badge category="magenta">duplicate</Badge>
                        <Badge category="indigo">older version</Badge>
                    </div>
                </div>
                <div>
                    <p class="text-2xs text-dim mb-1.5">Still severity — these are genuinely statuses</p>
                    <div class="flex flex-wrap gap-2">
                        <Badge variant="success">connected</Badge>
                        <Badge variant="warning">degraded</Badge>
                        <Badge variant="danger">failed</Badge>
                    </div>
                </div>
            </div>`,
    }),
};

// Every category beside every severity, which is the pairing the tokens are
// actually measured against: no categorical badge may read as a status badge.
// Worst measured separation across this grid is ΔE 21.3 (normal vision) /
// 10.8 (protanopia/deuteranopia), between magenta and neutral.
export const AgainstSeverity: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge variant="neutral">neutral</Badge>
                <Badge variant="info">info</Badge>
                <Badge variant="success">success</Badge>
                <Badge variant="warning">warning</Badge>
                <Badge variant="danger">danger</Badge>
                <Badge category="indigo">indigo</Badge>
                <Badge category="purple">purple</Badge>
                <Badge category="magenta">magenta</Badge>
            </div>`,
    }),
};

// The pre-1.3 color names keep rendering (mapped in helpers/tone.ts) until the
// next major release; this story is the living proof + migration reference.
export const LegacyAliases: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge variant="gray">gray → neutral</Badge>
                <Badge variant="blue">blue → info</Badge>
                <Badge variant="green">green → success</Badge>
                <Badge variant="amber">amber → warning</Badge>
                <Badge variant="red">red → danger</Badge>
            </div>`,
    }),
};

// `purple` is the one legacy alias that was never a severity: it meant "seen
// this before" (a duplicate delivery) and rode `info` only because there was no
// non-severity vocabulary to put it in. There is now, and the two spellings do
// visibly different things — which is the migration.
export const LegacyPurpleVersusCategory: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge variant="purple">variant="purple" → info (deprecated)</Badge>
                <Badge category="purple">category="purple" → a real purple</Badge>
            </div>`,
    }),
};
