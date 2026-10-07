import { test, expect, type Page } from '@playwright/test';

// PageHeading's action cluster at phone and desktop width. A shrink-0 cluster
// took its max-content width, so its buttons never wrapped and three or more
// actions pushed the page sideways on a phone.
async function gotoStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect
        .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
        .toBeGreaterThan(0);
}

test('many header actions wrap below the title at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await gotoStory(page, 'molecules-pageheading--many-actions');

    const title = (await page.getByTestId('title').boundingBox())!;
    const first = (await page.getByRole('button', { name: 'Export' }).boundingBox())!;
    const last = (await page.getByRole('button', { name: 'New cabinet' }).boundingBox())!;

    expect(first.y).toBeGreaterThanOrEqual(title.y + title.height);
    expect(last.y).toBeGreaterThan(first.y);

    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
});

test('header actions stay beside the title, right-aligned, on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await gotoStory(page, 'molecules-pageheading--many-actions');

    const title = (await page.getByTestId('title').boundingBox())!;
    const first = (await page.getByRole('button', { name: 'Export' }).boundingBox())!;
    const last = (await page.getByRole('button', { name: 'New cabinet' }).boundingBox())!;
    const rowRight = await page
        .getByTestId('title')
        .evaluate((el) => el.parentElement!.parentElement!.getBoundingClientRect().right);

    expect(first.y).toBeLessThan(title.y + title.height);
    expect(Math.abs(last.y - first.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(last.x + last.width - rowRight)).toBeLessThanOrEqual(1);
});
