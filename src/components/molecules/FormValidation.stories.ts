import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import { useFormErrors } from '../../composables/useFormErrors';
import Alert from './Alert.vue';
import Field from './Field.vue';
import FormActions from './FormActions.vue';
import Input from '../atoms/Input.vue';
import Button from '../atoms/Button.vue';

// The kit's validation pattern: errors are server-driven (Laravel/Inertia
// shape) and adapted to Field/Input via useFormErrors — no client-side
// validation library.
const meta: Meta = {
    title: 'Molecules/Form Validation',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ServerDrivenErrors: Story = {
    render: () => ({
        components: { Alert, Field, FormActions, Input, Button },
        setup: () => {
            const name = ref('');
            const url = ref('not-a-url');
            const errors = ref<Record<string, string> | null>(null);
            const { errorFor, invalid, hasErrors } = useFormErrors(() => errors.value);

            // Stand-in for the server round-trip.
            function submit(): void {
                const bag: Record<string, string> = {};
                if (!name.value) {
                    bag.name = 'The instance name is required.';
                }
                if (!/^https?:\/\//.test(url.value)) {
                    bag.url = 'The URL must start with http:// or https://.';
                }
                errors.value = Object.keys(bag).length ? bag : null;
            }

            return { name, url, errorFor, invalid, hasErrors, submit };
        },
        template: `
            <form class="w-96 space-y-4" novalidate @submit.prevent="submit">
                <Alert v-if="hasErrors" variant="danger" title="Could not save">
                    Please fix the highlighted fields.
                </Alert>
                <Field label="Instance name" name="name" :error="errorFor('name')">
                    <Input v-model="name" name="name" :invalid="invalid('name')" />
                </Field>
                <Field label="DocuWare URL" name="url" :error="errorFor('url')">
                    <Input v-model="url" name="url" :invalid="invalid('url')" />
                </Field>
                <FormActions>
                    <Button type="submit">Save instance</Button>
                </FormActions>
            </form>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('button', { name: 'Save instance' }));
        await expect(canvas.getByText('Could not save')).toBeVisible();
        await expect(canvas.getByText('The instance name is required.')).toBeVisible();
        const nameInput = canvas.getByLabelText('Instance name');
        await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
        await expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');

        // Fixing the fields clears the error state on resubmit.
        await userEvent.type(nameInput, 'Mustermann Production');
        const urlInput = canvas.getByLabelText('DocuWare URL');
        await userEvent.clear(urlInput);
        await userEvent.type(urlInput, 'https://mustermann.docuware.cloud');
        await userEvent.click(canvas.getByRole('button', { name: 'Save instance' }));
        await expect(canvas.queryByText('Could not save')).not.toBeInTheDocument();
    },
};
