import { computed, useAttrs } from 'vue';
import type { ComputedRef } from 'vue';

/**
 * Attributes that keep password managers (1Password, LastPass) from decorating
 * fields that are not credentials. An explicit `autocomplete` from the caller
 * (e.g. `username`, `current-password`, `one-time-code`) is a deliberate signal
 * that the field IS a credential, so the ignore attrs are skipped entirely in
 * that case rather than just leaving `autocomplete="off"` off.
 *
 * Pass `enabled` to skip the attrs situationally — e.g. Input disables them
 * for `type="password"`, where password managers SHOULD engage.
 */
export function usePasswordManagerAttrs(
    enabled: () => boolean = () => true,
): ComputedRef<Record<string, unknown>> {
    const attrs = useAttrs();

    return computed(() => {
        if (!enabled()) {
            return {};
        }

        if ('autocomplete' in attrs) {
            return {};
        }

        return {
            'data-1p-ignore': true,
            'data-lpignore': 'true',
            autocomplete: 'off',
        };
    });
}
