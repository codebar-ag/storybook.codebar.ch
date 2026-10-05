/**
 * Single source of truth for the Tailwind class strings shared by the form
 * controls (Input, Select, Textarea). The base box, error, and disabled states
 * live here so the three components never drift apart; each control passes its
 * own sizing classes (height/padding) for the parts that genuinely differ.
 *
 * Text is `text-control` (16px) below `sm`: iOS Safari zooms the whole page
 * into any focused field whose font is under 16px.
 */
const BASE =
    'block w-full rounded-control border text-control sm:text-base transition ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-2';

const STATE_ERROR = 'border-danger-line bg-danger-soft/40 text-ink';

const STATE_DEFAULT = 'border-line bg-bg text-ink';

/**
 * Build the full class string for a control.
 *
 * @param hasError whether the control is in its invalid state
 * @param sizing   control-specific box classes, e.g. 'px-3.5 h-11'
 */
export function formControlClasses(hasError: boolean, sizing = ''): string {
    return [BASE, sizing, hasError ? STATE_ERROR : STATE_DEFAULT]
        .filter(Boolean)
        .join(' ')
        .trim();
}
