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
                <DescriptionItem label="URL">mustermann.docuware.cloud</DescriptionItem>
                <DescriptionItem label="Auth">Authorization Code</DescriptionItem>
                <DescriptionItem label="Created" tone="muted">12 Jun 2026</DescriptionItem>
            </DescriptionList>`,
    }),
};

// `layout="rows"` for a full-width card: the label keeps its line however long
// it runs, the value sits at the far edge, and a rule under each pair carries
// the eye across. Compare with `GutterLabelsWrap` below.
export const Rows: Story = {
    render: () => ({
        components: { DescriptionList, DescriptionItem },
        template: `
            <DescriptionList layout="rows">
                <DescriptionItem label="Documents per day">2'000</DescriptionItem>
                <DescriptionItem label="Documents per scheduler run">5</DescriptionItem>
                <DescriptionItem label="Dispatch attempts per document">3</DescriptionItem>
                <DescriptionItem label="Requests per endpoint (per minute)">60</DescriptionItem>
                <DescriptionItem label="Workspace-wide rate limit multiplier">4</DescriptionItem>
                <DescriptionItem label="Download link validity (minutes)">15</DescriptionItem>
            </DescriptionList>`,
    }),
};

// What the fixed label gutter does to a long label — kept as a story so the
// trade-off is visible rather than folded into prose.
export const GutterLabelsWrap: Story = {
    render: () => ({
        components: { DescriptionList, DescriptionItem },
        template: `
            <DescriptionList class="max-w-md">
                <DescriptionItem label="Documents per scheduler run">5</DescriptionItem>
                <DescriptionItem label="Workspace-wide rate limit multiplier">4</DescriptionItem>
            </DescriptionList>`,
    }),
};
