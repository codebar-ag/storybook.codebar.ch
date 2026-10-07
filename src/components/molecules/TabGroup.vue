<script setup lang="ts">
// A row of link `Tab`s in their segmented track, as page navigation (status
// filters, sub-pages). Scrolls sideways on its own when the tabs outgrow a
// phone, so the page never does. For in-page panels use `Tabs` instead.
//
//     <TabGroup label="Filter">
//         <Tab href="?status=open" :active="true" :count="4">Open</Tab>
//         <Tab href="?status=paid" :count="12">Paid</Tab>
//     </TabGroup>
import { segmentedTrackClasses } from '../../helpers/segmented';

export interface TabGroupProps {
    /** Accessible name of the navigation landmark, e.g. "Filter". */
    label: string;
}

defineProps<TabGroupProps>();
</script>

<template>
  <nav
    :aria-label="label"
    class="relative -mx-1 max-w-full overflow-x-auto px-1"
  >
    <div :class="segmentedTrackClasses">
      <slot />
    </div>
  </nav>
</template>
