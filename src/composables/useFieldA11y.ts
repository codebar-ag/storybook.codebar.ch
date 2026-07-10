import { computed } from 'vue';
import type { ComputedRef } from 'vue';

/**
 * Accessibility wiring shared by every form control that sits inside `Field`:
 * `Field` renders its error message as `<p id="{name}-error" role="alert">`,
 * and controls point `aria-describedby` at that id when invalid. This is the
 * single home of that id convention — change it here and in `Field.vue` only.
 */
export function useFieldA11y(props: { name?: string | null; invalid?: boolean }): {
    fieldId: ComputedRef<string | undefined>;
    describedBy: ComputedRef<string | undefined>;
    ariaInvalid: ComputedRef<'true' | undefined>;
} {
    const fieldId = computed(() => props.name ?? undefined);
    const describedBy = computed(() =>
        props.invalid && props.name ? `${props.name}-error` : undefined,
    );
    const ariaInvalid = computed(() => (props.invalid ? ('true' as const) : undefined));

    return { fieldId, describedBy, ariaInvalid };
}
