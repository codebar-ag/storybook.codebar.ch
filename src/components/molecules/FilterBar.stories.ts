import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FilterBar from './FilterBar.vue';
import Label from '../atoms/Label.vue';
import Select from '../atoms/Select.vue';
import Button from '../atoms/Button.vue';
import Icon from '../atoms/Icon.vue';

const meta: Meta<typeof FilterBar> = {
    title: 'Molecules/FilterBar',
    component: FilterBar,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
    render: () => ({
        components: { FilterBar, Label, Select },
        template: `
            <FilterBar class="max-w-2xl">
                <Label for="env">Environment</Label>
                <Select name="env" :options="[{ value: 'prod', label: 'Production' }]" placeholder="All environments" />
            </FilterBar>`,
    }),
};

export const WithReset: Story = {
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
