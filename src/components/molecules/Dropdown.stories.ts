import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';

const meta: Meta<typeof Dropdown> = {
    title: 'Molecules/Dropdown',
    component: Dropdown,
    argTypes: {
        align: { control: 'inline-radio', options: ['left', 'right'] },
    },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
    render: () => ({
        components: { Dropdown, DropdownItem },
        // The trigger slot provides only the visual face — Dropdown renders
        // the actual <button aria-haspopup="menu"> around it.
        template: `<Dropdown align="left">
            <template #trigger>
                <span class="inline-flex items-center gap-1.5 h-11 px-4 text-sm bg-surface-2 border border-line rounded-control">Menu</span>
            </template>
            <DropdownItem href="#">Settings</DropdownItem>
            <DropdownItem :active="true">Members</DropdownItem>
            <DropdownItem>Sign out</DropdownItem>
        </Dropdown>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const trigger = canvas.getByRole('button', { name: 'Menu' });

        await userEvent.click(trigger);
        await expect(canvas.getByRole('menu')).toBeVisible();

        // Arrow keys walk the items; Escape closes and returns focus.
        await userEvent.keyboard('{ArrowDown}');
        await expect(canvas.getByRole('menuitem', { name: 'Settings' })).toHaveFocus();
        await userEvent.keyboard('{ArrowDown}');
        await expect(canvas.getByRole('menuitem', { name: 'Members' })).toHaveFocus();
        await userEvent.keyboard('{End}');
        await expect(canvas.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus();

        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument());
        await expect(trigger).toHaveFocus();
    },
};

// `width` accepts a width utility class for menus that need more room than
// the default w-56 panel.
export const WideDropdown: Story = {
    render: () => ({
        components: { Dropdown, DropdownItem },
        template: `<Dropdown align="left" width="w-80">
            <template #trigger>
                <span class="inline-flex items-center gap-1.5 h-11 px-4 text-sm bg-surface-2 border border-line rounded-control">Tenant switcher</span>
            </template>
            <DropdownItem href="#">A menu that needs more room for long tenant names</DropdownItem>
            <DropdownItem href="#">Second tenant</DropdownItem>
        </Dropdown>`,
    }),
};
