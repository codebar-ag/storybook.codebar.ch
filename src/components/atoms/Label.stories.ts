import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Label from './Label.vue';
import Input from './Input.vue';

const meta: Meta<typeof Label> = {
    title: 'Atoms/Label',
    component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    render: () => ({
        components: { Label },
        template: '<Label for="env">Environment</Label>',
    }),
};

export const Required: Story = {
    render: () => ({
        components: { Label },
        template: '<Label for="cabinet" required>File cabinet</Label>',
    }),
};

export const WithInput: Story = {
    render: () => ({
        components: { Label, Input },
        template: `
            <div class="w-80 space-y-1.5">
                <Label for="host">Host</Label>
                <Input name="host" placeholder="mustermann.docuware.cloud" />
            </div>`,
    }),
};
