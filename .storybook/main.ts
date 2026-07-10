import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|js)'],
    addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    // Tailwind v4 runs through its Vite plugin so atom utility classes resolve
    // inside Storybook exactly as they do in a consuming app.
    async viteFinal(cfg) {
        const { default: tailwindcss } = await import('@tailwindcss/vite');
        cfg.plugins = cfg.plugins ?? [];
        cfg.plugins.push(tailwindcss());
        return cfg;
    },
};

export default config;
