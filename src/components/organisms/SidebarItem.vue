<script setup lang="ts">
// One navigation entry: icon + label, active state, framework-agnostic `as`
// for client-side routing (pass e.g. Inertia's Link).
import { computed, h } from 'vue';
import type { Component, FunctionalComponent } from 'vue';
import Icon from '../atoms/Icon.vue';
import type { IconName } from '../../icons';
import { cx } from '../../helpers/cx';
import { useRootAttrs } from '../../composables/useRootAttrs';

// Without this, fallthrough attrs land on the `<li>` — the wrapper, not the
// link. A caller passing a router attribute (`prefetch` on Inertia's Link) or
// a `data-*`/`@click` aimed at the anchor got it stamped on the list item,
// where it is inert: no error, no warning, just a dead attribute in the DOM
// and a feature that silently never engaged. Same pattern as Link.vue.
defineOptions({ inheritAttrs: false });

export interface SidebarItemProps {
    /** Omit for an action (open a dialog, sign out): the item renders a <button>. */
    href?: string | null;
    icon?: IconName | null;
    active?: boolean;
    as?: Component | null;
    /** A count pill after the label (open items); hidden at null and 0. */
    count?: number | null;
    /** Accessible text for the count, e.g. "4 open"; the bare number otherwise. */
    countLabel?: string | null;
}

const props = withDefaults(
    defineProps<SidebarItemProps>(),
    { href: null, icon: null, active: false, as: null, count: null, countLabel: null },
);

// A link without a destination was the only way to put an action in the
// sidebar (`href="#profile"` + `@click.prevent`): announced as a link, opened
// "#profile" on middle-click and, for sign-out, did a GET. Without `href` the
// item is a real button instead.
//
// The native element is rendered through `h()` rather than `:is="'button'"`:
// Vue resolves a string `:is` against registered components first, so an app
// that registers the kit's `Button` globally got a primary Button here (a black
// "Sign out") instead of a plain sidebar row.
const NativeButton: FunctionalComponent = (_, { slots, attrs }) => h('button', attrs, slots.default?.());
NativeButton.inheritAttrs = false;
const tag = computed<string | Component>(() => (props.href === null ? NativeButton : (props.as ?? 'a')));

const { rootAttrs, classAttr } = useRootAttrs();

// A caller's `class` follows the attrs to the link, so `cx()` merges it against
// the component's own classes rather than the two fighting over specificity.
const classes = computed(() =>
    cx(
        'flex w-full items-center gap-2.5 rounded-control px-2.5 min-h-9 text-left text-sm font-medium transition cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus/50',
        // Active: the nav-active role tokens. The marker is an inset edge bar,
        // transparent (invisible) unless a consuming app sets the token.
        props.active
            ? 'bg-nav-active-bg text-nav-active-fg shadow-[inset_3px_0_0_var(--color-nav-active-marker)]'
            : 'text-muted hover:bg-surface-2 hover:text-ink',
        classAttr.value,
    ),
);
</script>

<template>
  <li>
    <component
      :is="tag"
      :href="href ?? undefined"
      :type="href === null ? 'button' : undefined"
      :class="classes"
      :aria-current="active ? 'page' : undefined"
      data-slot="sidebar-item"
      :data-state="active ? 'active' : undefined"
      v-bind="rootAttrs"
    >
      <Icon
        v-if="icon !== null"
        :name="icon"
        size="sm"
        class="shrink-0 text-dim"
        data-slot="sidebar-item-icon"
      />
      <span class="min-w-0 flex-1 truncate"><slot /></span>
      <span
        v-if="count"
        data-slot="sidebar-item-count"
        class="min-w-5 rounded-full bg-surface-2 px-1.5 text-center text-2xs font-medium text-ink tabular-nums"
        :aria-label="countLabel ?? undefined"
      >{{ count }}</span>
      <slot name="trailing" />
    </component>
  </li>
</template>
