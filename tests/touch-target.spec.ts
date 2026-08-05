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
