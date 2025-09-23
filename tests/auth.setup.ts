import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await page.waitForSelector('button:has-text("Sign In")', { timeout: 10000 });
  await page.click('button:has-text("Sign In")');

  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  await page.fill('input[type="email"]', 'testuser@email.com');
  await page.fill('input[type="password"]', '123456');

  await page.click('button[type="submit"]');

  await expect(page.getByRole('heading', { name: 'Meal Log' })).toBeVisible({ timeout: 10000 });

  await page.context().storageState({ path: authFile });
});