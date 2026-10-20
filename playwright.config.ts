import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // 🔥 زيادة الـ timeout لـ Dynamics 365 (بطيء جداً)
  timeout: 50000, // 3 دقائق بدلاً من 30 ثانية
  expect: { timeout: 20000 },

  fullyParallel: false,
  workers: 1,

  reporter: 'html',

  use: {
    baseURL: 'https://modon.crm.dynamics.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: undefined,
});
