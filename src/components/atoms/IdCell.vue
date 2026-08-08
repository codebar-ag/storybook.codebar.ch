<script setup lang="ts">
import { computed } from 'vue';

export interface IdCellProps {
    id: string | number;
    uuid?: string | null;
}

const props = withDefaults(
    defineProps<IdCellProps>(),
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
