import { computed } from 'vue';
import type { ComputedRef } from 'vue';

/**
 * Adapter from a server-driven error bag (Laravel/Inertia shape:
 * `Record<field, message | message[]>`) to the Field/Input API:
 *
 *     const { errorFor, invalid } = useFormErrors(() => props.errors);
 *     <Field label="Email" name="email" :error="errorFor('email')">
 *         <Input name="email" :invalid="invalid('email')" ... />
 *     </Field>
 */
export function useFormErrors(
    source: () => Record<string, string | string[]> | null | undefined,
): {
    errorFor: (name: string) => string | null;
    invalid: (name: string) => boolean;
    hasErrors: ComputedRef<boolean>;
} {
    const errors = computed(() => source() ?? {});

    function errorFor(name: string): string | null {
        const value = errors.value[name];
        if (value === undefined || value === null) {
            return null;
        }
        return Array.isArray(value) ? (value[0] ?? null) : value;
    }

    function invalid(name: string): boolean {
        return errorFor(name) !== null;
    }

    const hasErrors = computed(() => Object.keys(errors.value).length > 0);

    return { errorFor, invalid, hasErrors };
}
