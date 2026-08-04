/**
 * The kit's single tone vocabulary for status-communicating components
 * (Badge, StatusBadge, Alert, …).
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
    // The tone vocabulary stays at 5 semantic values, so this rides `info`
    // rather than introducing a 6th hue.
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
