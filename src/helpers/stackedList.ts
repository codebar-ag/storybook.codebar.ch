import type { InjectionKey } from 'vue';

/**
 * Provided by `StackedList`, read by `ListRow`: a row inside a stacked list
 * wraps itself in an `<li>` so the list is valid markup (a `<ul>` may only
 * hold `<li>` children) and screen readers announce it as a list of N items.
 */
export const stackedListKey: InjectionKey<true> = Symbol('stackedList');
