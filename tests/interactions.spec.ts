import { test, expect, type Page } from '@playwright/test';

// Only interactions that CAN'T live in a story play function remain here:
//  - clipboard access needs a Playwright permission grant
//  - the toast auto-dismiss test depends on real multi-second timing
// Everything else (keyboard nav, focus traps, form control behavior) runs as
// play functions executed by the smoke suite.
async function gotoStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect
        .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
        .toBeGreaterThan(0);
}

test('toaster auto-dismisses a toast', async ({ page }) => {
    await gotoStory(page, 'organisms-toaster--auto-dismiss');
    await page.getByRole('button', { name: 'Success' }).click();
    const toast = page.getByText('Instance saved.');
    await expect(toast).toBeVisible();
    // duration is 3500ms for success; it should clear on its own.
    await expect(toast).toBeHidden({ timeout: 6000 });
});

test('copy button writes to the clipboard and toasts', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoStory(page, 'molecules-copybutton--default');
    await page.getByRole('button', { name: 'Copy to clipboard' }).first().click();
    await expect(page.getByText('Copied to clipboard').first()).toBeVisible();
});

test('a copyable code editor copies the document it displays', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoStory(page, 'organisms-codeeditor--copyable');
    await expect(page.locator('.cm-content')).toBeVisible();
    await page.getByRole('button', { name: 'Copy to clipboard' }).click();

    // Only the clipboard write is asserted here — the story renders no Toaster,
    // and the toast itself is already covered by the CopyButton test above.
    // The pretty-printed document, not whatever shape the caller passed in.
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe('{\n  "vendor": "string",\n  "invoice_number": "string"\n}');
});
