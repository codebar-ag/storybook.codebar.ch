import { test, expect } from '@playwright/test';

// A SidebarItem without href is an action. Rendered through a string
// `:is="'button'"` it resolved to the globally registered kit Button (as in
// consuming apps, and in .storybook/preview.ts), drawing a primary button.
test('an action item renders a plain sidebar row, not the kit Button', async ({ page }) => {
    await page.goto('/iframe.html?id=layouts-appshell--default&viewMode=story');
    const signOut = page.getByRole('button', { name: 'Sign out' });
    await expect(signOut).toBeVisible();

    const look = await signOut.evaluate((el) => ({
        tag: el.tagName,
        type: el.getAttribute('type'),
        background: getComputedStyle(el).backgroundColor,
        rowClass: el.className.includes('rounded-control') && el.className.includes('text-muted'),
    }));

    expect(look.tag).toBe('BUTTON');
    expect(look.type).toBe('button');
    expect(look.rowClass).toBe(true);
    expect(look.background).toBe('rgba(0, 0, 0, 0)');
});
