import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ConfigValue from './ConfigValue.vue';

// ConfigValue auto-detects how to display a raw config value: parseable JSON
// gets a code preview, multi-line/markdown text gets a markdown preview,
// short plain text renders as a description item, and empty renders an em-dash.
const meta: Meta<typeof ConfigValue> = {
    title: 'Organisms/ConfigValue',
    component: ConfigValue,
};

export default meta;
type Story = StoryObj<typeof ConfigValue>;

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

export const Json: Story = {
    render: () => ({
        components: { ConfigValue },
        setup: () => ({ sampleJson }),
        template: '<div class="max-w-xl"><ConfigValue label="Preparation processors" :value="sampleJson" /></div>',
    }),
};

export const Text: Story = {
    render: () => ({
        components: { ConfigValue },
        template: '<div class="max-w-xl"><ConfigValue label="Gateway endpoint" value="https://mcp.gateway.test/mcp/acme/luxor" /></div>',
    }),
};

export const Empty: Story = {
    render: () => ({
        components: { ConfigValue },
        template: '<div class="max-w-xl"><ConfigValue label="Webhook secret" :value="null" /></div>',
    }),
};
