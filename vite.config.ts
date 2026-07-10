import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// Library build: emits an ESM bundle + bundled CSS (atom utility classes are
// the CONSUMER's responsibility to generate via Tailwind `@source`, but any
// non-utility component CSS lands in dist/flows.css). Vue, ApexCharts, and
// CodeMirror stay external so a single copy lives in the consuming app.
export default defineConfig({
    plugins: [
        vue(),
        dts({ include: ['src'], rollupTypes: true }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: 'Flows',
            fileName: 'flows',
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'vue',
                'apexcharts',
                '@codemirror/state',
                '@codemirror/view',
                '@codemirror/lang-json',
                '@codemirror/lang-markdown',
            ],
            output: {
                globals: { vue: 'Vue', apexcharts: 'ApexCharts' },
                assetFileNames: 'flows.[ext]',
            },
        },
    },
});
