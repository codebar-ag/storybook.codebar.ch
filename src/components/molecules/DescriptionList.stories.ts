import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DescriptionList from './DescriptionList.vue';
import DescriptionItem from './DescriptionItem.vue';

const meta: Meta<typeof DescriptionList> = {
    title: 'Molecules/DescriptionList',
    component: DescriptionList,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

// Read-only metadata rows; `tone="muted"` de-emphasises secondary values.
export const Metadata: Story = {
    render: () => ({
        components: { DescriptionList, DescriptionItem },
        template: `
            <DescriptionList class="max-w-md">
                <DescriptionItem label="URL">luxor.docuware.cloud</DescriptionItem>
                <DescriptionItem label="Auth">Authorization Code</DescriptionItem>
                <DescriptionItem label="Created" tone="muted">12 Jun 2026</DescriptionItem>
            </DescriptionList>`,
    }),
};
