import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Tooltip from './Tooltip.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof Tooltip> = {
    title: 'Molecules/Tooltip',
    component: Tooltip,
    argTypes: {
        placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    },
    args: { text: 'Copies the MCP server URL', placement: 'top' },
    render: (args) => ({
        components: { Tooltip, Button },
        setup: () => ({ args }),
        template: `
            <div class="p-12">
                <Tooltip v-bind="args">
                    <template #default="{ describedBy }">
                        <Button variant="secondary" :aria-describedby="describedBy">Copy URL</Button>
                    </template>
                </Tooltip>
            </div>`,
    }),
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: 'Copy URL' });
        const tooltip = canvas.getByRole('tooltip');

        // Hidden at rest, shown on hover AND on keyboard focus.
        await expect(tooltip).toHaveClass(/opacity-0/);
        await userEvent.hover(button);
        await waitFor(() => expect(tooltip).toHaveClass(/opacity-100/));
        await userEvent.unhover(button);
        await waitFor(() => expect(tooltip).toHaveClass(/opacity-0/));

        button.focus();
        await waitFor(() => expect(tooltip).toHaveClass(/opacity-100/));
        await expect(button).toHaveAttribute('aria-describedby', tooltip.id);
        button.blur();
    },
};

export const Placements: Story = {
    render: () => ({
        components: { Tooltip, Button },
        template: `
            <div class="flex items-center gap-6 p-16">
                <Tooltip text="Top" placement="top">
                    <template #default="{ describedBy }"><Button variant="ghost" :aria-describedby="describedBy">Top</Button></template>
                </Tooltip>
                <Tooltip text="Bottom" placement="bottom">
                    <template #default="{ describedBy }"><Button variant="ghost" :aria-describedby="describedBy">Bottom</Button></template>
                </Tooltip>
                <Tooltip text="Left" placement="left">
                    <template #default="{ describedBy }"><Button variant="ghost" :aria-describedby="describedBy">Left</Button></template>
                </Tooltip>
                <Tooltip text="Right" placement="right">
                    <template #default="{ describedBy }"><Button variant="ghost" :aria-describedby="describedBy">Right</Button></template>
                </Tooltip>
            </div>`,
    }),
};
