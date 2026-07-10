import { computed, useAttrs } from 'vue';
import type { ComputedRef } from 'vue';

/**
 * Attributes that keep password managers (1Password, LastPass) from decorating
 * fields that are not credentials. `autocomplete="off"` is only added when the
 * caller didn't set their own autocomplete.
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

        const hasAutocomplete = 'autocomplete' in attrs;

        return {
            'data-1p-ignore': true,
            'data-lpignore': 'true',
            ...(hasAutocomplete ? {} : { autocomplete: 'off' }),
        };
    });
}
