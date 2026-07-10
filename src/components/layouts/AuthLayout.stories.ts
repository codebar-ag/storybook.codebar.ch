import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AuthLayout from './AuthLayout.vue';
import Button from '../atoms/Button.vue';
import Field from '../molecules/Field.vue';
import Input from '../atoms/Input.vue';
import Link from '../atoms/Link.vue';

const meta: Meta<typeof AuthLayout> = {
    title: 'Layouts/AuthLayout',
    component: AuthLayout,
    parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

// Full auth screens live under Pages/Auth — this is the bare shell.
export const Default: Story = {
    render: () => ({
        components: { AuthLayout, Button, Field, Input, Link },
        template: `
            <AuthLayout title="Sign in" description="Use your DocuHub account.">
                <template #brand><span class="text-lg font-semibold text-ink">DocuHub</span></template>
                <form class="space-y-4" novalidate @submit.prevent>
                    <Field label="Email" name="email">
                        <Input type="email" name="email" />
                    </Field>
                    <Button type="submit" class="w-full">Continue</Button>
                </form>
                <template #footer>
                    No account yet? <Link href="#">Ask your admin for an invite.</Link>
                </template>
            </AuthLayout>`,
    }),
};
