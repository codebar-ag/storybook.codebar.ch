<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { twMerge } from 'tailwind-merge';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'cta';
        size?: 'sm' | 'md' | 'lg';
        type?: 'button' | 'submit' | 'reset';
        as?: 'button' | 'a';
        href?: string | null;
    }>(),
    { variant: 'primary', size: 'md', type: 'button', as: 'button', href: null },
);

const attrs = useAttrs();

const base =
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition cursor-pointer ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/50 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<string, string> = {
    primary: 'bg-ink text-white hover:bg-ink-hover',
    secondary: 'bg-surface-2 border border-line text-ink hover:border-line-2',
    ghost: 'bg-transparent border border-line text-muted hover:text-ink',
    danger: 'bg-surface border border-danger-line text-danger hover:bg-danger-soft',
    subtle: 'bg-surface-2 text-ink hover:bg-line',
    cta: 'bg-cta text-white hover:bg-cta-hover',
};

const sizes: Record<string, string> = {
    sm: 'h-11 px-3 text-xs',
    md: 'h-11 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
};

const tag = computed(() => (props.href !== null ? 'a' : props.as));
const classes = computed(() =>
    twMerge(
        base,
        variants[props.variant] ?? variants.primary,
        sizes[props.size] ?? sizes.md,
        attrs.class as string,
    ),
);

// Forward every attribute except `class` (already merged above) — includes
// event listeners (onClick, …) and native attrs (disabled, aria-*, …).
const rootAttrs = computed(() => {
    const { class: _omit, ...rest } = attrs;
    return rest;
});
</script>

<template>
  <!-- Render the native element explicitly rather than `<component :is="tag">`:
       a string `:is="'button'"` is run through Vue's component resolver, which
       capitalizes it to `Button` and — because this atom is globally registered
       under that name — resolves to THIS component, recursing until the stack
       overflows. Explicit <a>/<button> branches avoid the resolver entirely. -->
  <a
    v-if="tag === 'a'"
    :href="href ?? undefined"
    :class="classes"
    v-bind="rootAttrs"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    v-bind="rootAttrs"
  >
    <slot />
  </button>
</template>
