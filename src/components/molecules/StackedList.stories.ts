import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import StackedList from './StackedList.vue';
import ListRow from './ListRow.vue';
import Card from './Card.vue';
import Badge from '../atoms/Badge.vue';
import StatusBadge from '../atoms/StatusBadge.vue';
import Icon from '../atoms/Icon.vue';

const meta: Meta<typeof StackedList> = {
    title: 'Molecules/StackedList',
    component: StackedList,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof StackedList>;

// Rows with `title`, `description` and a `#badge`: one typography for every
// list. No `:first` needed: the list drops the first row's divider itself.
export const Default: Story = {
    render: () => ({
        components: { StackedList, ListRow, Card, Badge, StatusBadge, Icon },
        template: `
            <Card :padded="false" class="max-w-lg">
                <StackedList>
                    <ListRow href="#" title="Offer S00142" description="12.09.2026 · 4'200.00 CHF">
                        <template #badge><StatusBadge variant="info" label="Awaiting answer" /></template>
                        <template #trailing><Icon name="arrow" size="sm" /></template>
                    </ListRow>
                    <ListRow href="#" title="Offer S00139" description="02.09.2026 · 860.00 CHF">
                        <template #badge><StatusBadge variant="success" label="Accepted" /></template>
                        <template #trailing><Icon name="arrow" size="sm" /></template>
                    </ListRow>
                    <ListRow title="Anna Muster" description="anna@example.com">
                        <template #badge><Badge size="sm">You</Badge></template>
                    </ListRow>
                </StackedList>
            </Card>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const list = canvas.getByRole('list');

        // Valid list markup: three <li> items, each holding its row.
        await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
        // The first row carries no top divider, the second does.
        const rows = list.querySelectorAll(':scope > li > *');
        await expect(getComputedStyle(rows[0]).borderTopWidth).toBe('0px');
        await expect(getComputedStyle(rows[1]).borderTopWidth).not.toBe('0px');
    },
};
