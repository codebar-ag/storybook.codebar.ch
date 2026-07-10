import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CodePreview from './CodePreview.vue';

const meta: Meta<typeof CodePreview> = {
    title: 'Organisms/CodePreview',
    component: CodePreview,
};

export default meta;
type Story = StoryObj<typeof CodePreview>;

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

// JSON is pretty-printed before rendering, even from a minified string.
export const Json: Story = {
    render: () => ({
        components: { CodePreview },
        setup: () => ({ sampleJson }),
        template: '<div class="max-w-xl"><CodePreview :value="sampleJson" language="json" /></div>',
    }),
};

export const Markdown: Story = {
    render: () => ({
        components: { CodePreview },
        setup: () => ({ sampleKnowledge }),
        template: '<div class="max-w-xl"><CodePreview :value="sampleKnowledge" language="markdown" /></div>',
    }),
};

// An empty value renders a quiet em-dash placeholder instead of an editor.
export const Empty: Story = {
    render: () => ({
        components: { CodePreview },
        template: '<div class="max-w-xl"><CodePreview value="" language="json" /></div>',
    }),
};
