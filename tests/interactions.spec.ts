import { test, expect, type Page } from '@playwright/test';

// Interaction tests for the atoms that carry behaviour (not just markup).
async function gotoStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect
        .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
        .toBeGreaterThan(0);
}

test('button is focusable and clickable', async ({ page }) => {
    await gotoStory(page, 'atoms-button--primary');
    const button = page.getByRole('button', { name: 'Button' });
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toBeEnabled();
});

test('toaster shows then auto-dismisses a toast', async ({ page }) => {
    await gotoStory(page, 'atoms-feedback--toasts');
    await page.getByRole('button', { name: 'Success' }).click();
    const toast = page.getByText('Instance saved.');
    await expect(toast).toBeVisible();
    // duration is 3500ms for success; it should clear on its own.
    await expect(toast).toBeHidden({ timeout: 6000 });
});

test('toaster can be dismissed manually', async ({ page }) => {
    await gotoStory(page, 'atoms-feedback--toasts');
    await page.getByRole('button', { name: 'Error' }).click();
    await expect(page.getByText('Could not reach DocuWare.')).toBeVisible();
    await page.getByRole('button', { name: 'Dismiss' }).click();
    await expect(page.getByText('Could not reach DocuWare.')).toBeHidden();
});

test('checkbox toggles', async ({ page }) => {
    await gotoStory(page, 'atoms-form--controls');
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
});

test('select changes value', async ({ page }) => {
    await gotoStory(page, 'atoms-form--controls');
    const select = page.locator('select#env');
    await expect(select).toHaveValue('prod');
    await select.selectOption('staging');
    await expect(select).toHaveValue('staging');
});

test('invalid field exposes aria-invalid + error message', async ({ page }) => {
    await gotoStory(page, 'atoms-form--controls');
    await expect(page.locator('input#url')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('The URL is required.')).toBeVisible();
});

test('copy button writes to the clipboard and toasts', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoStory(page, 'atoms-misc--code');
    await page.getByRole('button', { name: 'Copy to clipboard' }).first().click();
    await expect(page.getByText('Copied to clipboard')).toBeVisible();
});

test('dropdown discloses its menu', async ({ page }) => {
    await gotoStory(page, 'atoms-misc--dropdowns');
    const menuItem = page.getByRole('menuitem', { name: 'Settings' });
    await expect(menuItem).toBeHidden();
    await page.locator('summary').click();
    await expect(menuItem).toBeVisible();
});
