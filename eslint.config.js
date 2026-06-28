import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default ts.config(
    { ignores: ['dist/**', 'storybook-static/**', 'node_modules/**'] },
    ...ts.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        // .vue templates are parsed by vue-eslint-parser; hand the <script lang="ts">
        // blocks to the TypeScript parser.
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: { parser: ts.parser },
        },
    },
    {
        rules: {
            // Atoms are intentionally single-word (Button, Card, Icon…).
            'vue/multi-word-component-names': 'off',
        },
    },
);
