import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * The theming API: what a consuming app may redefine (role tokens) and what it
 * may select on (data-* hooks) to restyle the kit without forking a component
 * or targeting utility classes. The kit ships no theme of its own; every
 * default below renders the kit exactly as it looks without any theme.
 *
 * Theming is SKIN ONLY: colours, fonts, borders, radii and shadows. A theme
 * never repositions, resizes or hides a component; layout and sizes stay the
 * kit's.
 *
 * Both lists are PUBLIC API: renaming or removing a token, a `data-slot` name
 * or a `data-*` value is a breaking change (major version).
 */
const meta: Meta = {
    title: 'Foundations/Theming',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const tokens = [
    { token: '--font-ui', fallback: 'var(--font-mono)', use: 'App font: the body of a consuming app (`font-ui`).' },
    { token: '--font-heading', fallback: 'var(--font-ui)', use: 'PageHeading, Card, Modal and Drawer titles.' },
    { token: '--font-weight-heading', fallback: '600', use: 'Weight of the same titles.' },
    { token: '--text-page-title', fallback: 'var(--text-xl)', use: 'PageHeading size (with --text-page-title--line-height).' },
    { token: '--color-primary', fallback: 'var(--color-ink)', use: 'Button variant="primary" fill, FileInput button.' },
    { token: '--color-primary-hover', fallback: 'var(--color-ink-hover)', use: 'Primary button hover fill.' },
    { token: '--color-on-primary', fallback: '#ffffff', use: 'Text on the primary fill.' },
    { token: '--color-link', fallback: 'var(--color-accent)', use: 'Link tone="accent".' },
    { token: '--color-link-hover', fallback: 'var(--color-link)', use: 'Link tone="accent" on hover.' },
    { token: '--color-focus', fallback: 'var(--color-accent)', use: 'Every focus-visible ring (`ring-focus/50`).' },
    { token: '--color-nav-active-bg', fallback: 'var(--color-surface-2)', use: 'Active SidebarItem fill.' },
    { token: '--color-nav-active-fg', fallback: 'var(--color-ink)', use: 'Active SidebarItem text.' },
    { token: '--color-nav-active-marker', fallback: 'transparent', use: 'Active SidebarItem left edge bar (3px).' },
    { token: '--color-tab-active-fg', fallback: 'var(--color-ink)', use: 'Active Tab / Tabs label.' },
    { token: '--color-tab-active-marker', fallback: 'transparent', use: 'Active Tab / Tabs underline (2px).' },
    { token: '--color-chrome', fallback: 'var(--color-surface)', use: 'Navbar and Sidebar background.' },
    { token: '--shadow-chrome', fallback: '0 0 #0000 (none)', use: 'Navbar and Sidebar elevation.' },
    { token: '--border-control', fallback: '1px', use: 'Border width of Input, Select, Textarea, Combobox, InputNumber, SearchableSelect, FileInput.' },
];

const hooks = [
    { component: 'Button', attrs: 'data-slot="button" · data-variant="primary|secondary|ghost|danger|subtle|cta" · data-size="sm|md|lg"' },
    { component: 'Link', attrs: 'data-slot="link" · data-variant="default|muted|accent" (its `tone` prop)' },
    { component: 'ButtonGroup', attrs: 'data-slot="button-group" (no selection state of its own)' },
    { component: 'Input, Select, Textarea, Combobox, InputNumber, FileInput, SearchableSelect (trigger), PasswordInput (via Input)', attrs: 'data-slot="control" · data-state="invalid"' },
    { component: 'Badge', attrs: 'data-slot="badge" · data-tone="neutral|info|success|warning|danger" or data-category="indigo|purple|magenta" · data-size' },
    { component: 'StatusBadge', attrs: 'data-slot="status-badge" (on the Badge root, with its data-tone) · dot: data-slot="status-badge-dot"' },
    { component: 'Alert', attrs: 'data-slot="alert" · data-tone · title: data-slot="alert-title"' },
    { component: 'Toaster', attrs: 'each toast: data-slot="toast" · data-tone="success|danger|warning|info"' },
    { component: 'Card', attrs: 'data-slot="card" · data-variant · card-header · card-title · card-body · card-footer' },
    { component: 'PageHeading', attrs: 'data-slot="page-heading" · h1: data-slot="page-title"' },
    { component: 'Breadcrumbs', attrs: 'data-slot="breadcrumbs"' },
    { component: 'Tab (TabGroup) / Tabs', attrs: 'track: data-slot="tabs" · each tab: data-slot="tab" · data-state="active"' },
    { component: 'Sidebar', attrs: 'data-slot="sidebar" · sidebar-brand · sidebar-footer' },
    { component: 'SidebarGroup', attrs: 'data-slot="sidebar-group" · caption: data-slot="sidebar-group-label"' },
    { component: 'SidebarItem', attrs: 'data-slot="sidebar-item" · data-state="active" · sidebar-item-icon · sidebar-item-count' },
    { component: 'Navbar', attrs: 'data-slot="navbar"' },
    { component: 'AppShell', attrs: 'data-slot="app-shell"' },
    { component: 'AuthLayout', attrs: 'data-slot="auth-layout" · auth-brand · auth-card (the Card) · auth-footer' },
    { component: 'Modal / Drawer', attrs: 'panel: data-slot="modal" / "drawer" · title: modal-title / drawer-title' },
    { component: 'Table / DataTable', attrs: 'data-slot="table" (DataTable root: "data-table") · th · td (Th and Td atoms carry them too)' },
    { component: 'Pagination', attrs: 'data-slot="pagination"' },
    { component: 'EmptyState', attrs: 'data-slot="empty-state" · empty-state-title' },
    { component: 'Metric / MetricGrid', attrs: 'data-slot="metric" · metric-label · metric-value · grid: data-slot="metric-grid"' },
];

export const RoleTokens: Story = {
    name: 'Role tokens',
    render: () => ({
        setup: () => ({ tokens }),
        template: `
            <div class="max-w-4xl space-y-4">
                <p class="text-sm text-muted">
                    Redefine these on <code>:root</code> (under the app's own selector). They cover
                    colours, fonts, borders, radii and shadows only; there are deliberately no size or
                    layout tokens. They are
                    <code>var()</code> references resolved on <code>:root</code>: set them there, not on a
                    nested element, or the role token keeps the value it resolved at the root.
                </p>
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-line text-2xs uppercase tracking-wider text-dim">
                            <th class="py-2 pr-4 font-medium">Token</th>
                            <th class="py-2 pr-4 font-medium">Default</th>
                            <th class="py-2 font-medium">Used by</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in tokens" :key="t.token" class="border-t border-line first:border-t-0">
                            <td class="py-2 pr-4 font-mono text-ink">{{ t.token }}</td>
                            <td class="py-2 pr-4 font-mono text-muted">{{ t.fallback }}</td>
                            <td class="py-2 text-muted">{{ t.use }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`,
    }),
};

export const Hooks: Story = {
    name: 'Component hooks',
    render: () => ({
        setup: () => ({ hooks }),
        template: `
            <div class="max-w-4xl space-y-4">
                <p class="text-sm text-muted">
                    Select on these attributes, never on utility classes: classes change between
                    releases, these do not. <code>data-state</code> is only present while the state
                    applies (e.g. <code>[data-slot="tab"][data-state="active"]</code>).
                </p>
                <p class="text-sm text-ink">
                    The hooks are for <strong>styling only</strong>: colour, font, border, radius and
                    shadow. They must never be used to reposition, resize or hide a component
                    (no <code>display</code>, <code>position</code>, <code>width</code>/<code>height</code>,
                    padding, margin or order changes). Layout and sizes belong to the kit.
                </p>
                <table class="w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-line text-2xs uppercase tracking-wider text-dim">
                            <th class="py-2 pr-4 font-medium">Component</th>
                            <th class="py-2 font-medium">Attributes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in hooks" :key="h.component" class="border-t border-line first:border-t-0">
                            <td class="py-2 pr-4 text-ink">{{ h.component }}</td>
                            <td class="py-2 font-mono text-xs text-muted">{{ h.attrs }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`,
    }),
};
