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
        // `bundleTypes`, not `rollupTypes`: vite-plugin-dts 5 renamed it and the
        // old name is accepted-and-ignored rather than rejected, which quietly
        // emitted split per-component .d.ts files instead of the single bundled
        // index.d.ts every published version so far has shipped. Requires
        // @microsoft/api-extractor, hence its devDependency.
        dts({ include: ['src'], bundleTypes: true }),
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
            // EVERY @codemirror/* package must be listed here, not just the
            // ones imported by name in a component. `@codemirror/language`
            // owns the facets that tie a language's syntax tree to the
            // highlighter; if it is bundled while `lang-json`/`lang-markdown`
            // stay external, the consumer ends up with two instances of it —
            // the parser registers its tree against one set of facets and
            // `syntaxHighlighting()` reads the other, so code renders
            // completely unhighlighted with no error anywhere.
            // `@codemirror/commands` is the same hazard for the default keymap.
            external: [
                'vue',
                'apexcharts',
                '@codemirror/state',
                '@codemirror/view',
                '@codemirror/language',
                '@codemirror/commands',
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
