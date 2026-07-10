import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import Stepper from './Stepper.vue';
import Modal from './Modal.vue';
import Toggle from './Toggle.vue';
import Button from './Button.vue';
import Card from './Card.vue';

const meta: Meta = {
    title: 'Atoms/Wizard',
    parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Steps: Story = {
    render: () => ({
        components: { Stepper },
        setup: () => ({
            steps: [
                { key: 'docuware', label: 'DocuWare' },
                { key: 'mcp', label: 'MCP' },
                { key: 'mistral', label: 'Mistral' },
                { key: 'prompts', label: 'Prompts' },
                { key: 'review', label: 'Review' },
            ],
        }),
        template: '<div class="max-w-2xl"><Stepper :steps="steps" :current="2" /></div>',
    }),
};

export const Switch: Story = {
    render: () => ({
        components: { Toggle },
        setup: () => ({ enabled: ref(true) }),
        template:
            '<Toggle v-model="enabled" label="Enable flow" description="Process incoming documents." />',
    }),
};

export const Dialog: Story = {
    render: () => ({
        components: { Modal, Button, Card },
        setup: () => ({ open: ref(false) }),
        template: `
            <div>
                <Button @click="open = true">Open modal</Button>
                <Modal v-model="open" title="Confirm" description="This action cannot be undone.">
                    <p class="text-sm text-muted">Are you sure you want to continue?</p>
                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <Button variant="ghost" @click="open = false">Cancel</Button>
                            <Button variant="danger" @click="open = false">Delete</Button>
                        </div>
                    </template>
                </Modal>
            </div>`,
    }),
};
