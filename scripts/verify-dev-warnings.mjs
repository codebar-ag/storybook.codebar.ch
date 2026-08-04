// Guards that dev-only diagnostics actually reach consumers, which nothing else can.
//
// This exists because they silently did not. Every warning in this kit used to
// be gated on `import.meta.env.DEV`, and Vite resolves that at THIS package's
// build time, not the consumer's. Building the library for production compiled
// the guard to a literal `false` and tree-shaking removed the branch, so
// `dist/flows.js` shipped with zero occurrences of `console.warn`. The
// `resolveTone()` deprecation notice — whose whole job was to tell apps they
// were still passing `green`/`red`/`amber` — could not fire in any consumer, in
// any environment, in any published version. One app accumulated 41 legacy tone
// values without a single line of feedback.
//
// Neither the Storybook suite nor the Playwright tests can catch this: both
// compile from `src`, where the guard is still live. The regression is only
// observable in the built artefact, so it is asserted here.
//
// The contract:
//   1. `console.warn` survives the build at all.
//   2. The dev check is `process.env.NODE_ENV`, which the library build leaves
//      verbatim for the CONSUMER's bundler to substitute — "development" while
//      developing (warning fires), "production" in a release build (the whole
//      branch folds away). Same mechanism as Vue's own esm-bundler build.
//   3. No dev gate is left on `import.meta.env`, which would be baked to a
//      constant here and never reach anyone.
import { readFileSync } from 'node:fs';

const bundle = readFileSync('dist/flows.js', 'utf8');
const count = (needle) => bundle.split(needle).length - 1;

const failures = [];

if (count('console.warn') === 0) {
    failures.push(
        'dist/flows.js contains no `console.warn`.\n'
            + '  Every dev warning was compiled away. This is the exact regression this\n'
            + '  script exists to catch — see src/helpers/dev.ts.',
    );
}

if (count('process.env.NODE_ENV') === 0) {
    failures.push(
        'dist/flows.js never reads `process.env.NODE_ENV`.\n'
            + '  Dev guards must be written EXACTLY as `process.env.NODE_ENV !== \'production\'`\n'
            + '  so the consuming bundler can substitute it. Note that `process.env?.NODE_ENV`\n'
            + '  does NOT match the substitution and will silently break this.',
    );
}

if (count('import.meta.env') > 0) {
    failures.push(
        'dist/flows.js still references `import.meta.env`.\n'
            + '  Vite resolves this at THIS package\'s build time, so anything gated on it\n'
            + '  is frozen at publish and never reflects the consumer\'s environment.\n'
            + '  Use isDev() from src/helpers/dev.ts instead.',
    );
}

if (failures.length > 0) {
    console.error(`\nDev-warning contract violated:\n\n${failures.join('\n\n')}\n`);
    process.exit(1);
}
