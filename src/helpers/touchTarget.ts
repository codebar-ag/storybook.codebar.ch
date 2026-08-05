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
 *    (`<input>`, `<img>`, `<select>`) render none, so a bare checkbox needs a
 *    padded label wrapper instead of this helper.
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
