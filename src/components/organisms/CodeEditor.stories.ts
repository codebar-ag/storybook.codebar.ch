import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CodeEditor from './CodeEditor.vue';

const meta: Meta<typeof CodeEditor> = {
    title: 'Organisms/CodeEditor',
    component: CodeEditor,
    parameters: { layout: 'padded' },
    args: {
        modelValue: '{\n  "vendor": "string",\n  "invoice_number": "string"\n}',
        language: 'json',
    },
    render: (args) => ({
        components: { CodeEditor },
        setup: () => ({ args }),
        template: '<div class="h-64"><CodeEditor v-bind="args" /></div>',
    }),
};

export default meta;
type Story = StoryObj<typeof CodeEditor>;

export const Json: Story = {};

export const Markdown: Story = {
    args: {
        modelValue: '# Extraction prompt\n\nSummarize the invoice fields below.',
        language: 'markdown',
    },
};

export const ReadOnlyEmpty: Story = {
    render: () => ({
        components: { CodeEditor },
        template: '<div class="h-64"><CodeEditor readonly placeholder="No schema yet." /></div>',
    }),
};

export const AutoHeight: Story = {
    args: { autoHeight: true, maxHeight: '12rem' },
};
