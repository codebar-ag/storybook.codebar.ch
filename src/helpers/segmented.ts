/**
 * The track a row of tab pills sits in: shared by `TabGroup` (link tabs) and
 * `Tabs` (in-page ARIA tabs) so the two never drift apart.
 */
export const segmentedTrackClasses =
    'inline-flex items-center gap-1 rounded-control border border-line bg-surface-2 p-1';

/** The count a tab carries after its label (results per filter, items per view). */
export const tabCountClasses = 'ml-1.5 text-xs text-muted tabular-nums';
