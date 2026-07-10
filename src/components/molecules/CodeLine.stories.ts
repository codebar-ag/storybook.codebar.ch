import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CodeLine from './CodeLine.vue';
import LabeledCodeBlock from './LabeledCodeBlock.vue';
import Toaster from '../organisms/Toaster.vue';

// Covers both CodeLine and its labeled wrapper, LabeledCodeBlock.
const meta: Meta<typeof CodeLine> = {
    title: 'Molecules/CodeLine',
    component: CodeLine,
    args: { value: 'https://mcp.gateway.test/mcp/acme/mustermann', copyable: true },
    render: (args) => ({
        components: { CodeLine, Toaster },
        setup: () => ({ args }),
        template: `<div class="max-w-lg">
            <CodeLine v-bind="args" />
            <Toaster />
        </div>`,
    }),
};

export default meta;
type Story = StoryObj<typeof CodeLine>;

export const Default: Story = {};

export const NotCopyable: Story = { args: { copyable: false } };

// LabeledCodeBlock: an uppercase caption over a copyable code line. Used for
// surfacing URLs, endpoints, and one-time secrets.
export const Labeled: Story = {
    render: () => ({
        components: { LabeledCodeBlock, Toaster },
        template: `<div class="max-w-lg space-y-3">
            <LabeledCodeBlock label="MCP server URL" value="https://mcp.gateway.test/mcp/acme/mustermann" />
            <LabeledCodeBlock label="Client secret" value="dhs_demo_placeholder_value" />
            <Toaster />
        </div>`,
    }),
};
