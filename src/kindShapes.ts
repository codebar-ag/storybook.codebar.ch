/**
 * Silhouettes for the `KindMark` atom — the kit's third categorical channel,
 * after `Tone` (severity) and `Category` (identity, in colour).
 *
 * ## Why a shape channel exists at all
 *
 * `Category` ships three colours and v1.15.0 documented that as a **measured
 * ceiling**, not a first instalment: inside the one arc of the hue wheel that
 * clears AA-as-text on three grounds, holds enough chroma to read as a hue, and
 * stays clear of every severity token, three is the largest mutually separable
 * set. A fourth collapses the worst pair to ΔE≈3 under simulated red-green
 * colour blindness.
 *
 * That is a hard stop, and a real consuming app ran into it: a flow-graph
 * diagram with **15 node kinds**, drawn on 12 raw Tailwind hues because there
 * was nothing else to draw them with. Several of those hues sat on top of the
 * severity ramp, so a node whose *kind* happened to be "data source" rendered
 * in the same amber the UI uses for "something is wrong".
 *
 * No fourth colour fixes that, and neither does a fifth. The fix is a channel
 * that is not colour.
 *
 * ## The greyscale test, and the number that settles it
 *
 * The test a non-colour channel has to pass is: print it in black and white and
 * every kind is still distinguishable. That is not rhetorical — measured on the
 * kit's own categorical tokens, `--color-cat-indigo` and `--color-cat-magenta`
 * are **L\* 40.7 and 40.6**. A difference of 0.2. Desaturated they are the same
 * grey, and the whole three-colour vocabulary carries about as much information
 * as one grey and one dark grey.
 *
 * So in `KindMark` the silhouette is the primary channel and the colour is
 * redundant reinforcement. Remove the colour and nothing is lost.
 *
 * ## Why exactly four silhouettes
 *
 * Measured the same way the colours were, with the metric a shape channel
 * admits: DSSIM = (1 − SSIM) × 100 (structural similarity, Wang et al. 2004),
 * on real Chromium rasters of the real marks at real pixel sizes, greyscale.
 * SSIM's 11×11 Gaussian window is itself a coarse low-pass, which is what
 * "distinguishable at a glance" means.
 *
 * The floor is **DSSIM ≥ 30**, and it is calibrated against controls rather
 * than asserted, because a bare number in a new metric means nothing:
 *
 *   - `circle` ↔ a regular octagon — 13.4. An octagon at mark size *is* a
 *     circle; this is what "indistinguishable" reads as.
 *   - `square` ↔ the same square with a larger corner radius — 25.4. Visibly
 *     the same object.
 *   - `eye` ↔ `eye-slash` in this kit's own icon registry — 26.3. A pair users
 *     demonstrably confuse.
 *
 * Anything at or under ~26 is a pair we can independently confirm is
 * confusable, so 30 is the first honest floor above them.
 *
 * The four shipped silhouettes measure **59.0** at their worst pair
 * (`square` ↔ `circle`, 32px, 1.5px stroke) — better than twice the floor and
 * 4.4× the octagon control. What was rejected, and why:
 *
 *   | rejected   | why |
 *   | ---------- | --- |
 *   | octagon    | 13.4 against `circle` — at mark sizes it is a circle |
 *   | squircle   | 25.4 against `square` — a corner radius is not a shape |
 *   | pentagon   | 53.2 against `hexagon`, and falling with size |
 *   | triangle   | separable (59.0) but **unusable**: its largest centred inscribed square is 30% of the mark box, so it cannot hold a glyph. A silhouette that cannot host the second channel is not a member of this set. |
 *
 * Four is therefore the ceiling of this channel, and it is a happy one: three
 * categories plus "no category" is also exactly four, so every silhouette gets
 * a distinct colour and the two ceilings coincide rather than fight.
 *
 * ## What the numbers say about size
 *
 * The silhouette is the *coarse* channel and stays readable well below the size
 * at which the glyph does. Worst cross-shape pair, outline only, 1.5px stroke:
 *
 *   | mark | worst pair DSSIM |
 *   | ---- | ---------------- |
 *   | 40px | 55.2 |
 *   | 32px | 59.0 |
 *   | 24px | 68.4 |
 *   | 16px | 55.5 |
 *   | 12px | 37.8 |
 *   | 8px  | 25.2 — at the squircle control, i.e. gone |
 *
 * So the family reads down to 12px; below that it does not. The glyph inside
 * needs considerably more room (see `KindMark`), which is the whole point of
 * having two channels rather than one.
 *
 * ## Geometry
 *
 * Every path is drawn on a 32-unit box, inset 1.5 units so a 1.5px stroke never
 * clips at any rendered size. They are outlines: `KindMark` supplies the stroke
 * width, and a decorative soft fill.
 */
export const kindShapes = {
    /** Work: a step that runs. The default and the most capacious. */
    square: '<rect x="1.5" y="1.5" width="29" height="29" rx="7" />',
    /** An event: the thing that starts or times a run. */
    circle: '<circle cx="16" cy="16" r="14.5" />',
    /** A definition matched against: schema, contract, stored data. */
    diamond: '<path d="M16 1.5 30.5 16 16 30.5 1.5 16Z" stroke-linejoin="round" />',
    /** Something outside the system: a service, a server, a model. */
    hexagon: '<path d="M9.75 3.5h12.5L30.5 16l-8.25 12.5H9.75L1.5 16Z" stroke-linejoin="round" />',
} as const;

export type KindShape = keyof typeof kindShapes;
