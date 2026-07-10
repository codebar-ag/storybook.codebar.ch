/**
 * The kit's single tone vocabulary for status-communicating components
 * (Badge, StatusBadge, Alert, …).
 *
 * Historically Badge used color names (gray/blue/green/amber/red) and Alert
 * used `error`; those remain accepted as deprecated aliases and are mapped
 * here. They will be removed in the next major release.
 */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** @deprecated Use the semantic {@link Tone} names instead. */
export type LegacyTone = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'error';

const LEGACY_TONES: Record<LegacyTone, Tone> = {
    gray: 'neutral',
    blue: 'info',
    green: 'success',
    amber: 'warning',
    red: 'danger',
    error: 'danger',
};

const warned = new Set<string>();

function isDev(): boolean {
    // Guarded so the check survives non-Vite consumers where import.meta.env
    // is undefined.
    return (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;
}

/** Maps deprecated tone aliases to their semantic names (with a one-time dev warning). */
export function resolveTone(value: Tone | LegacyTone | undefined, fallback: Tone): Tone {
    if (value === undefined) {
        return fallback;
    }

    if (value in LEGACY_TONES) {
        if (isDev() && !warned.has(value)) {
            warned.add(value);
            console.warn(
                `[flows] Tone "${value}" is deprecated; use "${LEGACY_TONES[value as LegacyTone]}" instead. ` +
                    'Legacy tone names will be removed in the next major release.',
            );
        }
        return LEGACY_TONES[value as LegacyTone];
    }

    return value as Tone;
}
