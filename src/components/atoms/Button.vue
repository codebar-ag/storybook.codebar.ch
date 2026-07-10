<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';
import Spinner from './Spinner.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'cta';
        size?: 'sm' | 'md' | 'lg';
        type?: 'button' | 'submit' | 'reset';
        // Pass a component (e.g. Inertia's Link) to keep navigation client-side
        // while staying framework-agnostic — the package never imports Inertia.
        as?: 'button' | 'a' | Component;
        href?: string | null;
        // Shows a centered spinner and blocks interaction; the label stays in
        // the layout (hidden, not removed) so the button keeps its width.
        loading?: boolean;
    }>(),
    { variant: 'primary', size: 'md', type: 'button', as: 'button', href: null, loading: false },
);

// Forwards every attribute except `class` (merged into `classes` below) —
// includes event listeners (onClick, …) and native attrs (disabled, aria-*, …).
const { rootAttrs, classAttr } = useRootAttrs();

const base =
    'relative inline-flex items-center justify-center gap-2 rounded-control font-semibold transition cursor-pointer ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent/50 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed aria-busy:cursor-wait';

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

// A component passed via `as` bypasses the string resolver, so it is safe to
// hand to `<component :is>` (unlike native-tag strings — see template note).
const customTag = computed(() => (typeof props.as === 'string' ? null : props.as));
const tag = computed(() => (props.href !== null ? 'a' : props.as));
const classes = computed(() =>
    cx(
        base,
        variants[props.variant] ?? variants.primary,
        sizes[props.size] ?? sizes.md,
        classAttr.value,
    ),
);

// Spread AFTER rootAttrs so `loading` wins over a caller-bound `disabled`;
// empty when idle so callers keep full control.
const loadingAttrs = computed(() =>
    props.loading ? { 'aria-busy': 'true' as const, disabled: true } : {},
);
</script>

<template>
  <!-- Render the native element explicitly rather than `<component :is="tag">`:
       a string `:is="'button'"` is run through Vue's component resolver, which
       capitalizes it to `Button` and — because this atom is globally registered
       under that name — resolves to THIS component, recursing until the stack
       overflows. Explicit <a>/<button> branches avoid the resolver entirely. -->
  <component
    :is="customTag"
    v-if="customTag"
    :href="href ?? undefined"
    :class="classes"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="rootAttrs"
  >
    <Spinner
      v-if="loading"
      size="sm"
      class="absolute"
    />
    <span
      class="inline-flex items-center gap-2"
      :class="{ 'opacity-0': loading }"
    ><slot /></span>
  </component>
  <a
    v-else-if="tag === 'a'"
    :href="href ?? undefined"
    :class="classes"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="rootAttrs"
  >
    <Spinner
      v-if="loading"
      size="sm"
      class="absolute"
    />
    <span
      class="inline-flex items-center gap-2"
      :class="{ 'opacity-0': loading }"
    ><slot /></span>
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
    v-bind="{ ...rootAttrs, ...loadingAttrs }"
  >
    <Spinner
      v-if="loading"
      size="sm"
      class="absolute"
    />
    <span
      class="inline-flex items-center gap-2"
      :class="{ 'opacity-0': loading }"
    ><slot /></span>
  </button>
</template>
