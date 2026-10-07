import { test, expect, type Page } from '@playwright/test';

// The page-scroll lock behind Modal, Drawer and FullscreenPanel. It lives here
// rather than in play functions because it asserts on the window's scroll
// position and wheel scrolling, which belong to the page, not the canvas.
async function gotoStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect
        .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
        .toBeGreaterThan(0);
}

interface PageLock {
    scrollY: number;
    bodyPosition: string;
    bodyTop: string;
    rootOverflow: string;
}

function readLock(page: Page): Promise<PageLock> {
    return page.evaluate(() => ({
        scrollY: window.scrollY,
        bodyPosition: document.body.style.position,
        bodyTop: document.body.style.top,
        rootOverflow: document.documentElement.style.overflow,
    }));
}

async function expectLockedAt(page: Page, scrollY: number): Promise<void> {
    const lock = await readLock(page);
    expect(lock.bodyPosition).toBe('fixed');
    expect(lock.bodyTop).toBe(`-${scrollY}px`);
    expect(lock.rootOverflow).toBe('hidden');
}

async function expectReleasedAt(page: Page, scrollY: number): Promise<void> {
    await expect.poll(() => readLock(page)).toEqual({
        scrollY,
        bodyPosition: '',
        bodyTop: '',
        rootOverflow: '',
    });
}

test('a modal pins the page where it was and puts it back on close', async ({ page }) => {
    await gotoStory(page, 'organisms-modal--stacked');
    const opener = page.getByRole('button', { name: 'Open first dialog' });
    await opener.scrollIntoViewIfNeeded();
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    await opener.click();
    await expect(page.getByRole('dialog', { name: 'First dialog' })).toBeVisible();
    await expectLockedAt(page, scrollY);

    // The page behind does not move under the wheel.
    await page.mouse.move(5, 5);
    await page.mouse.wheel(0, 800);
    await expectLockedAt(page, scrollY);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expectReleasedAt(page, scrollY);
});

test('stacked modals keep the page locked until the last one closes', async ({ page }) => {
    await gotoStory(page, 'organisms-modal--stacked');
    const opener = page.getByRole('button', { name: 'Open first dialog' });
    await opener.scrollIntoViewIfNeeded();
    const scrollY = await page.evaluate(() => window.scrollY);

    await opener.click();
    await page.getByRole('button', { name: 'Open second dialog' }).click();
    const second = page.getByRole('dialog', { name: 'Second dialog' });
    await expect(second).toBeVisible();
    await expectLockedAt(page, scrollY);

    // The outer dialog leaves first; the inner one still holds the lock.
    await second.getByRole('button', { name: 'Close the first dialog' }).click();
    await expect(page.getByRole('dialog', { name: 'First dialog' })).toHaveCount(0);
    await expectLockedAt(page, scrollY);

    await second.getByRole('button', { name: 'Close the second dialog' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expectReleasedAt(page, scrollY);
});

test('a modal unmounted while open gives its lock back', async ({ page }) => {
    await gotoStory(page, 'organisms-modal--stacked');
    const opener = page.getByRole('button', { name: 'Open first dialog' });
    await opener.scrollIntoViewIfNeeded();
    const scrollY = await page.evaluate(() => window.scrollY);

    await opener.click();
    await page.getByRole('button', { name: 'Open second dialog' }).click();
    const second = page.getByRole('dialog', { name: 'Second dialog' });

    // Unmounted without ever closing: the second dialog still holds the page.
    await second.getByRole('button', { name: 'Unmount the first dialog' }).click();
    await expect(page.getByRole('dialog', { name: 'First dialog' })).toHaveCount(0);
    await expectLockedAt(page, scrollY);

    // And the unmounted one's reference is gone, so the last close releases.
    await second.getByRole('button', { name: 'Close the second dialog' }).click();
    await expectReleasedAt(page, scrollY);
});

test('a drawer locks and restores the page scroll too', async ({ page }) => {
    await gotoStory(page, 'organisms-drawer--over-long-page');
    const opener = page.getByRole('button', { name: 'Open drawer' });
    await opener.scrollIntoViewIfNeeded();
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    await opener.click();
    await expect(page.getByRole('dialog', { name: 'Details' })).toBeVisible();
    await expectLockedAt(page, scrollY);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expectReleasedAt(page, scrollY);
});
