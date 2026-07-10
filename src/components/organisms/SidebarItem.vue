<script setup lang="ts">
// One navigation entry: icon + label, active state, framework-agnostic `as`
// for client-side routing (pass e.g. Inertia's Link).
import { computed } from 'vue';
import type { Component } from 'vue';
import Icon from '../atoms/Icon.vue';
import type { IconName } from '../../icons';

const props = withDefaults(
    defineProps<{
        href: string;
        icon?: IconName | null;
        active?: boolean;
        as?: Component | null;
    }>(),
    { icon: null, active: false, as: null },
);

const classes = computed(() => [
    'flex items-center gap-2.5 rounded-control px-2.5 min-h-9 text-sm font-medium transition',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50',
    props.active ? 'bg-surface-2 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink',
]);
</script>

<template>
  <li>
    <component
      :is="as"
      v-if="as"
      :href="href"
      :class="classes"
      :aria-current="active ? 'page' : undefined"
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
