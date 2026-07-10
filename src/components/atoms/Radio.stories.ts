import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ref } from 'vue';
import Radio from './Radio.vue';
import RadioGroup from '../molecules/RadioGroup.vue';

const meta: Meta = {
    title: 'Atoms/Radio',
    component: Radio,
};

export default meta;
type Story = StoryObj;

// Radio renders as a selectable card; RadioGroup wraps a set in a fieldset
// with an sr-only legend.
export const Default: Story = {
    render: () => ({
        components: { RadioGroup, Radio },
        setup: () => ({ hosting: ref('shared') }),
        template: `
            <div class="max-w-md">
                <RadioGroup label="Hosting">
                    <Radio
                        v-model="hosting"
                        value="shared"
                        name="hosting"
                        label="Shared instance"
                        description="Shared infrastructure."
                    />
                    <Radio
                        v-model="hosting"
                        value="dedicated"
                        name="hosting"
                        label="Dedicated instance"
                        description="Your own isolated subscription."
                    />
                </RadioGroup>
            </div>`,
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const shared = canvas.getByRole('radio', { name: /Shared instance/ });
        const dedicated = canvas.getByRole('radio', { name: /Dedicated instance/ });
        await expect(shared).toBeChecked();

        await userEvent.click(dedicated);
        await expect(dedicated).toBeChecked();
        await expect(shared).not.toBeChecked();
    },
};

export const States: Story = {
    render: () => ({
        components: { RadioGroup, Radio },
        setup: () => ({ plan: ref(null) }),
        template: `
            <div class="max-w-md">
                <RadioGroup label="Plan">
                    <Radio
                        v-model="plan"
                        value="cloud"
                        name="plan"
                        label="DocuWare Cloud"
                        description="Nothing selected yet — invalid until chosen."
                        :invalid="true"
                    />
                    <Radio
                        v-model="plan"
                        value="onprem"
                        name="plan"
                        label="On-premise"
                        description="Not available for this tenant."
                        disabled
                    />
                </RadioGroup>
            </div>`,
    }),
};
