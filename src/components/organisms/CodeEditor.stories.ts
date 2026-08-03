import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, waitFor } from 'storybook/test';
import CodeEditor from './CodeEditor.vue';

/**
 * Asserts the document is actually SYNTAX HIGHLIGHTED, not merely rendered.
 *
 * This guards a failure mode with no error signal: if the library build ever
 * bundles `@codemirror/language` instead of externalising it, the consumer
 * loads two copies of it, the language's syntax tree registers against one
 * set of facets and `syntaxHighlighting()` reads the other, and every editor
 * silently renders as flat monochrome text.
 *
 * The check is "some token is painted a colour other than the body text's",
 * not "tokens use more than one colour between them": a short JSON document
 * may legitimately contain only one *styled* tag kind (`defaultHighlightStyle`
 * leaves plain `propertyName` uncoloured), which would make a colour-diversity
 * assertion fail on working code.
 */
async function expectHighlighted(canvasElement: HTMLElement): Promise<void> {
    await waitFor(async () => {
        const content = canvasElement.querySelector('.cm-content');
        await expect(content).not.toBeNull();

        const tokens = canvasElement.querySelectorAll('.cm-line span');
        await expect(tokens.length).toBeGreaterThan(0);

        const base = getComputedStyle(content as Element).color;
        await expect([...tokens].some((token) => getComputedStyle(token).color !== base)).toBe(true);
    });
}

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

export const Json: Story = {
    play: ({ canvasElement }) => expectHighlighted(canvasElement),
};

export const Markdown: Story = {
    args: {
        modelValue: '# Extraction prompt\n\nSummarize the **invoice** fields below.',
        language: 'markdown',
    },
    play: ({ canvasElement }) => expectHighlighted(canvasElement),
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

export const Copyable: Story = {
    args: { copyable: true, readonly: true },
};
