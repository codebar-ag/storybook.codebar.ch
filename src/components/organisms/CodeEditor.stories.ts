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

/**
 * The exact inverse, for the unknown-language fallback: the document renders,
 * and nothing in it is painted.
 *
 * Measured in colour rather than by counting `<span>`s on purpose — CodeMirror
 * emits spans of its own for line decorations, so a zero-span assertion would
 * be testing something else. Colour is what a grammar buys, so colour is what
 * its absence has to be read from.
 */
async function expectNotHighlighted(canvasElement: HTMLElement): Promise<void> {
    // Wait for the document first: an editor that has not mounted yet has no
    // coloured tokens either, and would pass this vacuously.
    await waitFor(async () => {
        await expect(canvasElement.querySelector('.cm-line')?.textContent ?? '').not.toBe('');
    });

    const content = canvasElement.querySelector('.cm-content') as Element;
    const base = getComputedStyle(content).color;
    const tokens = [...canvasElement.querySelectorAll('.cm-line span')];

    await expect(tokens.every((token) => getComputedStyle(token).color === base)).toBe(true);
}

const sampleYaml = `# Compiled flow definition
name: invoice-intake
version: 3
steps:
  - id: ocr
    uses: mistral-document-ai
    with:
      max_page_count: 50
  - id: extract
    uses: llm
    prompt: "Extract vendor, invoice number and total."
`;

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

/**
 * YAML is the mode this editor spent its whole life without. Anything that was
 * not `markdown` loaded the JSON grammar, so a consuming app's compiled
 * flow-definition page highlighted YAML as JSON from the day it was written.
 *
 * The assertion is the comment line specifically, and `expectHighlighted` would
 * not have done. Run the JSON grammar over the document below and it still
 * paints nine tokens — every `:` as punctuation, `3` and `50` as numbers —
 * which is both why "some token is coloured" passes on the broken version and
 * why nobody noticed: the wrong grammar produced plausible colour rather than
 * visible breakage. `#` opens a comment in YAML and nothing at all in JSON, so
 * a painted first line is reachable only through `@codemirror/lang-yaml`.
 */
async function expectYamlGrammar(canvasElement: HTMLElement): Promise<void> {
    await waitFor(async () => {
        const content = canvasElement.querySelector('.cm-content');
        await expect(content).not.toBeNull();

        const commentLine = [...canvasElement.querySelectorAll('.cm-line')].find((line) =>
            line.textContent?.startsWith('#'),
        );
        await expect(commentLine).not.toBeUndefined();

        const base = getComputedStyle(content as Element).color;
        const painted = [...(commentLine as Element).querySelectorAll('span')].some(
            (token) => getComputedStyle(token).color !== base,
        );
        await expect(painted).toBe(true);
    });
}

export const Yaml: Story = {
    args: { modelValue: sampleYaml, language: 'yaml' },
    play: ({ canvasElement }) => expectYamlGrammar(canvasElement),
};

/**
 * A language the editor does not know now renders unhighlighted and warns in
 * development, instead of silently reaching for JSON.
 *
 * The value is passed from a template string, which is how it reaches a
 * component in practice: `language` is a typed union, so the only callers who
 * can get here are untyped ones — and they are exactly the ones with no
 * compiler to tell them.
 */
export const UnknownLanguage: Story = {
    render: () => ({
        components: { CodeEditor },
        setup: () => ({ sampleYaml }),
        template: '<div class="h-64"><CodeEditor :model-value="sampleYaml" language="toml" /></div>',
    }),
    play: ({ canvasElement }) => expectNotHighlighted(canvasElement),
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
