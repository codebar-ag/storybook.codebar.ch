import { defineConfig, devices } from '@playwright/test';

// Component tests run against the built static Storybook (storybook-static).
// Build it first: `npm run build-storybook`. The webServer below serves it.
const PORT = 6006;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: 'on-first-retry',
        permissions: ['clipboard-read', 'clipboard-write'],
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: `npx http-server storybook-static -p ${PORT} -s -c-1`,
        url: `http://127.0.0.1:${PORT}/iframe.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
