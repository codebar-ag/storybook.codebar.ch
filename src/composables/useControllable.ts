import { computed, ref } from 'vue';
import type { Ref, WritableComputedRef } from 'vue';

/**
 * Controlled/uncontrolled bridge for optional v-model props: while the caller
 * binds the prop (`getProp()` returns a value) that value wins and writes go
 * out through `setProp`; when the prop is left undefined the component keeps
 * its own internal state — writes still emit so callers can observe.
 *
 *     const open = useControllable(
 *         () => props.open,
 *         (value) => emit('update:open', value),
 *         false,
 *     );
 */
export function useControllable<T>(
    getProp: () => T | undefined,
    setProp: (value: T) => void,
    defaultValue: T,
): WritableComputedRef<T> {
    const internal = ref(defaultValue) as Ref<T>;

    return computed({
        get: () => {
            const value = getProp();
            return value === undefined ? internal.value : value;
        },
        set: (value: T) => {
            internal.value = value;
            setProp(value);
        },
    });
}
