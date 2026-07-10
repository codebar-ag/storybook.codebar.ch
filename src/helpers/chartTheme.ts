/**
 * Theme-aware ApexCharts defaults. Reads design tokens from CSS custom properties
 * so charts track light/dark themes without hardcoded hex values.
 */

const FONT_FAMILY = '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export function cssToken(name: string, fallback: string): string {
    if (typeof document === 'undefined') {
        return fallback;
    }

    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    return value !== '' ? value : fallback;
}

function tokens() {
    return {
        ink: cssToken('--color-ink', '#18181b'),
        dim: cssToken('--color-dim', '#6e6e78'),
        line: cssToken('--color-line', '#e6e6e9'),
    };
}

function deepMerge<T extends Record<string, unknown>>(base: T, overrides?: Record<string, unknown>): T {
    if (!overrides) {
        return base;
    }

    const result = { ...base } as Record<string, unknown>;

    for (const [key, value] of Object.entries(overrides)) {
        const existing = result[key];

        if (
            value !== null
            && typeof value === 'object'
            && !Array.isArray(value)
            && existing !== null
            && typeof existing === 'object'
            && !Array.isArray(existing)
        ) {
            result[key] = deepMerge(existing as Record<string, unknown>, value as Record<string, unknown>);
        } else {
            result[key] = value;
        }
    }

    return result as T;
}

export function chartBaseOptions(overrides?: Record<string, unknown>): Record<string, unknown> {
    const { dim, line } = tokens();

    const base: Record<string, unknown> = {
        chart: {
            fontFamily: FONT_FAMILY,
            toolbar: { show: false },
            animations: { enabled: true, speed: 300 },
            parentHeightOffset: 0,
        },
        grid: { borderColor: line, strokeDashArray: 4 },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light' },
        legend: { position: 'bottom', labels: { colors: dim } },
        states: { hover: { filter: { type: 'lighten', value: 0.1 } } },
        yaxis: {
            labels: { style: { colors: dim } },
            axisBorder: { color: line },
            axisTicks: { color: line },
        },
    };

    return deepMerge(base, overrides);
}

export function areaChartOptions(overrides?: Record<string, unknown>): Record<string, unknown> {
    const { ink, dim, line } = tokens();

    const base: Record<string, unknown> = {
        colors: [ink],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.02,
                stops: [0, 100],
            },
        },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            type: 'datetime',
            labels: {
                style: { colors: dim },
                hideOverlappingLabels: true,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: "MMM 'yy",
                    day: 'd MMM',
                    hour: 'HH:mm',
                },
            },
            axisBorder: { color: line },
            axisTicks: { color: line },
            tickAmount: 7,
        },
        yaxis: {
            forceNiceScale: true,
            labels: { style: { colors: dim } },
            axisBorder: { color: line },
            axisTicks: { color: line },
        },
    };

    return deepMerge(chartBaseOptions(), deepMerge(base, overrides));
}
