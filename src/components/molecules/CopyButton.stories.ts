import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CopyButton from './CopyButton.vue';
import Toaster from '../organisms/Toaster.vue';

const meta: Meta<typeof CopyButton> = {
    title: 'Molecules/CopyButton',
    component: CopyButton,
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

// No play function here on purpose: clicking writes to the clipboard, which
// needs the clipboard-read/clipboard-write permissions granted in the
// Playwright smoke test — interaction coverage lives there, not in-browser.
export const Default: Story = {
    render: () => ({
        components: { CopyButton, Toaster },
        template: `<div>
            <CopyButton
                value="https://mcp.gateway.test/mcp/acme/luxor"
                class="text-dim hover:text-ink focus-visible:ring-accent/50"
            />
            <Toaster />
        </div>`,
    }),
};

export const CustomToastMessage: Story = {
    render: () => ({
        components: { CopyButton, Toaster },
        template: `<div class="flex items-center gap-2 text-sm text-muted">
            <span>API key</span>
            <CopyButton
                value="dhk_live_4f2a9c"
                label="Copy API key"
                copied-message="API key copied"
                class="text-dim hover:text-ink focus-visible:ring-accent/50"
            />
            <Toaster />
        </div>`,
    }),
};
