import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
  test('should load the main page with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Uzo Food Tracking');
    await expect(page.getByRole('heading', { name: 'Meal Log' })).toBeVisible();
  });

  test('should navigate to recipes page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Recipes' }).click();
    await expect(page).toHaveURL(/.*recipes/);
    await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
  });

  test('should navigate to inventory page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Inventory' }).click();
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.getByRole('heading', { name: 'Food Inventory' })).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
});