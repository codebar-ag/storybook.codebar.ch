import { test, expect, type Page, type Locator } from '@playwright/test';

// The kit's small icon-only controls (a copy chip, a dialog close glyph, the
// mobile nav toggle) are drawn far smaller than the 44px `h-11` every `Button`
// uses, on purpose — they sit inline next to body text. `touchTargetClasses`
// hangs a transparent 44x44 `::after` off them so the *hit area* reaches 44px
// without the control growing.
//
// A pseudo-element has no `boundingBox()`, and `getComputedStyle` alone would
// only prove the declaration exists, not that it produces a box the browser
// hit-tests. So each control is checked twice:
//
//   1. the pseudo-element's computed box is 44x44, and
//   2. `elementFromPoint` at ±20px from the control's centre — well outside its
//      own border box — resolves back to the control.
//
// (2) is the load-bearing assertion: it is the browser's own hit-testing.
const TARGET = 44;

async function gotoStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect
        .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
        .toBeGreaterThan(0);
}

// Modal and Drawer slide their panel in. `boundingBox()` does not wait for
// actionability, so measuring straight after the open click catches the panel
// mid-transform (the Drawer's close glyph reads ~24px right of its resting
// position). Poll until the box stops moving.
async function settle(control: Locator): Promise<void> {
    let previous = Number.NaN;
    await expect
        .poll(
            async () => {
                const x = (await control.boundingBox())?.x ?? Number.NaN;
                const stable = x === previous;
                previous = x;
                return stable;
            },
            { timeout: 5000, intervals: [100] },
        )
        .toBe(true);
}

async function expectTouchTarget(control: Locator): Promise<void> {
    await settle(control);

    const pseudo = await control.evaluate((node) => {
        const style = getComputedStyle(node, '::after');
        return { content: style.content, width: style.width, height: style.height };
    });

    expect(pseudo.content, 'the ::after must actually be generated').not.toBe('none');
    expect(pseudo.width).toBe(`${TARGET}px`);
    expect(pseudo.height).toBe(`${TARGET}px`);

    // The control's own box must stay small — the point of the technique is
    // that the target grows and the visual does not.
    const box = (await control.boundingBox())!;
    expect(box.width).toBeLessThan(TARGET);
    expect(box.height).toBeLessThanOrEqual(TARGET);

    // Hit-test the four corners of the 44x44 target, minus a 2px inset so the
    // probe can't fall on a rounding boundary.
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const reach = TARGET / 2 - 2;
    const corners = [
        { x: cx - reach, y: cy - reach },
        { x: cx + reach, y: cy - reach },
        { x: cx - reach, y: cy + reach },
        { x: cx + reach, y: cy + reach },
    ];

    const viewport = await control.page().evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));

    for (const point of corners) {
        // Sanity: the probe really is outside the control's own border box in
        // at least one axis, otherwise the assertion below proves nothing.
        const outside = point.x < box.x || point.x > box.x + box.width || point.y < box.y || point.y > box.y + box.height;
        expect(outside, `probe ${JSON.stringify(point)} must sit outside the control's own box`).toBe(true);

        // …and inside the viewport, or `elementFromPoint` returns null and the
        // assertion would fail for a reason that has nothing to do with the
        // target. A control whose 44px target does not fit on screen is a
        // layout problem worth failing on.
        const onScreen = point.x >= 0 && point.y >= 0 && point.x <= viewport.w && point.y <= viewport.h;
        expect(onScreen, `probe ${JSON.stringify(point)} must sit inside the viewport`).toBe(true);

        const hitsControl = await control.evaluate(
            (node, p) => node.contains(document.elementFromPoint(p.x, p.y)) || node === document.elementFromPoint(p.x, p.y),
            point,
        );
        expect(hitsControl, `point ${JSON.stringify(point)} must activate the control`).toBe(true);
    }
}

