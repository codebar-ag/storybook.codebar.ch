import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import Button from '../src/components/atoms/Button.vue';
import './storybook.css';

// Consuming apps register the kit's Button globally; stories do the same so a
// string `:is="'button'"` that would resolve to it is caught here.
setup((app) => {
    app.component('Button', Button);
});

const preview: Preview = {
    // Docs page for every component story file; per-file tags are redundant.
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        controls: { expanded: true },
        // Panel-only reporting for now; violations are reviewed per component
        // and enforcement can be tightened once the backlog is worked off.
        a11y: { test: 'off' },
        options: {
            storySort: {
                order: ['Foundations', 'Atoms', 'Molecules', 'Organisms', 'Layouts', 'Pages'],
            },
        },
    },
};

export default preview;
