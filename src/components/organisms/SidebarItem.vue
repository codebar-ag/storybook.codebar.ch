<script setup lang="ts">
// One navigation entry: icon + label, active state, framework-agnostic `as`
// for client-side routing (pass e.g. Inertia's Link).
import { computed } from 'vue';
import type { Component } from 'vue';
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
    href: string;
    icon?: IconName | null;
    active?: boolean;
    as?: Component | null;
}

const props = withDefaults(
    defineProps<SidebarItemProps>(),
    { icon: null, active: false, as: null },
);

const { rootAttrs, classAttr } = useRootAttrs();

// A caller's `class` follows the attrs to the link, so `cx()` merges it against
// the component's own classes rather than the two fighting over specificity.
const classes = computed(() =>
    cx(
        'flex items-center gap-2.5 rounded-control px-2.5 min-h-9 text-sm font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50',
        props.active ? 'bg-surface-2 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink',
        classAttr.value,
    ),
);
</script>

<template>
  <li>
    <component
      :is="as"
      v-if="as"
      :href="href"
      :class="classes"
      :aria-current="active ? 'page' : undefined"
      v-bind="rootAttrs"
    >
      <Icon
        v-if="icon !== null"
        :name="icon"
        size="sm"
        class="shrink-0 text-dim"
      />
      <span class="min-w-0 flex-1 truncate"><slot /></span>
      <slot name="trailing" />
    </component>
    <a
      v-else
      :href="href"
      :class="classes"
      :aria-current="active ? 'page' : undefined"
      v-bind="rootAttrs"
    >
      <Icon
        v-if="icon !== null"
        :name="icon"
        size="sm"
        class="shrink-0 text-dim"
      />
      <span class="min-w-0 flex-1 truncate"><slot /></span>
      <slot name="trailing" />
    </a>
  </li>
</template>
