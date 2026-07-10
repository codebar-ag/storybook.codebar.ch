<script setup lang="ts">
import { computed } from 'vue';

export interface Step {
    key: string;
    label: string;
}

// Horizontal progress indicator for multi-step wizards. Purely presentational:
// the parent owns the active index and navigation.
const props = withDefaults(
    defineProps<{
        steps: Step[];
        current?: number;
    }>(),
    { current: 0 },
);

function state(index: number): 'done' | 'active' | 'todo' {
    if (index < props.current) {
        return 'done';
    }
    return index === props.current ? 'active' : 'todo';
}

const circleClasses: Record<string, string> = {
    done: 'bg-ink text-white border-ink',
    active: 'bg-surface text-ink border-ink',
    todo: 'bg-surface text-muted border-line',
};

const labelClasses: Record<string, string> = {
    done: 'text-ink',
    active: 'text-ink font-medium',
    todo: 'text-muted',
};

const lastIndex = computed(() => props.steps.length - 1);
</script>

<template>
  <ol class="flex items-center w-full">
    <li
      v-for="(step, index) in steps"
      :key="step.key"
      class="flex items-center"
      :class="index === lastIndex ? '' : 'flex-1'"
    >
      <div class="flex items-center gap-2">
        <span
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold"
          :class="circleClasses[state(index)]"
        >
          <span v-if="state(index) === 'done'">&check;</span>
          <span v-else>{{ index + 1 }}</span>
        </span>
        <span
          class="text-xs whitespace-nowrap"
          :class="labelClasses[state(index)]"
        >{{ step.label }}</span>
      </div>
      <span
        v-if="index !== lastIndex"
        class="mx-3 h-px flex-1"
        :class="index < current ? 'bg-ink' : 'bg-line'"
      />
    </li>
  </ol>
</template>
