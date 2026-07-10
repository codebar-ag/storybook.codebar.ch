import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FormActions from './FormActions.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof FormActions> = {
    title: 'Molecules/FormActions',
    component: FormActions,
    argTypes: {
        align: { control: 'inline-radio', options: ['between', 'end', 'start'] },
    },
    args: { align: 'between' },
    render: (args) => ({
        components: { FormActions, Button },
        setup: () => ({ args }),
        template: `
            <div class="max-w-md">
                <FormActions v-bind="args">
                    <template #secondary><Button variant="ghost">Cancel</Button></template>
                    <Button type="submit">Save</Button>
                </FormActions>
            </div>`,
    }),
};

export default meta;
type Story = StoryObj<typeof FormActions>;

export const Default: Story = {};

export const Alignments: Story = {
    render: () => ({
        components: { FormActions, Button },
        template: `
            <div class="max-w-md space-y-8">
                <FormActions align="between">
                    <template #secondary><Button variant="ghost">Cancel</Button></template>
                    <Button type="submit">Save instance</Button>
                </FormActions>
                <FormActions align="end">
                    <template #secondary><Button variant="ghost">Back</Button></template>
                    <Button type="submit">Store document</Button>
                </FormActions>
                <FormActions align="start">
                    <Button variant="danger">Delete cabinet</Button>
                </FormActions>
            </div>`,
    }),
};
