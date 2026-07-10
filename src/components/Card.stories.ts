import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Card from './Card.vue';
import Button from './Button.vue';

const meta: Meta<typeof Card> = {
    title: 'Atoms/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
    render: () => ({
        components: { Card },
        template: `<Card title="Instance settings" description="Configure how this instance behaves.">
            <p class="text-sm text-muted">Card body content goes here.</p>
        </Card>`,
    }),
};

export const WithActionsAndFooter: Story = {
    render: () => ({
        components: { Card, Button },
        template: `<Card title="Members" description="People with dashboard access.">
            <template #actions><Button size="sm">Invite</Button></template>
            <p class="text-sm text-muted">Body.</p>
            <template #footer>3 members · 2 pending invitations</template>
        </Card>`,
    }),
};
