import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AppShell from './AppShell.vue';
import Sidebar from '../organisms/Sidebar.vue';
import SidebarGroup from '../organisms/SidebarGroup.vue';
import SidebarItem from '../organisms/SidebarItem.vue';
import Navbar from '../organisms/Navbar.vue';
import Avatar from '../atoms/Avatar.vue';
import Badge from '../atoms/Badge.vue';
import Card from '../molecules/Card.vue';
import PageHeading from '../molecules/PageHeading.vue';

const meta: Meta<typeof AppShell> = {
    title: 'Layouts/AppShell',
    component: AppShell,
    parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
    render: () => ({
        components: { AppShell, Sidebar, SidebarGroup, SidebarItem, Navbar, Avatar, Badge, Card, PageHeading },
        template: `
            <AppShell>
                <template #sidebar>
                    <Sidebar>
                        <template #brand>
                            <span class="text-sm font-semibold text-ink">DocuHub</span>
                        </template>
                        <SidebarGroup label="Workspace">
                            <SidebarItem href="#" icon="chart" :active="true">Dashboard</SidebarItem>
                            <SidebarItem href="#" icon="server">Instances</SidebarItem>
                            <SidebarItem href="#" icon="sparkles">Flows</SidebarItem>
                        </SidebarGroup>
                        <SidebarGroup label="Admin">
                            <SidebarItem href="#" icon="cog">Settings</SidebarItem>
                        </SidebarGroup>
                        <template #footer>
                            <SidebarGroup>
                                <SidebarItem href="#" icon="logout">Sign out</SidebarItem>
                            </SidebarGroup>
                        </template>
                    </Sidebar>
                </template>
                <template #navbar="{ toggleSidebar }">
                    <Navbar @toggle-sidebar="toggleSidebar">
                        <template #brand><span class="text-sm font-semibold text-ink">DocuHub</span></template>
                        <template #actions>
                            <Badge variant="success">All systems go</Badge>
                            <Avatar name="Max Mustermann" size="sm" />
                        </template>
                    </Navbar>
                </template>

                <PageHeading eyebrow="Workspace">Dashboard</PageHeading>
                <div class="mt-6 grid gap-4 sm:grid-cols-2">
                    <Card title="Documents today">
                        <p class="text-2xl font-semibold text-ink">1'284</p>
                    </Card>
                    <Card title="Auto-filed (Green)">
                        <p class="text-2xl font-semibold text-ink">86%</p>
                    </Card>
                </div>
            </AppShell>`,
    }),
};
