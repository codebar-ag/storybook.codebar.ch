import type { ComputedRef, InjectionKey } from 'vue';

export type DescriptionListLayout = 'gutter' | 'rows';

export const descriptionListKey: InjectionKey<ComputedRef<DescriptionListLayout>> =
    Symbol('descriptionList');
