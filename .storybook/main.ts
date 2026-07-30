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

        /*
         | Storybook inherits vite.config.ts, so the declaration-file plugin runs
         | here too — and this build has no declarations to emit. It is not just
         | wasted work: bundling types means API Extractor, which walks the
         | stories and dies on Vue's internal template symbols ("Symbol not found
         | for identifier: __VLS_1"). Dropping it here is what lets the library
         | build bundle its types without the docs build having to cope.
         */
        cfg.plugins = cfg.plugins.filter(
            (plugin) => !(plugin && 'name' in plugin && String(plugin.name).includes('dts')),
        );

        return cfg;
    },
};

export default config;
