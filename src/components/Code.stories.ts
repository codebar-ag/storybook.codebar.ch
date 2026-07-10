import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CodePreview from './CodePreview.vue';
import ConfigValue from './ConfigValue.vue';
import KnowledgeSchemaPanel from './KnowledgeSchemaPanel.vue';

const meta: Meta = {
    title: 'Atoms/Code',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const sampleJson = JSON.stringify({
    processors: {
        'mistral-ocr': {
            enabled: true,
            service: 'mistral-document-ai',
            applies_to: {
                content_types: ['application/pdf'],
                max_page_count: 50,
            },
        },
    },
});

const sampleKnowledge = `# Invoice extraction

Extract vendor name, invoice number, and line items from OCR text.`;

const sampleSchema = JSON.stringify({
    type: 'object',
    properties: {
        vendor: { type: 'string' },
        invoice_number: { type: 'string' },
    },
}, null, 2);

export const PreviewJson: Story = {
    render: () => ({
        components: { CodePreview },
        setup: () => ({ sampleJson }),
        template: '<div class="max-w-xl"><CodePreview :value="sampleJson" language="json" /></div>',
    }),
};

export const PreviewMarkdown: Story = {
    render: () => ({
        components: { CodePreview },
        setup: () => ({ sampleKnowledge }),
        template: '<div class="max-w-xl"><CodePreview :value="sampleKnowledge" language="markdown" /></div>',
    }),
};

export const ConfigValueJson: Story = {
    render: () => ({
        components: { ConfigValue },
        setup: () => ({ sampleJson }),
        template: '<div class="max-w-xl"><ConfigValue label="Preparation processors" :value="sampleJson" /></div>',
    }),
};

export const KnowledgeSchema: Story = {
    render: () => ({
        components: { KnowledgeSchemaPanel },
        setup: () => ({ sampleKnowledge, sampleSchema }),
        template: `<div class="max-w-xl space-y-6">
            <KnowledgeSchemaPanel :knowledge="sampleKnowledge" :schema="sampleSchema" />
        </div>`,
    }),
};
