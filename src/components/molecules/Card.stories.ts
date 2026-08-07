import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Card from './Card.vue';
import Button from '../atoms/Button.vue';
import StatusBadge from '../atoms/StatusBadge.vue';

const meta: Meta<typeof Card> = {
    title: 'Molecules/Card',
    component: Card,
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

// The `#title` slot replaces the `title` prop when present. Its reason to exist
// is this shape: a status badge on the title line, where a reader looks for the
// state of the thing the card is about — rather than in `#actions`, which is
// the far side of the header and reads as a control.
export const TitleSlot: Story = {
    render: () => ({
        components: { Card, StatusBadge },
        template: `<Card description="The badge sits on the title line, not across the header in #actions.">
            <template #title>
                Nightly sync
                <StatusBadge variant="success" label="Active" dot />
            </template>
            <p class="text-sm text-muted">Body.</p>
        </Card>`,
    }),
};

export const Small: Story = {
    render: () => ({
        components: { Card },
        template: `<Card size="sm" title="Header field">
            <p class="text-sm text-muted">A denser card for rows nested inside a larger container.</p>
        </Card>`,
    }),
};