test('CopyButton reaches a 44px target without growing', async ({ page }) => {
    await gotoStory(page, 'molecules-copybutton--default');
    await expectTouchTarget(page.locator('button[aria-label="Copy to clipboard"]').first());
});

// Both dialog stories carry a play function that opens the panel and closes it
// again with Escape, and both end by restoring focus to the opener. Waiting for
// that focus is the one deterministic "the script is done" signal — without it
// this test races the play function for the same dialog.
async function openAfterPlay(page: Page, opener: string): Promise<void> {
    const button = page.getByRole('button', { name: opener });
    await expect(button).toBeFocused({ timeout: 15_000 });
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await button.click();
    await expect(page.getByRole('dialog')).toBeVisible();
}

test("Modal's close button reaches a 44px target", async ({ page }) => {
    await gotoStory(page, 'organisms-modal--default');
    await openAfterPlay(page, 'Open modal');
    await expectTouchTarget(page.locator('button[aria-label="Close"]').first());
});

test("Drawer's close button reaches a 44px target", async ({ page }) => {
    await gotoStory(page, 'organisms-drawer--default');
    await openAfterPlay(page, 'Show document details');
    await expectTouchTarget(page.locator('button[aria-label="Close"]').first());
});

test("Navbar's mobile menu toggle reaches a 44px target", async ({ page }) => {
    // The toggle is `lg:hidden`, so it only exists below the lg breakpoint.
    await page.setViewportSize({ width: 500, height: 800 });
    await gotoStory(page, 'layouts-appshell--default');
    await expectTouchTarget(page.locator('button[aria-label="Open navigation"]').first());
});

test("Toaster's dismiss button is already 44px of real box", async ({ page }) => {
    // The counter-example: this one can afford the layout space, so it uses
    // `min-h-11 min-w-11` rather than the pseudo-element and needs no helper.
    //
    // The `wide` story, not `default` — `default`'s play function clicks
    // Dismiss itself, and the toast can vanish between the visibility check and
    // the measurement. Toasts also auto-dismiss, so the rect is read in one
    // atomic evaluate rather than via `boundingBox()` on a second round trip.
    await gotoStory(page, 'organisms-toaster--wide');
    await page.getByRole('button', { name: 'Success' }).click();
    const dismiss = page.locator('button[aria-label="Dismiss"]').first();
    await expect(dismiss).toBeVisible();
    const box = await dismiss.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    });
    expect(box.width).toBeGreaterThanOrEqual(TARGET);
    expect(box.height).toBeGreaterThanOrEqual(TARGET);
});

