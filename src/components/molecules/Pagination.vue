<script setup lang="ts">
import Button from '../atoms/Button.vue';

// Prev/next pager for cursor/simple-paginated lists. Renders nothing when neither
// link is present, so callers can drop it in unconditionally. Links are plain hrefs
// by default (Inertia-agnostic) — under Inertia the `<a>` triggers a full page
// visit unless intercepted. Pass `onNavigate` to intercept the click and handle
// navigation yourself (e.g. Inertia's router.visit for a partial/preserve-state
// reload) without making @inertiajs/vue3 a package dependency.
const props = withDefaults(
    defineProps<{
        prevHref?: string | null;
        nextHref?: string | null;
        prevLabel?: string;
        nextLabel?: string;
        onNavigate?: ((href: string) => void) | null;
    }>(),
    { prevHref: null, nextHref: null, prevLabel: 'Previous', nextLabel: 'Next', onNavigate: null },
);

function click(event: MouseEvent, href: string | null): void {
    if (!href || !props.onNavigate) {
        return;
    }
    event.preventDefault();
    props.onNavigate(href);
}
</script>

<template>
  <div
    v-if="prevHref || nextHref"
    class="mt-3 flex items-center gap-2"
  >
    <Button
      v-if="prevHref"
      :href="prevHref"
      variant="ghost"
      size="sm"
      @click="(event) => click(event, prevHref)"
    >
      {{ prevLabel }}
    </Button>
    <Button
      v-if="nextHref"
      :href="nextHref"
      variant="ghost"
      size="sm"
      @click="(event) => click(event, nextHref)"
    >
      {{ nextLabel }}
    </Button>
  </div>
</template>
