import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import FileInput from './FileInput.vue';

const meta: Meta<typeof FileInput> = {
    title: 'Molecules/FileInput',
    component: FileInput,
    args: { name: 'upload', invalid: false },
    render: (args) => ({
        components: { FileInput },
        setup: () => ({ args }),
        template: '<div class="max-w-md"><FileInput v-bind="args" /></div>',
    }),
};

export default meta;
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {};

export const Invalid: Story = { args: { invalid: true } };

// File inputs are write-only: the browser owns the selection, so the model
// only flows outward (input → caller), never back in. Alongside v-model
// (File[]) the raw `change` emit (FileList | null) is kept for callers that
// want the native event payload.
export const WithVModel: Story = {
    render: () => ({
        components: { FileInput },
        setup: () => {
            const files = ref<File[]>([]);

            return { files };
        },
        template: `<div class="max-w-md space-y-2">
            <FileInput v-model="files" name="documents" />
            <p class="text-xs text-muted">
                {{ files.length ? files.map((file) => file.name).join(', ') : 'No documents selected' }}
            </p>
        </div>`,
    }),
};
