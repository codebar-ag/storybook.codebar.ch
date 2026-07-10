import type { InjectionKey } from 'vue';

export interface AccordionContext {
    isOpen: (key: string) => boolean;
    toggle: (key: string) => void;
}

export const accordionKey: InjectionKey<AccordionContext> = Symbol('accordion');
