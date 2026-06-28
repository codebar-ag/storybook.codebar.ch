<script setup lang="ts">
import { computed } from 'vue';

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

const base =
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition ' +
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
    [base, variants[props.variant] ?? variants.primary, sizes[props.size] ?? sizes.md].join(' '),
);
</script>

<template>
  <component
    :is="tag"
    :href="tag === 'a' ? href : undefined"
    :type="tag === 'button' ? type : undefined"
    :class="classes"
  >
    <slot />
  </component>
</template>
