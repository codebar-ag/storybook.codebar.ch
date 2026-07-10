import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FormGrid from './FormGrid.vue';
import Field from './Field.vue';
import Input from '../atoms/Input.vue';

const meta: Meta<typeof FormGrid> = {
    title: 'Molecules/FormGrid',
    component: FormGrid,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof FormGrid>;

export const TwoColumn: Story = {
    render: () => ({
        components: { FormGrid, Field, Input },
        template: `
            <FormGrid class="max-w-2xl">
                <Field label="Display name" name="name"><Input name="name" /></Field>
                <Field label="Host" name="host"><Input name="host" /></Field>
                <Field label="Username" name="user"><Input name="user" /></Field>
                <Field label="Password" name="pass"><Input name="pass" type="password" /></Field>
            </FormGrid>`,
    }),
};

export const SingleColumn: Story = {
    render: () => ({
        components: { FormGrid, Field, Input },
        template: `
            <FormGrid :cols="1" class="max-w-md">
                <Field label="Display name" name="name"><Input name="name" /></Field>
                <Field label="Host" name="host"><Input name="host" placeholder="luxor.docuware.cloud" /></Field>
            </FormGrid>`,
    }),
};

export const ThreeColumn: Story = {
    render: () => ({
        components: { FormGrid, Field, Input },
        template: `
            <FormGrid :cols="3" class="max-w-4xl">
                <Field label="File cabinet" name="cabinet"><Input name="cabinet" placeholder="e_invoices" /></Field>
                <Field label="Flow" name="flow"><Input name="flow" placeholder="Invoice approval" /></Field>
                <Field label="Instance" name="instance"><Input name="instance" placeholder="DocuWare Luxor" /></Field>
            </FormGrid>`,
    }),
};
