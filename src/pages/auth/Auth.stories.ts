import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { computed, ref } from 'vue';
// Pages compose EXCLUSIVELY the public API — any import that can't come from
// here means the kit is missing a component and it goes back into the catalog.
import {
    Alert,
    AuthLayout,
    Button,
    Checkbox,
    Divider,
    Field,
    Input,
    Link,
    PasswordInput,
    PinInput,
    Progress,
    useFormErrors,
} from '../../index';

const meta: Meta = {
    title: 'Pages/Auth',
    parameters: { layout: 'fullscreen' },
    // Pages are compositions, not components — no autodocs page.
    tags: ['!autodocs'],
};

export default meta;
type Story = StoryObj;

export const Login: Story = {
    render: () => ({
        components: { Alert, AuthLayout, Button, Checkbox, Field, Input, Link, PasswordInput },
        setup: () => {
            const email = ref('');
            const password = ref('');
            const remember = ref(false);
            const submitting = ref(false);
            const errors = ref<Record<string, string> | null>(null);
            const { errorFor, invalid, hasErrors } = useFormErrors(() => errors.value);

            function submit(): void {
                const bag: Record<string, string> = {};
                if (!email.value) {
                    bag.email = 'The email address is required.';
                }
                if (!password.value) {
                    bag.password = 'The password is required.';
                }
                errors.value = Object.keys(bag).length ? bag : null;
                if (!errors.value) {
                    submitting.value = true;
                }
            }

            return { email, password, remember, submitting, errorFor, invalid, hasErrors, submit };
        },
        template: `
            <AuthLayout title="Sign in" description="Use your DocuHub account.">
                <template #brand>
                    <span class="text-lg font-semibold text-ink">DocuHub</span>
                </template>
                <form class="space-y-4" novalidate @submit.prevent="submit">
                    <Alert v-if="hasErrors" variant="danger" title="Sign-in failed">
                        Please fix the highlighted fields.
                    </Alert>
                    <Field label="Email" name="email" :error="errorFor('email')">
                        <Input v-model="email" type="email" name="email" :invalid="invalid('email')" autocomplete="email" />
                    </Field>
                    <Field label="Password" name="password" :error="errorFor('password')">
                        <PasswordInput v-model="password" name="password" :invalid="invalid('password')" />
                    </Field>
                    <div class="flex items-center justify-between gap-2">
                        <Checkbox v-model="remember" name="remember">Remember me</Checkbox>
                        <Link href="#" tone="accent">Forgot password?</Link>
                    </div>
                    <Button type="submit" class="w-full" :loading="submitting">Sign in</Button>
                </form>
                <template #footer>
                    No account yet? <Link href="#">Ask your admin for an invite.</Link>
                </template>
            </AuthLayout>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Keep one reference: once loading, the sr-only spinner label prefixes
        // the accessible name ("Loading… Sign in"), so a re-query by the plain
        // name would fail.
        const submit = canvas.getByRole('button', { name: 'Sign in' });
        // The card plays the page-enter fade; wait it out before interacting.
        await waitFor(() => expect(submit).toBeVisible());

        // Submitting empty shows the server-driven error state.
        await userEvent.click(submit);
        await waitFor(() => expect(canvas.getByText('Sign-in failed')).toBeVisible());
        await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');

        // Filling the form clears it and the button enters its loading state.
        await userEvent.type(canvas.getByLabelText('Email'), 'sebastian@codebar.ch');
        await userEvent.type(canvas.getByLabelText('Password'), 'demo value only');
        await userEvent.click(submit);
        await expect(canvas.queryByText('Sign-in failed')).not.toBeInTheDocument();
        await expect(submit).toHaveAttribute('aria-busy', 'true');
    },
};

export const Register: Story = {
    render: () => ({
        components: { AuthLayout, Button, Divider, Field, Input, Link, PasswordInput, Progress },
        setup: () => {
            const name = ref('');
            const email = ref('');
            const password = ref('');
            // Toy strength heuristic — real scoring is the consuming app's job.
            const strength = computed(() => {
                let score = 0;
                if (password.value.length >= 8) score += 40;
                if (/[A-Z]/.test(password.value)) score += 20;
                if (/[0-9]/.test(password.value)) score += 20;
                if (/[^A-Za-z0-9]/.test(password.value)) score += 20;
                return score;
            });
            return { name, email, password, strength };
        },
        template: `
            <AuthLayout title="Create account" description="Start filing documents in minutes.">
                <template #brand><span class="text-lg font-semibold text-ink">DocuHub</span></template>
                <form class="space-y-4" novalidate @submit.prevent>
                    <Field label="Full name" name="name">
                        <Input v-model="name" name="name" autocomplete="name" />
                    </Field>
                    <Field label="Email" name="email">
                        <Input v-model="email" type="email" name="email" autocomplete="email" />
                    </Field>
                    <Field label="Password" name="password" hint="At least 8 characters, with a number and a symbol.">
                        <PasswordInput v-model="password" name="password" />
                    </Field>
                    <Progress :value="strength" :max="100" aria-label="Password strength" />
                    <Button type="submit" class="w-full">Create account</Button>
                    <Divider label="or" />
                    <Button variant="secondary" class="w-full">Continue with SSO</Button>
                </form>
                <template #footer>
                    Already registered? <Link href="#">Sign in</Link>
                </template>
            </AuthLayout>`,
    }),
};

export const PasswordResetRequest: Story = {
    render: () => ({
        components: { Alert, AuthLayout, Button, Field, Input, Link },
        setup: () => ({ email: ref(''), sent: ref(false) }),
        template: `
            <AuthLayout title="Reset password" description="We'll email you a reset link.">
                <template #brand><span class="text-lg font-semibold text-ink">DocuHub</span></template>
                <Alert v-if="sent" variant="success" title="Link sent">
                    Check {{ email || 'your inbox' }} for the reset link. It expires in 60 minutes.
                </Alert>
                <form v-else class="space-y-4" novalidate @submit.prevent="sent = true">
                    <Field label="Email" name="email">
                        <Input v-model="email" type="email" name="email" autocomplete="email" />
                    </Field>
                    <Button type="submit" class="w-full">Send reset link</Button>
                </form>
                <template #footer>
                    <Link href="#">Back to sign-in</Link>
                </template>
            </AuthLayout>`,
    }),
};

export const PasswordResetSet: Story = {
    render: () => ({
        components: { AuthLayout, Button, Field, PasswordInput },
        setup: () => ({ password: ref(''), confirm: ref('') }),
        template: `
            <AuthLayout title="Choose a new password" description="For sebastian@codebar.ch">
                <template #brand><span class="text-lg font-semibold text-ink">DocuHub</span></template>
                <form class="space-y-4" novalidate @submit.prevent>
                    <Field label="New password" name="password" hint="At least 8 characters.">
                        <PasswordInput v-model="password" name="password" />
                    </Field>
                    <Field label="Repeat password" name="password_confirmation">
                        <PasswordInput v-model="confirm" name="password_confirmation" />
                    </Field>
                    <Button type="submit" class="w-full">Save password</Button>
                </form>
            </AuthLayout>`,
    }),
};

export const MagicLink: Story = {
    render: () => ({
        components: { Alert, AuthLayout, Button, Link },
        template: `
            <AuthLayout title="Check your inbox" description="We sent a sign-in link to sebastian@codebar.ch.">
                <template #brand><span class="text-lg font-semibold text-ink">DocuHub</span></template>
                <div class="space-y-4">
                    <Alert variant="info">
                        The link is valid for 15 minutes and can be used once.
                    </Alert>
                    <Button variant="secondary" class="w-full">Resend link</Button>
                </div>
                <template #footer>
                    Wrong address? <Link href="#">Start over</Link>
                </template>
            </AuthLayout>`,
    }),
};

export const Otp: Story = {
    render: () => ({
        components: { AuthLayout, Button, Field, Link, PinInput },
        setup: () => ({ code: ref('') }),
        template: `
            <AuthLayout title="Two-factor check" description="Enter the 6-digit code from your authenticator app.">
                <template #brand><span class="text-lg font-semibold text-ink">DocuHub</span></template>
                <form class="space-y-5" novalidate @submit.prevent>
                    <div class="flex justify-center">
                        <PinInput v-model="code" :length="6" name="otp" />
                    </div>
                    <Button type="submit" class="w-full" :disabled="code.length < 6">Verify</Button>
                </form>
                <template #footer>
                    Lost your device? <Link href="#">Use a recovery code</Link>
                </template>
            </AuthLayout>`,
    }),
};