test('the expanded target still activates the control it belongs to', async ({ page, context }) => {
    // End to end, through a real click rather than a hit-test: clicking 18px
    // below the copy chip's centre — outside its 24px box, inside the 44px
    // target — must copy.
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoStory(page, 'molecules-copybutton--default');
    const button = page.locator('button[aria-label="Copy to clipboard"]').first();
    const box = (await button.boundingBox())!;

    await page.mouse.click(box.x + box.width / 2, box.y + box.height + 6);
    await expect(page.getByText('Copied to clipboard').first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// The replaced-element case: DataTable's selection checkboxes.
//
// `touchTargetClasses` cannot reach these. An `<input>` is a replaced element
// and generates no `::after`, so the declaration applies and the browser draws
// nothing — the target stays the 16x16 of the `size-4` box, under the 24x24
// floor of WCAG 2.5.8 (AA). The fix wraps the input in a `<label>` (which does
// render pseudo-elements, and forwards clicks to the input natively) whose
// `::before` fills the whole selection cell.
//
// "Fills the cell" rather than a fixed 44x44 is the deliberate part, and these
// tests are written to hold the claim to that: the target is measured, checked
// against its neighbours for overlap, and the compact case is asserted to be
// *short of 44* rather than quietly rounded up.
//
// The WCAG 2.5.8 (AA) minimum, for the cases that cannot reach 44.
const FLOOR = 24;

// Storybook's own preview chrome carries a hidden table of its own, so every
// lookup below is scoped to the rendered story.
const table = (page: Page): Locator => page.locator('#storybook-root table');

interface Target {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    input: { width: number; height: number };
}

/**
 * Measure what the browser will actually hit.
 *
 * The target is the label's `::before`, and a pseudo-element has no
 * `boundingBox()`. `getComputedStyle(label, '::before')` does report a size,
 * but Chrome resolves it a pixel short of the box it actually hit-tests, so
 * trusting it would bake a rounding artefact into the numbers this change is
 * meant to prove. Instead: step `elementFromPoint` outward from the input's
 * centre, one pixel at a time, in each of the four directions, and stop where
 * the label stops answering. What comes back is the hit area itself, measured
 * the same way a finger finds it.
 */
async function measureTarget(cell: Locator): Promise<Target> {
    const target = await cell.evaluate((node) => {
        const label = node.querySelector('label')!;
        const input = node.querySelector('input[type=checkbox]')!;

        // The technique, not just the outcome: a regression that reached the
        // same size with padding instead of the pseudo-element would change
        // the table's layout, so assert the `::before` is what is doing this.
        const pseudo = getComputedStyle(label, '::before');

        const rect = input.getBoundingClientRect();
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        const hits = (x: number, y: number): boolean => {
            const el = document.elementFromPoint(x, y);
            return el === label || label.contains(el);
        };
        const reach = (dx: number, dy: number): number => {
            let d = 0;
            while (d < 400 && hits(cx + dx * (d + 1), cy + dy * (d + 1))) {
                d += 1;
            }
            return d;
        };

        const left = reach(-1, 0);
        const right = reach(1, 0);
        const top = reach(0, -1);
        const bottom = reach(0, 1);

        // Edges are reported the way a rect does it — right/bottom exclusive —
        // so the last pixel that still hits is `right - 1`.
        return {
            content: pseudo.content,
            position: pseudo.position,
            left: cx - left,
            right: cx + right + 1,
            top: cy - top,
            bottom: cy + bottom + 1,
            width: left + right + 1,
            height: top + bottom + 1,
            input: { width: rect.width, height: rect.height },
        };
    });

    expect(target.content, 'the label must actually generate a ::before').not.toBe('none');
    expect(target.position, 'the ::before must be out of flow, or it would move the table').toBe('absolute');
    expect(target.width, 'the target must be wider than the 16px input').toBeGreaterThan(target.input.width);
    expect(target.height, 'the target must be taller than the 16px input').toBeGreaterThan(target.input.height);

    return target;
}

/**
 * The probe walks in whole pixels and the table's edges carry halves, so every
 * measured edge is allowed to land a pixel either side of the geometric one.
 */
function expectSameEdge(measured: number, expected: number, what: string): void {
    expect(Math.abs(measured - expected), `${what}: measured ${measured}, expected ${expected}`).toBeLessThanOrEqual(1);
}

/** The visual box the design asks for, which must survive all of this untouched. */
async function expectVisualBoxUnchanged(cell: Locator): Promise<void> {
    const input = (await cell.locator('input[type=checkbox]').boundingBox())!;
    expect(input.width, 'the checkbox must still be drawn at 16px').toBe(16);
    expect(input.height, 'the checkbox must still be drawn at 16px').toBe(16);
}

test("DataTable's row checkbox reaches a 44px target without growing", async ({ page }) => {
    await gotoStory(page, 'organisms-datatable--row-click');
    const cell = table(page).locator('tbody tr td:first-child').first();

    await expectVisualBoxUnchanged(cell);

    // 16x16 before, 48x46 after — a comfortable row clears 44 on both axes.
    const target = await measureTarget(cell);
    expect(target.width).toBeGreaterThanOrEqual(TARGET);
    expect(target.height).toBeGreaterThanOrEqual(TARGET);

    // The target is exactly the selection cell it lives in — no more, so it
    // cannot reach a neighbour, and no less.
    const box = (await cell.boundingBox())!;
    expectSameEdge(target.left, box.x, "the target's left edge");
    expectSameEdge(target.right, box.x + box.width, "the target's right edge");
    expectSameEdge(target.top, box.y, "the target's top edge");
    expectSameEdge(target.bottom, box.y + box.height, "the target's bottom edge");
});

test("DataTable's select-all checkbox gets the same treatment", async ({ page }) => {
    await gotoStory(page, 'organisms-datatable--row-click');
    const cell = table(page).locator('thead th:first-child');

    await expectVisualBoxUnchanged(cell);

    const target = await measureTarget(cell);
    expect(target.width).toBeGreaterThanOrEqual(TARGET);
    // Honest ceiling: the header row is 40.5px tall and the row under it holds
    // another target, so this one stops at 40 rather than 44. Still well over
    // the WCAG floor, and 6x the area it had as a bare 16px input.
    expect(target.height).toBeGreaterThanOrEqual(FLOOR);
    expect(target.height, 'if the header ever clears 44, update the changelog rather than this test').toBeLessThan(TARGET);
});

test('a compact row buys the tallest target that fits, and says so', async ({ page }) => {
    // Compact rows are 34px. A 44px target would reach 5px into the row above
    // and 5px into the row below, and each of those rows has a checkbox of its
    // own — so the rows would trade clicks. The target stops at the cell.
    await gotoStory(page, 'organisms-datatable--compact-selectable');
    const cell = table(page).locator('tbody tr td:first-child').first();

    await expectVisualBoxUnchanged(cell);

    const target = await measureTarget(cell);
    const row = (await table(page).locator('tbody tr').first().boundingBox())!;

    expect(target.width).toBeGreaterThanOrEqual(TARGET);
    expectSameEdge(target.height, row.height, 'the target takes the whole row and not a pixel more');
    expect(target.height).toBeGreaterThan(FLOOR);
    expect(target.height, 'compact rows genuinely cannot reach 44 — do not claim they do').toBeLessThan(TARGET);
});

test('checkbox targets never overlap their neighbours', async ({ page }) => {
    for (const story of ['organisms-datatable--row-click', 'organisms-datatable--compact-selectable']) {
        await gotoStory(page, story);

        const boxes = await table(page)
            .locator('thead th:first-child, tbody tr td:first-child')
            .evaluateAll((cells) =>
                cells.map((cell) => {
                    const rect = cell.getBoundingClientRect();
                    return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
                }),
            );

        expect(boxes.length).toBeGreaterThan(2);
        for (let i = 1; i < boxes.length; i += 1) {
            // Consecutive targets may touch, never overlap. 0.5px of slack for
            // the subpixel row borders.
            expect(
                boxes[i].top,
                `${story}: target ${i} must start at or below the bottom of target ${i - 1}`,
            ).toBeGreaterThanOrEqual(boxes[i - 1].bottom - 0.5);
        }

        // And horizontally: the target must stay inside its own column.
        const nextColumnLeft = (await table(page).locator('thead th').nth(1).boundingBox())!.x;
        for (const box of boxes) {
            expect(box.right, `${story}: target must not reach into the next column`).toBeLessThanOrEqual(nextColumnLeft + 0.5);
        }
    }
});

test('wrapping the input in a label changes no table geometry', async ({ page }) => {
    // The A/B the constraint actually asks for: measure the table, then unwrap
    // every label back to the bare input it used to be — the pre-change DOM —
    // and measure again. Any row that got taller or column that got wider shows
    // up as a mismatch. Comparing the page against itself rather than against
    // recorded numbers keeps this immune to platform font metrics.
    const geometry = () =>
        page.evaluate(() => {
            const table = document.querySelector('#storybook-root table')!;
            const round = (n: number) => Math.round(n * 100) / 100;
            const rect = (el: Element) => {
                const r = el.getBoundingClientRect();
                return [round(r.x), round(r.y), round(r.width), round(r.height)].join();
            };
            return {
                rows: Array.from(table.querySelectorAll('tbody tr')).map(rect),
                columns: Array.from(table.querySelectorAll('thead th')).map(rect),
                inputs: Array.from(table.querySelectorAll('input[type=checkbox]')).map(rect),
            };
        });

    for (const story of ['organisms-datatable--full', 'organisms-datatable--row-click', 'organisms-datatable--compact-selectable']) {
        await gotoStory(page, story);
        const after = await geometry();
        expect(after.inputs.length).toBeGreaterThan(0);

        await page.evaluate(() => {
            document
                .querySelectorAll('#storybook-root table label')
                .forEach((label) => label.replaceWith(...Array.from(label.childNodes)));
            document
                .querySelectorAll('#storybook-root table th, #storybook-root table td')
                .forEach((cell) => cell.classList.remove('relative'));
        });
        const before = await geometry();

        expect(before, `${story}: the wrapper must not move anything`).toEqual(after);
    }
});

test('clicking the enlarged target selects the row and does not open it', async ({ page }) => {
    // DataTable emits `row-click`, and the checkbox target now covers a whole
    // cell of that row — so the click has to reach the input and stop there.
    await gotoStory(page, 'organisms-datatable--row-click');

    const selectedCount = page.getByTestId('selected-count');
    const openedCount = page.getByTestId('opened-count');
    await expect(selectedCount).toHaveText('Selected: 0');

    const cell = table(page).locator('tbody tr td:first-child').first();
    const target = await measureTarget(cell);
    const input = cell.locator('input[type=checkbox]');
    const inputBox = (await input.boundingBox())!;

    // Bottom-left of the target: inside the enlarged area, clear of the input.
    const point = { x: target.left + 3, y: target.bottom - 3 };
    expect(point.x).toBeLessThan(inputBox.x);
    expect(point.y).toBeGreaterThan(inputBox.y + inputBox.height);

    await page.mouse.click(point.x, point.y);
    await expect(input).toBeChecked();
    await expect(selectedCount).toHaveText('Selected: 1');
    await expect(openedCount).toHaveText('Opened: 0');

    // Clicking the same target again deselects — one click, one toggle, no
    // double-fire from the label forwarding to the input.
    await page.mouse.click(point.x, point.y);
    await expect(input).not.toBeChecked();
    await expect(selectedCount).toHaveText('Selected: 0');
    await expect(openedCount).toHaveText('Opened: 0');

    // And the rest of the row still navigates, so the guard did not overreach.
    await table(page).locator('tbody tr td').nth(1).click();
    await expect(openedCount).toHaveText('Opened: 1');
});

test('the standalone Checkbox atom already reserves a 44px label', async ({ page }) => {
    // Checked, not assumed: `Checkbox`, `Radio` and `Toggle` all wrap their
    // input in a label with real layout (`min-h-11`, or `p-3` for Radio's
    // card), so they need nothing from either helper. Two stacked instances
    // also must not overlap.
    for (const story of ['atoms-checkbox--states', 'atoms-radio--states', 'atoms-toggle--default']) {
        await gotoStory(page, story);
        const boxes = await page
            .locator('#storybook-root label')
            .evaluateAll((labels) => labels.map((l) => l.getBoundingClientRect()).map((r) => ({ top: r.top, bottom: r.bottom, height: r.height })));

        expect(boxes.length, story).toBeGreaterThan(0);
        for (const box of boxes) {
            expect(box.height, `${story}: the label is the target and must clear 44px`).toBeGreaterThanOrEqual(TARGET);
        }
        for (let i = 1; i < boxes.length; i += 1) {
            expect(boxes[i].top, `${story}: stacked targets must not overlap`).toBeGreaterThanOrEqual(boxes[i - 1].bottom - 0.5);
        }
    }
});
