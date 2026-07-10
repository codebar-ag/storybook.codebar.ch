import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ResourceList from './ResourceList.vue';
import StatusBadge from '../atoms/StatusBadge.vue';

const meta: Meta<typeof ResourceList> = {
    title: 'Organisms/ResourceList',
    component: ResourceList,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof ResourceList>;

export const Populated: Story = {
    render: () => ({
        components: { ResourceList, StatusBadge },
        setup() {
            const items = [
                { displayName: 'DocuWare Mustermann', host: 'mustermann.docuware.cloud', href: '#1' },
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

export const Empty: Story = {
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
