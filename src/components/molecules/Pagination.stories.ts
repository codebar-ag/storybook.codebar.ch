import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import Pagination from './Pagination.vue';

const meta: Meta<typeof Pagination> = {
    title: 'Molecules/Pagination',
    component: Pagination,
    render: (args) => ({
        components: { Pagination },
        setup: () => ({ args }),
        template: '<Pagination v-bind="args" />',
    }),
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const PrevAndNext: Story = {
    args: { prevHref: '#prev', nextHref: '#next' },
};

// First page of a cursor-paginated list: no previous link, so only "Next" renders.
export const OnlyNext: Story = {
    args: { nextHref: '#next' },
};

// `onNavigate` intercepts the click (preventDefault) so the caller can handle
// navigation itself — e.g. Inertia's router.visit for a preserve-state reload.
export const WithNavigateInterceptor: Story = {
    args: { prevHref: '#prev', nextHref: '#next', onNavigate: fn() },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('link', { name: 'Next' }));
        await expect(args.onNavigate).toHaveBeenCalledWith('#next');

        await userEvent.click(canvas.getByRole('link', { name: 'Previous' }));
        await expect(args.onNavigate).toHaveBeenCalledWith('#prev');
    },
};
