import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Enumerate every built story and assert it mounts without throwing. This gives
// each flows atom (every component appears in at least one story) a render test.
const indexPath = fileURLToPath(new URL('../storybook-static/index.json', import.meta.url));

if (!existsSync(indexPath)) {
    throw new Error(
        'storybook-static/index.json not found — run `npm run build-storybook` before the Playwright tests.',
    );
}

interface StoryEntry {
    id: string;
    title: string;
    name: string;
    type: string;
}

const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as {
    entries: Record<string, StoryEntry>;
};

const stories = Object.values(index.entries).filter((e) => e.type === 'story');

test('storybook exposes stories', () => {
    expect(stories.length).toBeGreaterThan(0);
});

for (const story of stories) {
    test(`renders: ${story.title} — ${story.name}`, async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(String(err)));

        await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

        const root = page.locator('#storybook-root');
        await expect(root).toBeAttached();
        // "Rendered" = the story mounted at least one element. (Not text — many
        // atoms are icon-/input-only, which Playwright's toBeEmpty treats as empty.)
        await expect
            .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
            .toBeGreaterThan(0);

        expect(pageErrors, pageErrors.join('\n')).toEqual([]);
    });
}
