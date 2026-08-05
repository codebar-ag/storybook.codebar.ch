/**
 * Single source of truth for the pointer/touch target of the kit's small,
 * icon-only controls.
 *
 * Every `Button` in this kit is `h-11` (44px) at *every* size — `sm`, `md` and
 * `lg` all resolve to the same height, on purpose. But a copy chip, a dialog
 * close glyph or a mobile nav toggle is deliberately drawn much smaller: it
 * sits inline next to body text and must not out-weigh it. That left the kit
 * with two control families of wildly different reach — a 44px `Button` and a
 * 24px `CopyButton` — sitting side by side in the same row.
 *
 * `touchTargetClasses` reconciles them. It hangs a transparent 44x44 `::after`
 * off the control, centred on the control's own box. The pseudo-element is
 * absolutely positioned, so it takes no layout space and shifts no neighbour:
 * the control still *looks* exactly as small as before. But a pseudo-element
 * hit-tests as part of the element that generates it, so a pointer or finger
 * anywhere inside the 44px square activates the control.
 *
 * Why a fixed centred square rather than the more familiar `after:-inset-2`:
 * an inset is measured from the control's own border box, so it only lands on
 * 44px for one particular control size and silently under- or over-shoots for
 * every other one. `after:size-11` is 44px regardless of what it wraps, which
 * is what makes it safe to share between components of different sizes.
 *
 * The target is purely additive — it can only ever grow the hit area, never
 * shrink it — so it is harmless on a control that is already large enough.
 *
 * Two constraints on where this can be applied:
 *
 *  - The control must be able to carry pseudo-elements. Replaced elements
 *    (`<input>`, `<img>`, `<select>`) render none, so a bare checkbox needs the
 *    label wrapper below instead of this helper.
 *  - Targets grow outward and will overlap if two of them sit closer than 44px
 *    apart. That is fine for controls separated by normal row spacing, but
 *    controls packed edge to edge (a stepper's `-`/`+` pair) must keep their
 *    own bounds so neither steals the other's clicks.
 *
 * A control that can afford the layout space should just be 44px for real —
 * `Toaster`'s dismiss button uses `min-h-11 min-w-11` and needs nothing from
 * here. This helper exists for the cases where 44px of real box would push the
 * surrounding text around.
 *
 * Reference: WCAG 2.5.8 Target Size (Minimum, AA) sets the floor at 24x24 CSS
 * px; 44x44 is the AAA-level 2.5.5 figure and the number both platform HIGs
 * use.
 */
export const touchTargetClasses =
    "relative after:absolute after:left-1/2 after:top-1/2 after:size-11 " +
    "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']";

/**
 * The same problem for a control the helper above cannot touch: a bare
 * `<input type="checkbox">`.
 *
 * An `<input>` is a *replaced* element. It has no children and generates no
 * `::before`/`::after`, so `touchTargetClasses` is inert on it — the
 * declaration is applied and the browser produces nothing. A `size-4` table
 * checkbox therefore stays a 16x16 target: below this kit's 44px standard and
 * below the 24x24 floor of WCAG 2.5.8 (AA).
 *
 * The way around a replaced element is to stop trying to grow the element and
 * grow something wrapped *around* it instead. A `<label>` containing the input
 * forwards its own clicks to that input natively — no JS, no `for`/`id` pair to
 * keep unique per row — and, unlike the input, a label does render
 * pseudo-elements. So the label carries a transparent absolutely positioned
 * `::before`, and that pseudo-element is the target.
 *
 * `touchTargetLabelClasses` keeps the label itself `static`, which is the whole
 * trick: an absolutely positioned box resolves against its nearest *positioned*
 * ancestor, so skipping over the label makes the `::before` size itself to
 * whichever ancestor carries `touchTargetBoundsClasses` — a table cell, in
 * practice. Two consequences worth stating plainly:
 *
 *  - **The target is exactly the bounds element, so it can never overlap its
 *    neighbours.** Sizing it to a fixed `size-11` instead would look better in
 *    a changelog and be wrong in a dense table: rows shorter than 44px would
 *    hand each other's clicks around. Filling the cell takes every pixel that
 *    is genuinely free and not one more.
 *  - **The target is therefore only as tall as the row.** A comfortable row
 *    clears 44px and a compact one does not. Where it does not, this buys the
 *    largest honest target rather than the advertised one — still several times
 *    the 16px it replaces, and still above the WCAG 2.5.8 floor.
 *
 * The label stays inline and unstyled in flow (no `flex`, no padding), so it
 * wraps the input without generating a box of its own: row height and column
 * width are bit-for-bit what they were before the wrapper appeared. Only the
 * out-of-flow `::before` is new.
 *
 * The label is also why row-level click handlers keep working. A click on the
 * expanded area targets the `<label>`, which any "did this land on something
 * interactive?" guard already has to recognise alongside `a`, `button` and
 * `input` — so selecting a row does not also navigate to it.
 */
export const touchTargetBoundsClasses = "relative";

export const touchTargetLabelClasses =
    "static cursor-pointer before:absolute before:inset-0 before:content-['']";
