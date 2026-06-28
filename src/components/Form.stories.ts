import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Field from './Field.vue';
import Input from './Input.vue';
import Select from './Select.vue';
import Textarea from './Textarea.vue';
import Checkbox from './Checkbox.vue';
import Button from './Button.vue';
import FormActions from './FormActions.vue';

const meta: Meta = {
    title: 'Atoms/Form',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Controls: Story = {
    render: () => ({
        components: { Field, Input, Select, Textarea, Checkbox, Button, FormActions },
        setup: () => ({
            options: [
                { value: 'prod', label: 'Production' },
                { value: 'staging', label: 'Staging' },
            ],
        }),
        template: `
            <div class="max-w-md space-y-4">
                <Field label="Instance name" name="name" hint="Shown in the dashboard.">
                    <Input name="name" model-value="DocuWare Luxor" />
                </Field>
                <Field label="Environment" name="env">
                    <Select name="env" :options="options" model-value="prod" />
                </Field>
                <Field label="Notes" name="notes">
                    <Textarea name="notes" model-value="" />
                </Field>
                <Field label="Field with error" name="url" error="The URL is required.">
                    <Input name="url" :invalid="true" model-value="" />
                </Field>
                <Checkbox name="agree" description="Required to proceed.">I accept the terms</Checkbox>
                <FormActions>
                    <template #secondary><Button variant="ghost">Cancel</Button></template>
                    <Button type="submit">Save</Button>
                </FormActions>
            </div>`,
    }),
};
