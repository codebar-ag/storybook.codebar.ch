import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Popover from './Popover.vue';
import Field from './Field.vue';
import Input from '../atoms/Input.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof Popover> = {
    title: 'Molecules/Popover',
    component: Popover,
    argTypes: {
        align: { control: 'inline-radio', options: ['left', 'right'] },
    },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    render: () => ({
        components: { Popover, Field, Input, Button },
        template: `
            <div class="p-4 pb-56">
                <Popover align="left">
                    <template #trigger>
                        <span class="inline-flex items-center h-11 px-4 text-sm bg-surface-2 border border-line rounded-control">Rename flow</span>
                    </template>
                    <Field label="Flow name" name="flow-name">
                        <Input name="flow-name" model-value="Invoices → e_invoices" />
                    </Field>
                </Popover>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('button', { name: 'Rename flow' });

        await userEvent.click(trigger);
        await expect(canvas.getByRole('dialog')).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');

        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
        await expect(trigger).toHaveFocus();
    },
};
