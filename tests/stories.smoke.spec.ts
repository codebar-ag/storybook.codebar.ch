import { test, expect } from '@playwright/test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

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

// Coverage guard: every component must be reachable from at least one story
// file (directly imported, or imported by a component that is) — otherwise
// the render-smoke loop silently stops covering it.
test('every component is exercised by a story', () => {
    const srcDir = fileURLToPath(new URL('../src', import.meta.url));

    function walk(dir: string): string[] {
        return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
            const path = resolve(dir, entry.name);
            return entry.isDirectory() ? walk(path) : [path];
        });
    }

    const files = walk(srcDir);
    const vueFiles = files.filter((f) => f.endsWith('.vue'));
    const storyFiles = files.filter((f) => f.endsWith('.stories.ts'));

    function importsOf(file: string): string[] {
        const source = readFileSync(file, 'utf-8');
        return [...source.matchAll(/from\s+'([^']+\.vue)'/g)].map((m) =>
            resolve(dirname(file), m[1]),
        );
    }

    const reachable = new Set<string>();
    const queue = storyFiles.flatMap(importsOf);
    while (queue.length > 0) {
        const file = queue.pop()!;
        if (reachable.has(file)) {
            continue;
        }
        reachable.add(file);
        queue.push(...importsOf(file));
    }

    const uncovered = vueFiles.filter((f) => !reachable.has(f));
    expect(uncovered, `components with no story coverage:\n${uncovered.join('\n')}`).toEqual([]);
});

for (const story of stories) {
    test(`renders: ${story.title} — ${story.name}`, async ({ page }) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(String(err)));
        // Storybook does NOT surface play-function exceptions as page errors or
        // via the error overlay in story view — it logs them with console.error
        // (verified against 9.1.20). Collecting console errors is what makes
        // this suite an interaction-test runner.
        page.on('console', (msg) => {
            if (msg.type() === 'error') pageErrors.push(`console.error: ${msg.text()}`);
        });

        await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);

        const root = page.locator('#storybook-root');
        await expect(root).toBeAttached();
        // "Rendered" = the story mounted at least one element. (Not text — many
        // atoms are icon-/input-only, which Playwright's toBeEmpty treats as empty.)
        await expect
            .poll(() => root.evaluate((el) => el.childElementCount), { timeout: 5000 })
            .toBeGreaterThan(0);

        // Wait for the full story lifecycle — including any `play` function — so
        // this suite doubles as the interaction-test runner: a throwing play
        // function ends in phase "errored" and fails CI here.
        const readPhase = () =>
            page.evaluate(() => {
                const preview = (window as never as Record<string, { currentRender?: { phase?: string } }>)[
                    '__STORYBOOK_PREVIEW__'
                ];
                return preview?.currentRender?.phase ?? null;
            });
        await expect.poll(readPhase, { timeout: 15000 }).toMatch(/^(completed|finished|errored|aborted)$/);
        const phase = await readPhase();
        expect(phase, `story ended in phase "${phase}"`).toMatch(/^(completed|finished)$/);

        // Belt and braces: Storybook flags render/play exceptions on the body.
        await expect(page.locator('body')).not.toHaveClass(/sb-show-errordisplay/);

        expect(pageErrors, pageErrors.join('\n')).toEqual([]);
    });
}
