/**
 * The kit's two colour vocabularies for status-communicating components
 * (Badge, StatusBadge, Alert, …).
 *
 * - {@link Tone} — SEVERITY. Five ordered values: how bad is this.
 * - {@link Category} — IDENTITY. Three unordered values: which kind is this.
 *
 * They are parallel and mutually exclusive: a thing is either being reported as
 * a severity or being labelled as a kind, never both. Components expose them as
 * sibling props (`variant` / `category`).
 *
 * Historically Badge used color names (gray/blue/green/amber/red) and Alert
 * used `error`; those remain accepted as deprecated aliases and are mapped
 * here. They will be removed in the next major release.
 */
import { warnOnce } from './dev';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** @deprecated Use the semantic {@link Tone} names instead. */
export type LegacyTone = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'error' | 'purple';

const LEGACY_TONES: Record<LegacyTone, Tone> = {
    gray: 'neutral',
    blue: 'info',
    green: 'success',
    amber: 'warning',
    red: 'danger',
    error: 'danger',
    // Not a severity — "seen this before" (e.g. a duplicate-delivery status).
    // It rode `info` because the tone vocabulary is five SEVERITY values and
    // there was nowhere else for it to go. There is somewhere now: `Category`
    // below is the parallel non-severity vocabulary, and `category="purple"`
    // is what this alias always meant. `variant="purple"` keeps resolving to
    // `info` — that behaviour is unchanged.
    purple: 'info',
};

const TONES: Tone[] = ['neutral', 'info', 'success', 'warning', 'danger'];

/** Maps deprecated tone aliases to their semantic names (with a one-time dev warning). */
export function resolveTone(value: Tone | LegacyTone | undefined, fallback: Tone): Tone {
    if (value === undefined) {
        return fallback;
    }

    if (value in LEGACY_TONES) {
        // This warning used to hang off `import.meta.env.DEV`, which the
        // library build folds to `false` — so it reached no consumer in any
        // published version, and apps accumulated hundreds of legacy tone
        // values without a line of feedback. See src/helpers/dev.ts.
        warnOnce(
            `tone:${value}`,
            `[flows] Tone "${value}" is deprecated; use "${LEGACY_TONES[value as LegacyTone]}" instead. `
                + 'Legacy tone names will be removed in the next major release.',
        );

        return LEGACY_TONES[value as LegacyTone];
    }

    // Neither semantic nor a known alias — i.e. a typo. This used to be
    // returned as-is, which indexed the caller's palette to `undefined` and
    // rendered the badge with no tone classes at all.
    if (!TONES.includes(value as Tone)) {
        warnOnce(
            `tone:unknown:${value}`,
            `[flows] Unknown tone "${value}". Expected one of: ${TONES.join(' | ')}. `
                + `Falling back to "${fallback}".`,
        );

        return fallback;
    }

    return value as Tone;
}

/**
 * The kit's CATEGORICAL vocabulary — a parallel set to {@link Tone}, not an
 * extension of it.
 *
 * ## Why this is a separate type
 *
 * `Tone` is five points on a SEVERITY ramp: how bad is this. Apps also have a
 * lot of state that has no severity at all — a feature is on or off, a setting
 * is inherited or overridden, a delivery is the first or a duplicate, a record
 * is draft or published, a graph node is one kind of thing rather than another.
 * With only a severity ramp available, those all borrowed one: "enabled" became
 * `success`, "duplicate" became `info`, "viewing an older version" became
 * `warning`. The UI then tells the user something is wrong when nothing is.
 *
 * `Category` is deliberately NOT more members on `Tone`. Widening `Tone` would
 * break every consumer holding its own exhaustive `Record<Tone, X>` map — a
 * semver-major change — and it would also be wrong: severity is ordered and
 * these are not. A category means only "different from the other one".
 *
 * ## Why exactly three
 *
 * Not a taste call — it is what survived measurement (see src/tokens.css for
 * the ratios). A categorical hue here has to clear four gates at once: WCAG AA
 * as TEXT (≥4.5:1) on white, on `--color-bg` and on its own `-soft` tint; OKLCH
 * chroma ≥0.10 so it reads as a hue rather than as gray; and OKLab ΔE
 * separation both from the other categories and from every severity token, so a
 * category badge is never mistaken for a status badge.
 *
 * Sweeping the full Tailwind ramp against those gates leaves a 60°-wide arc of
 * the hue wheel — roughly blue through magenta. Everything warm is already
 * spoken for by `success`/`warning`/`danger`, and teal/cyan lose their chroma
 * on the way down to text weight (teal at AA weight measures C≈0.06 — it *is*
 * gray). Inside that arc, three is the largest set where every pair clears the
 * separation floor; a fourth collapses the worst pair to ΔE≈3 under simulated
 * red-green colour blindness, which is indistinguishable.
 *
 * So: three real categories, and `neutral` for "no category". More kinds than
 * that need a channel other than colour — an icon, or the label itself. This is
 * the honest ceiling, not a placeholder to grow later.
 */
export type Category = 'indigo' | 'purple' | 'magenta';

const CATEGORIES: Category[] = ['indigo', 'purple', 'magenta'];

/**
 * Validates a categorical value, warning once in development on an unknown one.
 *
 * Mirrors {@link resolveTone}'s shape and exists for the same reason: the props
 * are typed unions, but consuming apps write plain-JS SFCs where the union is
 * erased, so a typo silently indexed the palette to `undefined` and rendered a
 * badge with no colour classes at all. There is no legacy-alias branch here —
 * this vocabulary is new, so it has no deprecated spellings to map.
 */
export function resolveCategory(value: Category | undefined, fallback: Category): Category {
    if (value === undefined) {
        return fallback;
    }

    if (!CATEGORIES.includes(value)) {
        warnOnce(
            `category:unknown:${value}`,
            `[flows] Unknown category "${value}". Expected one of: ${CATEGORIES.join(' | ')}. `
                + `Falling back to "${fallback}".`,
        );

        return fallback;
    }

    return value;
}
