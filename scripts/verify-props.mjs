// Guards the per-component prop types that consuming apps wrap components with.
//
// A consuming app that wraps an atom — its own ConfirmDialog over Modal, its own
// SectionShell over PageHeading — has to name the wrapped component's prop types
// or it re-declares the unions by hand and they drift. `variant: String` passes
// the app's own build and then fails against `'danger' | 'primary' | …` at the
// boundary. So every component's props are declared as a named, exported
// `<Name>Props` interface and re-exported from `src/index.ts`.
//
// Three things have to line up, and only the third is observable from outside:
// the SFC declares the interface, the barrel re-exports it, and api-extractor
// carries it into the bundled `dist/index.d.ts`. The last one is the one that
// actually matters to a consumer and the one nothing else checks — a type that
// is exported from source but dropped from the rollup is invisible until an app
// tries to import it.
//
// The second half of the file guards the array-prop stance: every array a
// component ACCEPTS is `readonly`. Props are readonly at runtime anyway, so a
// mutable array type is not a promise the component keeps — it is only a filter
// on who may call it. One mutable prop is enough to break the rule, because the
// value of the stance is that it holds for ALL of them: a caller holding a
// ReadonlyArray (generated translation types, `as const` fixtures, anything
// frozen) can then pass it to every component rather than remembering which.
import { existsSync, globSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';

const components = globSync('src/components/*/*.vue').sort();
const index = readFileSync('src/index.ts', 'utf8');
const errors = [];

/** Components whose props are exported, for the dist check below. */
const exported = [];

for (const file of components) {
    const name = basename(file, '.vue');
    const source = readFileSync(file, 'utf8');

    if (!source.includes('defineProps')) {
        continue;
    }

    if (!source.includes(`export interface ${name}Props`)) {
        errors.push(
            `${file} declares props but no \`export interface ${name}Props\`. ` +
                'Name the props interface and export it, rather than passing a type literal to defineProps.',
        );
        continue;
    }

    if (!index.includes(`export type { ${name}Props }`)) {
        errors.push(
            `src/index.ts does not re-export ${name}Props. ` +
                `Add: export type { ${name}Props } from './${file.slice(4)}';`,
        );
        continue;
    }

    exported.push(`${name}Props`);
}

// Only meaningful after a build; `npm run build` runs this last, on purpose.
if (existsSync('dist/index.d.ts')) {
    const declarations = readFileSync('dist/index.d.ts', 'utf8');
    const missing = exported.filter(
        (type) => !new RegExp(`\\binterface ${type}\\b`).test(declarations),
    );

    if (missing.length > 0) {
        errors.push(
            `dist/index.d.ts is missing: ${missing.join(', ')}.\n` +
                'The barrel exports them but api-extractor did not carry them into the bundled ' +
                'declarations, so no consumer can import them.',
        );
    }
}

// Array props must be readonly. Line-based on purpose: a props interface that
// needs a multi-line union type is past the point where a component should be
// taking that prop at all.
const MUTABLE_ARRAY = /\w\s*\[\]|\bArray</;
const READONLY = /\breadonly\b|\bReadonlyArray</;

for (const file of components) {
    const name = basename(file, '.vue');
    const source = readFileSync(file, 'utf8');
    const block = new RegExp(`export interface ${name}Props(?:<[^>]*>)? \\{\\n([\\s\\S]*?)\\n\\}`).exec(source);

    if (!block) {
        continue;
    }

    for (const line of block[1].split('\n')) {
        const declaration = line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '');

        if (!declaration.includes(':') || !MUTABLE_ARRAY.test(declaration) || READONLY.test(declaration)) {
            continue;
        }

        errors.push(
            `${file}: ${name}Props has a mutable array prop —\n    ${declaration.trim()}\n` +
                'Accept `readonly T[]`. Props cannot be mutated at runtime, so a mutable type only ' +
                'rejects callers holding a ReadonlyArray. Copy at the boundary if something inside ' +
                'genuinely needs a mutable array.',
        );
    }
}

if (errors.length > 0) {
    console.error(errors.join('\n\n'));
    process.exit(1);
}
