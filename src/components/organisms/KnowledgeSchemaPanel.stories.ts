import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KnowledgeSchemaPanel from './KnowledgeSchemaPanel.vue';

const meta: Meta<typeof KnowledgeSchemaPanel> = {
    title: 'Organisms/KnowledgeSchemaPanel',
    component: KnowledgeSchemaPanel,
};

export default meta;
type Story = StoryObj<typeof KnowledgeSchemaPanel>;

const sampleKnowledge = `# Invoice extraction

Extract vendor name, invoice number, and line items from OCR text.`;

const sampleSchema = JSON.stringify({
    type: 'object',
    properties: {
        vendor: { type: 'string' },
        invoice_number: { type: 'string' },
    },
}, null, 2);

export const Default: Story = {
    render: () => ({
        components: { KnowledgeSchemaPanel },
        setup: () => ({ sampleKnowledge, sampleSchema }),
        template: `<div class="max-w-xl space-y-6">
            <KnowledgeSchemaPanel :knowledge="sampleKnowledge" :schema="sampleSchema" />
        </div>`,
    }),
};

// Each section only renders when its value is present.
export const KnowledgeOnly: Story = {
    render: () => ({
        components: { KnowledgeSchemaPanel },
        setup: () => ({ sampleKnowledge }),
        template: '<div class="max-w-xl"><KnowledgeSchemaPanel :knowledge="sampleKnowledge" /></div>',
    }),
};
