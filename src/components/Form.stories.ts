import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Field from './Field.vue';
import Input from './Input.vue';
import SearchableSelect from './SearchableSelect.vue';
import Select from './Select.vue';
import Textarea from './Textarea.vue';
import Checkbox from './Checkbox.vue';
import Radio from './Radio.vue';
import RadioGroup from './RadioGroup.vue';
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

export const RadioCards: Story = {
    render: () => ({
        components: { RadioGroup, Radio },
        setup: () => {
            const hosting = ref('shared');
            return { hosting };
        },
        template: `
            <div class="max-w-md">
                <RadioGroup label="Hosting">
                    <Radio
                        v-model="hosting"
                        value="shared"
                        name="hosting"
                        label="Shared instance"
                        description="Shared infrastructure."
                    />
                    <Radio
                        v-model="hosting"
                        value="dedicated"
                        name="hosting"
                        label="Dedicated instance"
                        description="Your own isolated subscription."
                    />
                </RadioGroup>
            </div>`,
    }),
};

export const SearchableSelectControl: Story = {
    render: () => ({
        components: { Field, SearchableSelect },
        setup: () => {
            const selected = ref('prod');
            const options = [
                { value: 'prod', label: 'Production' },
                { value: 'staging', label: 'Staging' },
                { value: 'dev', label: 'Development' },
            ];
            return { selected, options };
        },
        template: `
            <div class="max-w-md">
                <Field label="Tenant" name="tenant">
                    <SearchableSelect
                        v-model="selected"
                        :options="options"
                        placeholder="Choose tenant"
                    />
                </Field>
            </div>`,
    }),
};
