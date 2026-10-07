import { test, expect, type Page } from '@playwright/test';

// DataTable's client pager on a phone. The story's play function already pins
// the desktop geometry (rule, padding, alignment); this checks the one thing a
// play function cannot: that at a phone viewport the pager still fits inside
// its card on one line instead of overflowing or wrapping its buttons.
async function gotoStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect
        .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
        .toBeGreaterThan(0);
}

test('the DataTable pager fits inside its card at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoStory(page, 'organisms-datatable--paginated-in-card');

    for (const id of ['unpadded', 'padded']) {
        const card = page.getByTestId(id);
        const cardBox = (await card.boundingBox())!;
        const label = card.getByText(/^Page \d+ of \d+$/);
        const labelBox = (await label.boundingBox())!;
        const prev = (await card.getByRole('button', { name: 'Previous' }).boundingBox())!;
        const next = (await card.getByRole('button', { name: 'Next' }).boundingBox())!;

        // Inside the card with breathing room on every side.
        expect(labelBox.x - cardBox.x).toBeGreaterThanOrEqual(16);
        expect(cardBox.x + cardBox.width - (next.x + next.width)).toBeGreaterThanOrEqual(16);

        // One line: label and both buttons share a vertical centre.
        const mid = (box: { y: number; height: number }) => box.y + box.height / 2;
        expect(Math.abs(mid(prev) - mid(next))).toBeLessThanOrEqual(1);
        expect(Math.abs(mid(labelBox) - mid(next))).toBeLessThanOrEqual(1);
        expect(prev.x + prev.width).toBeLessThan(next.x);
    }

    // And the page itself does not scroll sideways because of it.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
});

test('a DataTable with row actions does not scroll the page sideways at phone width', async ({ page }) => {
    // The actions header is `<span class="sr-only">`, which is absolutely
    // positioned. Unless the horizontal scroller is a containing block, the
    // span escapes it to the table's far right edge and widens the page.
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoStory(page, 'organisms-datatable--full');
    await expect(page.getByText('Actions', { exact: true })).toHaveCount(1);

    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
});
