import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SettingsSection from './SettingsSection.vue';
import Field from '../molecules/Field.vue';
import FormActions from '../molecules/FormActions.vue';
import Input from '../atoms/Input.vue';
import Button from '../atoms/Button.vue';

const meta: Meta<typeof SettingsSection> = {
    title: 'Organisms/SettingsSection',
    component: SettingsSection,
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SettingsSection>;

// A settings page: sections divided by a rule, one save row closing the form.
export const Page: Story = {
    render: () => ({
        components: { SettingsSection, Field, FormActions, Input, Button },
        template: `
            <form class="max-w-4xl" @submit.prevent>
                <SettingsSection title="Provider" description="Sends sign-in links and mail.">
                    <Field label="Server token" name="token" hint="Leave empty to keep the current token.">
                        <Input name="token" />
                    </Field>
                </SettingsSection>
                <SettingsSection title="Sender" description="Must be a verified sender.">
                    <Field label="Sender name" name="from_name"><Input name="from_name" /></Field>
                    <Field label="Sender address" name="from_address" required><Input name="from_address" type="email" /></Field>
                </SettingsSection>
                <FormActions align="end" divided>
                    <template #hint>Saving checks the connection first.</template>
                    <Button type="submit">Save</Button>
                </FormActions>
            </form>`,
    }),
};
