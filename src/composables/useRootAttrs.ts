import { computed, useAttrs } from 'vue';
import type { ComputedRef } from 'vue';

/**
 * Splits fallthrough attributes into the caller's `class` (to be merged into
 * the component's own classes via `cx`) and everything else (to be v-bound on
 * the root element — event listeners, native attrs, aria-*, …).
 *
 * Callers must opt out of automatic inheritance themselves:
 *
 *     defineOptions({ inheritAttrs: false });
 *     const { rootAttrs, classAttr } = useRootAttrs();
 */
export function useRootAttrs(): {
    rootAttrs: ComputedRef<Record<string, unknown>>;
    classAttr: ComputedRef<string | undefined>;
} {
    const attrs = useAttrs();

    const rootAttrs = computed(() => {
        const { class: _omit, ...rest } = attrs;
        return rest;
    });

    const classAttr = computed(() => attrs.class as string | undefined);

    return { rootAttrs, classAttr };
}
