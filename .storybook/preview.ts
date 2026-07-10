import type { Preview } from '@storybook/vue3-vite';
import './storybook.css';

const preview: Preview = {
    parameters: {
        layout: 'centered',
        controls: { expanded: true },
    },
};

export default preview;
