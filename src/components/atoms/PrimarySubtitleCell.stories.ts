import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PrimarySubtitleCell from './PrimarySubtitleCell.vue';

const meta: Meta<typeof PrimarySubtitleCell> = {
    title: 'Atoms/PrimarySubtitleCell',
    component: PrimarySubtitleCell,
    args: {
        primary: 'Invoice 2026-0142.pdf',
        subtitle: 'Invoices · DocuWare Mustermann',
    },
};

export default meta;
type Story = StoryObj<typeof PrimarySubtitleCell>;

export const Default: Story = {};

// `subtitleMono` sets the subtitle in the mono face — for tool names, ids,
// and other code-ish secondary lines.
export const MonoSubtitle: Story = {
    args: {
        primary: 'search-documents',
        subtitle: 'docuware.mustermann.search-documents-tool',
        subtitleMono: true,
    },
};

export const PrimaryOnly: Story = {
    args: { primary: 'Untitled document', subtitle: '' },
};
