<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Thin ApexCharts wrapper. `apexcharts` is an OPTIONAL peer dependency: it is
// imported lazily so apps that never render a chart don't pay for the bundle.
const props = withDefaults(
    defineProps<{
        type?: string;
        series: unknown[];
        options?: Record<string, unknown>;
        height?: number | string;
    }>(),
    { type: 'line', options: () => ({}), height: 288 },
);

const el = ref<HTMLDivElement | null>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let chart: any = null;

async function render(): Promise<void> {
    if (!el.value) {
        return;
    }
    const mod = await import('apexcharts');
    const ApexCharts = mod.default;
    const config = {
        chart: { type: props.type, height: props.height, toolbar: { show: false } },
        series: props.series,
        ...props.options,
    };
    chart = new ApexCharts(el.value, config);
    await chart.render();
}

onMounted(render);

watch(
    () => [props.series, props.options],
    () => {
        chart?.updateOptions({ series: props.series, ...props.options });
    },
    { deep: true },
);

onBeforeUnmount(() => chart?.destroy());
</script>

<template>
  <div class="h-64 sm:h-72">
    <div
      ref="el"
      class="h-full w-full"
    />
  </div>
</template>
