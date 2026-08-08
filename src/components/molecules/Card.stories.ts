import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ref } from 'vue';
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

// The header's existence is decided per render, not once at mount. A card with
// no `title` and no `description` starts with no header at all; the moment a
// conditional `#actions` template turns on, the header — and the actions it
// contains — has to appear, and has to go again when it turns off. This is the
// shape a form card takes: the Save button only exists once the form is
// complete enough to submit, and the card carrying it has no title.
export const ActionsAppearingAfterMount: Story = {
    render: () => ({
        components: { Card, Button },
        setup: () => ({ ready: ref(false) }),
        template: `<Card>
            <template
                v-if="ready"
                #actions
            ><Button size="sm">Save</Button></template>
            <Button
                size="sm"
                variant="secondary"
                @click="ready = !ready"
            >{{ ready ? 'Reset' : 'Complete form' }}</Button>
        </Card>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: 'Complete form' }));
        await waitFor(() => expect(canvas.getByRole('button', { name: 'Save' })).toBeVisible());

        await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
        await waitFor(() =>
            expect(canvas.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument(),
        );
    },
};

// Same rule for `#title`: a card that gains a title after mount gains a header.
export const TitleAppearingAfterMount: Story = {
    render: () => ({
        components: { Card, Button },
        setup: () => ({ loaded: ref(false) }),
        template: `<Card>
            <template
                v-if="loaded"
                #title
            >Nightly sync</template>
            <Button
                size="sm"
                variant="secondary"
                @click="loaded = !loaded"
            >{{ loaded ? 'Unload' : 'Load' }}</Button>
        </Card>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.queryByRole('heading', { name: 'Nightly sync' })).not.toBeInTheDocument();

        await userEvent.click(canvas.getByRole('button', { name: 'Load' }));
        await waitFor(() =>
            expect(canvas.getByRole('heading', { name: 'Nightly sync' })).toBeVisible(),
        );

        await userEvent.click(canvas.getByRole('button', { name: 'Unload' }));
        await waitFor(() =>
            expect(canvas.queryByRole('heading', { name: 'Nightly sync' })).not.toBeInTheDocument(),
        );
    },
};

export const Small: Story = {
    render: () => ({
        components: { Card },
        template: `<Card size="sm" title="Header field">
            <p class="text-sm text-muted">A denser card for rows nested inside a larger container.</p>
        </Card>`,
    }),
};
