<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        id: string | number;
        uuid?: string | null;
    }>(),
    { uuid: null },
);

const shortUuid = computed(() => (props.uuid ? props.uuid.slice(0, 8) : ''));
</script>

<template>
  <span class="font-mono text-sm text-ink">#{{ id }}</span>
  <span
    v-if="shortUuid"
    class="block font-mono text-2xs text-muted"
  >{{ shortUuid }}</span>
</template>
