<script setup lang="ts">
// The container for `ListRow`s: a real `<ul>` whose rows become `<li>`s on
// their own (ListRow injects `stackedListKey`). Before it existed, callers
// wrapped rows in a bare `<div>` (the stories) or in `List` — which is the
// dash-bulleted prose list, so rows landed as `<a>`/`<div>` children of a
// `<ul>` (invalid) and picked up its `space-y-1.5` gaps between rows.
//
// The first row's divider is dropped here, so callers no longer thread
// `:first="index === 0"` through every v-for (it still works if passed).
//
//     <StackedList>
//         <ListRow v-for="item in items" :key="item.id" :title="item.name" />
//     </StackedList>
import { provide } from 'vue';
import { stackedListKey } from '../../helpers/stackedList';

export interface StackedListProps {
    /** Accessible name, when the surrounding heading does not already give one. */
    label?: string | null;
}

withDefaults(defineProps<StackedListProps>(), { label: null });

provide(stackedListKey, true);
</script>

<template>
  <ul
    role="list"
    :aria-label="label ?? undefined"
    class="[&>li:first-child>*]:border-t-0"
  >
    <slot />
  </ul>
</template>
