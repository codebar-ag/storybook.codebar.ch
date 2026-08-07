/**
 * Data source for the Foundations stories: every design token from
 * src/tokens.css with the utility class that exercises it and its role.
 * The class strings are literal so Tailwind's scanner generates them.
 */

export interface ColorToken {
    token: string;
    swatchClass: string;
    role: string;
}

export interface ColorGroup {
    title: string;
    description: string;
    tokens: ColorToken[];
    /**
     * Render an extra 8px dot beside each swatch. A 40px swatch flatters a
     * colour chosen for 8px shapes, so the dot tier is shown at the size it is
     * actually specified for — that is the only size at which the choice can
     * be judged.
     */
    dotPreview?: boolean;
}

export const colorGroups: ColorGroup[] = [
    {
        title: 'Neutral ramp',
        description: 'Backgrounds, surfaces, borders and the three text tiers of the monochrome UI.',
        tokens: [
            { token: '--color-bg', swatchClass: 'bg-bg', role: 'Page background' },
            { token: '--color-surface', swatchClass: 'bg-surface', role: 'Cards, panels, controls' },
            { token: '--color-surface-2', swatchClass: 'bg-surface-2', role: 'Nested/secondary surfaces' },
            { token: '--color-line', swatchClass: 'bg-line', role: 'Borders (≥3:1 non-text contrast)' },
            { token: '--color-line-2', swatchClass: 'bg-line-2', role: 'Hover/emphasis borders' },
            { token: '--color-ink', swatchClass: 'bg-ink', role: 'Primary text' },
            { token: '--color-ink-hover', swatchClass: 'bg-ink-hover', role: 'Primary button hover' },
            { token: '--color-muted', swatchClass: 'bg-muted', role: 'Secondary text' },
            { token: '--color-dim', swatchClass: 'bg-dim', role: 'Captions, table headers (AA on bg)' },
            { token: '--color-accent', swatchClass: 'bg-accent', role: 'Links, focus rings, selection (rides ink)' },
        ],
    },
    {
        title: 'Status',
        description: 'Each role ships as a base/soft/line triplet: text, surface tint, border.',
        tokens: [
            { token: '--color-success', swatchClass: 'bg-success', role: 'Success text' },
            { token: '--color-success-soft', swatchClass: 'bg-success-soft', role: 'Success surface tint' },
            { token: '--color-success-line', swatchClass: 'bg-success-line', role: 'Success border' },
            { token: '--color-warning', swatchClass: 'bg-warning', role: 'Warning text' },
            { token: '--color-warning-soft', swatchClass: 'bg-warning-soft', role: 'Warning surface tint' },
            { token: '--color-warning-line', swatchClass: 'bg-warning-line', role: 'Warning border' },
            { token: '--color-danger', swatchClass: 'bg-danger', role: 'Danger text' },
            { token: '--color-danger-soft', swatchClass: 'bg-danger-soft', role: 'Danger surface tint' },
            { token: '--color-danger-line', swatchClass: 'bg-danger-line', role: 'Danger border' },
        ],
    },
    {
        title: 'Status — dot tier',
        description:
            'A fourth step beside base/soft/line, for small decorative shapes only: status dots, '
            + '8px indicators, sparkline points, timeline nodes. These clear WCAG 1.4.11 non-text '
            + 'contrast (≥3:1) rather than the 4.5:1 text threshold — at 8px there is no text to '
            + 'read, and holding them to the text ramp makes them read as near-black, brown and '
            + 'wine. Never use them for text, icons-as-text or borders, and never as the only '
            + 'carrier of meaning: a dot always sits next to a label.',
        dotPreview: true,
        tokens: [
            { token: '--color-success-dot', swatchClass: 'bg-success-dot', role: 'Success dot (decorative, ≥3:1)' },
            { token: '--color-warning-dot', swatchClass: 'bg-warning-dot', role: 'Warning dot (decorative, ≥3:1)' },
            { token: '--color-danger-dot', swatchClass: 'bg-danger-dot', role: 'Danger dot (decorative, ≥3:1)' },
        ],
    },
    {
        title: 'Categorical — identity, not severity',
        description:
            'A vocabulary parallel to Status, for state that carries no severity: on/off, '
            + 'inherited/overridden, first/duplicate, draft/published, or a kind-of-thing label. '
            + 'Without it those borrow the severity ramp — "enabled" rendered as success, '
            + '"duplicate" as info — and the UI reports a problem where there is none. '
            + 'Three is a MEASURED CEILING, not a starting point. A categorical hue has to clear '
            + 'AA as text (≥4.5:1) on white, on bg and on its own soft tint; hold OKLCH chroma '
            + '≥0.10 so it reads as a hue rather than as gray; and stay separated by OKLab ΔE from '
            + 'both the other categories and every severity token. That rejects the warm half of '
            + 'the wheel (red/orange/amber/lime/green all collapse into danger/warning/success) '
            + 'and teal/cyan (chroma 0.06 at text weight — they render gray), leaving one ~60° '
            + 'blue→magenta arc with room for exactly three. A fourth drops the worst pair to '
            + 'ΔE≈3 under simulated red-green colour blindness. More kinds than three need a '
            + 'channel that is not colour: an icon, or the label itself.',
        tokens: [
            { token: '--color-cat-indigo', swatchClass: 'bg-cat-indigo', role: 'Category text (6.29:1 on white)' },
            { token: '--color-cat-indigo-soft', swatchClass: 'bg-cat-indigo-soft', role: 'Category surface tint' },
            { token: '--color-cat-indigo-line', swatchClass: 'bg-cat-indigo-line', role: 'Category border' },
            { token: '--color-cat-purple', swatchClass: 'bg-cat-purple', role: 'Category text (10.88:1 on white)' },
            { token: '--color-cat-purple-soft', swatchClass: 'bg-cat-purple-soft', role: 'Category surface tint' },
            { token: '--color-cat-purple-line', swatchClass: 'bg-cat-purple-line', role: 'Category border' },
            { token: '--color-cat-magenta', swatchClass: 'bg-cat-magenta', role: 'Category text (6.32:1 on white)' },
            { token: '--color-cat-magenta-soft', swatchClass: 'bg-cat-magenta-soft', role: 'Category surface tint' },
            { token: '--color-cat-magenta-line', swatchClass: 'bg-cat-magenta-line', role: 'Category border' },
        ],
    },
    {
        title: 'CTA',
        description: 'The one intentional color in the monochrome UI — reserved for the billing action.',
        tokens: [
            { token: '--color-cta', swatchClass: 'bg-cta', role: 'Billing CTA' },
            { token: '--color-cta-hover', swatchClass: 'bg-cta-hover', role: 'Billing CTA hover' },
        ],
    },
];

