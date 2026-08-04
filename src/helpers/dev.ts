/**
 * Dev-only diagnostics for the published bundle.
 *
 * ## Why not `import.meta.env.DEV`
 *
 * Because it does not survive publication. This package is built in Vite
 * **library mode**, and Vite statically replaces `import.meta.env.DEV` at
 * PACKAGE build time — not at the consumer's. Since the library is built for
 * production, every `import.meta.env.DEV` in `src/` was compiled to a literal
 * `false`, and the branch behind it was dropped by tree-shaking.
 *
 * The effect was total: `dist/flows.js` contained **zero** occurrences of
 * `console.warn`. The `resolveTone()` deprecation notice — the one that was
 * supposed to tell consumers they were still passing `green`/`red`/`amber` —
 * could never fire in any app, in any environment, in any published version.
 * It read like a working guard and was a no-op.
 *
 * ## Why `process.env.NODE_ENV` works
 *
 * The library build leaves `process.env.NODE_ENV` untouched, so the string
 * reaches `dist/flows.js` verbatim and the CONSUMER's bundler substitutes it:
 * `"development"` while developing (warning fires), `"production"` in a release
 * build (the comparison folds to `false` and the whole branch is eliminated).
 * This is the same mechanism Vue's own `esm-bundler` build uses for `__DEV__`.
 *
 * Verified empirically against a real `vite build` of this package — three
 * candidate guards were compiled and inspected in `dist/flows.js`:
 *
 *     import.meta.env.DEV                     → `return !1`          (dead)
 *     process.env.NODE_ENV !== 'production'   → preserved verbatim   (works)
 *     globalThis.process?.env?.NODE_ENV       → preserved, but wrong:
 *         browsers have no `process` global, so the optional chain yields
 *         `undefined !== 'production'` → true, i.e. warnings in production.
 *
 * The `typeof process` guard keeps this from throwing in a no-bundler ESM
 * context, where the identifier is never defined. It must stay *outside* the
 * member expression: bundlers match the exact text `process.env.NODE_ENV`, so
 * writing `process.env?.NODE_ENV` would defeat the substitution.
 */

// This package has no `@types/node` (tsconfig `types` is `["vite/client"]`),
// and should not take one on just to read a build-time constant.
declare const process: { env: { NODE_ENV?: string } } | undefined;

export function isDev(): boolean {
    return typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
}

const warned = new Set<string>();

/**
 * `console.warn` once per unique `key`, in development only.
 *
 * De-duplicated because these fire from `computed()` getters: a warning on
 * every re-render would bury the first, genuinely useful one under hundreds of
 * copies as soon as the component re-renders in a list.
 */
export function warnOnce(key: string, message: string): void {
    if (!isDev() || warned.has(key)) {
        return;
    }

    warned.add(key);
    console.warn(message);
}

/** Test seam — lets a spec assert the first warning twice over. */
export function resetWarnings(): void {
    warned.clear();
}
