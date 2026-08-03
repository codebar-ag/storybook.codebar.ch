// Guards the library build's externalisation contract, which nothing else can.
//
// Storybook and its Playwright suite compile from `src`, so they always see a
// single copy of every dependency — they cannot observe what the PUBLISHED
// bundle does. If a peer package is missing from `rollupOptions.external`,
// Rollup quietly inlines it into an extra chunk and the consumer ends up with
// two instances of it. For `@codemirror/language` that means the parser
// registers its syntax tree against one set of facets while
// `syntaxHighlighting()` reads the other, and every code surface in every
// consuming app renders as flat, unhighlighted text — with no error anywhere.
//
// The observable symptom in `dist` is an extra chunk file plus a relative
// import out of `flows.js`, so both are asserted here.
import { readdirSync, readFileSync } from 'node:fs';

const EXPECTED_FILES = ['flows.css', 'flows.js', 'index.d.ts', 'tokens.css'];

const actual = readdirSync('dist').sort();
const unexpected = actual.filter((file) => !EXPECTED_FILES.includes(file));

if (unexpected.length > 0) {
    console.error(
        `dist/ has unexpected chunk(s): ${unexpected.join(', ')}\n` +
            'A dependency was bundled instead of externalised. Add it to ' +
            "`rollupOptions.external` in vite.config.ts (and to `peerDependencies`).",
    );
    process.exit(1);
}

const bundle = readFileSync('dist/flows.js', 'utf8');
const relativeImports = [...bundle.matchAll(/(?:from|import\()\s*["'](\.[^"']*)["']/g)].map((match) => match[1]);

if (relativeImports.length > 0) {
    console.error(
        `dist/flows.js imports emitted chunk(s): ${[...new Set(relativeImports)].join(', ')}\n` +
            'Every dependency must resolve to a bare specifier so the consuming app supplies one copy.',
    );
    process.exit(1);
}
