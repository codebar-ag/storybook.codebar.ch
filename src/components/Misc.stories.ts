import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Link from './Link.vue';
import Tab from './Tab.vue';
import StatusBadge from './StatusBadge.vue';
import ButtonGroup from './ButtonGroup.vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';
import CopyButton from './CopyButton.vue';
import CodeLine from './CodeLine.vue';
import LabeledCodeBlock from './LabeledCodeBlock.vue';
import FileInput from './FileInput.vue';
import Toaster from './Toaster.vue';
import Chart from './Chart.vue';

// Catch-all so every remaining atom is exercised by at least one story (and
// therefore by the Playwright smoke test).
const meta: Meta = {
    title: 'Atoms/Misc',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Links: Story = {
    render: () => ({
        components: { Link },
        template: `<p class="text-sm text-muted">A <Link href="#">default link</Link> and a <Link href="#" tone="muted">muted link</Link>.</p>`,
    }),
};

export const Tabs: Story = {
    render: () => ({
        components: { Tab },
        template: `<nav class="inline-flex items-center gap-1 rounded-control border border-line bg-surface-2 p-1">
            <Tab href="#" :active="true">Overview</Tab>
            <Tab href="#">Members</Tab>
            <Tab href="#">Settings</Tab>
        </nav>`,
    }),
};

export const StatusBadges: Story = {
    render: () => ({
        components: { StatusBadge },
        template: `<div class="flex gap-2">
            <StatusBadge variant="green" label="Connected" :dot="true" />
            <StatusBadge variant="amber" label="Pending" :dot="true" />
            <StatusBadge variant="red" label="Error" :dot="true" />
        </div>`,
    }),
};

export const Dropdowns: Story = {
    render: () => ({
        components: { Dropdown, DropdownItem },
        // The trigger is intentionally NOT a <button> — a nested interactive
        // element inside <summary> swallows the native disclosure toggle.
        template: `<Dropdown align="left">
            <template #trigger>
                <span class="inline-flex items-center gap-1.5 h-11 px-4 text-sm bg-surface-2 border border-line rounded-control">Menu</span>
            </template>
            <DropdownItem href="#">Settings</DropdownItem>
            <DropdownItem :active="true">Members</DropdownItem>
            <DropdownItem>Sign out</DropdownItem>
        </Dropdown>`,
    }),
};

export const Code: Story = {
    render: () => ({
        components: { CodeLine, LabeledCodeBlock, CopyButton, ButtonGroup, Toaster },
        template: `<div class="space-y-3 max-w-lg">
            <CodeLine value="https://mcp.gateway.test/mcp/acme/luxor" />
            <LabeledCodeBlock label="MCP server URL" value="https://mcp.gateway.test/mcp/acme/luxor" />
            <ButtonGroup><CopyButton value="copied!" class="text-dim" /></ButtonGroup>
            <Toaster />
        </div>`,
    }),
};

export const Files: Story = {
    render: () => ({
        components: { FileInput },
        template: `<div class="max-w-md"><FileInput name="upload" /></div>`,
    }),
};

export const Charts: Story = {
    render: () => ({
        components: { Chart, Toaster },
        setup: () => ({
            series: [{ name: 'Calls', data: [31, 40, 28, 51, 42, 60] }],
            options: {
                xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
                colors: ['#18181b'],
            },
        }),
        template: `<div class="max-w-xl"><Chart type="bar" :series="series" :options="options" /></div>`,
    }),
};