export interface TypeStep {
    token: string;
    textClass: string;
    px: string;
    use: string;
}

export const typeScale: TypeStep[] = [
    { token: '--text-2xs', textClass: 'text-2xs', px: '11px / 16px', use: 'Badges, captions, breadcrumbs' },
    { token: '--text-xs', textClass: 'text-xs', px: '12px / 16px', use: 'Helper text, footer, metadata' },
    { token: '--text-sm', textClass: 'text-sm', px: '13px / 18px', use: 'Body default, controls' },
    { token: '--text-base', textClass: 'text-base', px: '14px / 20px', use: 'Emphasized body, buttons' },
    { token: '--text-lg', textClass: 'text-lg', px: '16px / 24px', use: 'Card titles, section leads' },
    { token: '--text-xl', textClass: 'text-xl', px: '20px / 28px', use: 'Page H1, auth/section headers' },
    { token: '--text-2xl', textClass: 'text-2xl', px: '24px / 32px', use: 'Error-page headline, display figures' },
];

export interface RadiusToken {
    token: string;
    radiusClass: string;
    px: string;
    use: string;
}

export const radii: RadiusToken[] = [
    { token: '--radius-pill', radiusClass: 'rounded-pill', px: '6px', use: 'Segmented-control pills nested in a control' },
    { token: '--radius-control', radiusClass: 'rounded-control', px: '8px', use: 'Buttons, inputs, badges, alerts' },
    { token: '--radius-surface', radiusClass: 'rounded-surface', px: '12px', use: 'Cards, dropdowns, callouts' },
];

export interface ShadowToken {
    token: string;
    shadowClass: string;
    use: string;
}

export const shadows: ShadowToken[] = [
    { token: '--shadow-card', shadowClass: 'shadow-card', use: 'Resting card elevation' },
    { token: '--shadow-card-hover', shadowClass: 'shadow-card-hover', use: 'Hovered/lifted cards' },
];

export interface SpacingStep {
    name: string;
    widthClass: string;
    px: string;
}

/** The spacing steps the kit actually uses (Tailwind scale, 1 unit = 4px). */
export const spacingSteps: SpacingStep[] = [
    { name: '0.5', widthClass: 'w-0.5', px: '2px' },
    { name: '1', widthClass: 'w-1', px: '4px' },
    { name: '1.5', widthClass: 'w-1.5', px: '6px' },
    { name: '2', widthClass: 'w-2', px: '8px' },
    { name: '2.5', widthClass: 'w-2.5', px: '10px' },
    { name: '3', widthClass: 'w-3', px: '12px' },
    { name: '3.5', widthClass: 'w-3.5', px: '14px' },
    { name: '4', widthClass: 'w-4', px: '16px' },
    { name: '5', widthClass: 'w-5', px: '20px' },
    { name: '6', widthClass: 'w-6', px: '24px' },
    { name: '8', widthClass: 'w-8', px: '32px' },
    { name: '10', widthClass: 'w-10', px: '40px' },
    { name: '12', widthClass: 'w-12', px: '48px' },
    { name: '16', widthClass: 'w-16', px: '64px' },
];
