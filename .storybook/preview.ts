import type { Preview } from '@storybook/vue3-vite';
import './storybook.css';

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
