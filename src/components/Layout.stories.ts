import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FormGrid from './FormGrid.vue';
import FilterBar from './FilterBar.vue';
import Pagination from './Pagination.vue';
import ResourceList from './ResourceList.vue';
import Field from './Field.vue';
import Input from './Input.vue';
import Select from './Select.vue';
import Label from './Label.vue';
import Button from './Button.vue';
import Icon from './Icon.vue';
import Badge from './Badge.vue';
import StatusBadge from './StatusBadge.vue';

const meta: Meta = {
    title: 'Atoms/Layout',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const FormGridTwoColumn: Story = {
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

export const FilterBarWithReset: Story = {
    render: () => ({
        components: { FilterBar, Label, Select, Button, Icon },
        template: `
            <FilterBar class="max-w-2xl">
                <Label for="env">Environment</Label>
                <Select name="env" :options="[{ value: 'prod', label: 'Production' }]" placeholder="All environments" />
                <template #reset>
                    <Button href="#" variant="ghost" size="sm"><Icon name="x" size="sm" /> Reset</Button>
                </template>
            </FilterBar>`,
    }),
};

export const ResourceListPopulated: Story = {
    render: () => ({
        components: { ResourceList, Badge, StatusBadge },
        setup() {
            const items = [
                { displayName: 'DocuWare Luxor', host: 'luxor.docuware.cloud', href: '#1' },
                { displayName: 'codebar Solutions', host: 'codebar.docuware.cloud', href: '#2' },
            ];
            return { items };
        },
        template: `
            <ResourceList
                class="max-w-2xl"
                :items="items"
                add-href="#new"
                add-label="Add new instance"
            >
                <template #row="{ item }">
                    <span class="font-semibold text-base text-ink truncate block">{{ item.displayName }}</span>
                    <p class="text-dim text-xs mt-0.5 truncate">DocuWare · {{ item.host }}</p>
                </template>
                <template #row-trailing>
                    <StatusBadge variant="green" label="Active" :dot="true" />
                </template>
            </ResourceList>`,
    }),
};

export const ResourceListEmpty: Story = {
    render: () => ({
        components: { ResourceList },
        template: `
            <ResourceList
                class="max-w-2xl"
                :items="[]"
                empty-icon="server"
                empty-title="No instances yet"
                empty-description="Connect an instance to get started."
                add-href="#new"
                add-label="Add new instance"
            />`,
    }),
};

export const PagerBoth: Story = {
    render: () => ({
        components: { Pagination },
        template: `<Pagination prev-href="#prev" next-href="#next" />`,
    }),
};

export const PagerWithNavigate: Story = {
    render: () => ({
        components: { Pagination },
        setup: () => ({
            onNavigate: (href: string) => window.alert(`Intercepted navigate to ${href}`),
        }),
        template: `<Pagination prev-href="#prev" next-href="#next" :on-navigate="onNavigate" />`,
    }),
};
