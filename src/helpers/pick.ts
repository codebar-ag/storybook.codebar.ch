import { warnOnce } from './dev';

/**
 * Resolve a `variant` / `size` / `tone` prop against its lookup map, warning in
 * development when the value is not a key of that map.
 *
 * ## The failure this exists to stop
 *
 * Every atom in this kit resolved its variant with a silent fallback:
 *
 *     variants[props.variant] ?? variants.primary
 *
 * The props ARE typed unions, so TypeScript catches a bad value — but only in a
 * TypeScript call site. Consuming apps write plain-JS SFCs, where the union is
 * erased and nothing checks it. `<Button variant="success">` (a real case: a
 * `success` variant exists on Alert, Badge, Card and IconBadge, but *not* on
 * Button) therefore rendered as `primary`, silently, with no signal anywhere.
 * The author read it as a distinct green action; the user saw two identical
 * primary buttons side by side.
 *
 * The fallback itself is right — a wrong variant must never blank out a
 * control's styling. What was missing is that it happened *quietly*.
 *
 * Naming the valid keys in the message matters as much as the warning: the
 * vocabulary genuinely differs per component (Button has `subtle`/`cta` and no
 * `success`; IconBadge says `accent` where Alert says `info`), so "which values
 * are legal here" is the actual question a caller has.
 *
 * @param map      the variant → utility-class lookup
 * @param key      the incoming prop value
 * @param fallback key to use when `key` is absent or unknown
 * @param context  what is being resolved, e.g. `'Button.variant'` — appears in the warning
 */
export function pick<T extends Record<string, string>>(
    map: T,
    key: PropertyKey | null | undefined,
    fallback: keyof T,
    context: string,
): string {
    if (key !== null && key !== undefined && !(key in map)) {
        warnOnce(
            `${context}:${String(key)}`,
            `[flows] Unknown ${context} "${String(key)}". `
                + `Expected one of: ${Object.keys(map).join(' | ')}. `
                + `Falling back to "${String(fallback)}".`,
        );
    }

    return map[key as keyof T] ?? map[fallback];
}
