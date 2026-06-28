<script setup lang="ts">
// A single tab pill in a tab bar. The active tab is filled and carries
// aria-current; the rest are quiet until hovered. Renders an <a> so it works
// for both Inertia and full-page navigation.
withDefaults(defineProps<{ href: string; active?: boolean }>(), { active: false });
</script>

<template>
    <a
        :href="href"
        :aria-current="active ? 'page' : undefined"
        :class="[
            'inline-flex items-center justify-center min-h-11 whitespace-nowrap rounded-pill px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
            active ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
        ]"
    >
        <slot />
    </a>
</template>
