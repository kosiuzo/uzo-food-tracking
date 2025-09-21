import { test, expect } from '@playwright/test';

test.describe('Basic Navigation Tests', () => {
  test('should load the main page with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Uzo Food Tracking');
    // The main page now shows the inventory page with filter and add item buttons
    await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Item' })).toBeVisible();
  });

  test('should navigate to recipes page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Recipes' }).click();
    await expect(page).toHaveURL(/.*recipes/);
    await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
  });

  test('should navigate to meals page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Log' }).click();
    await expect(page).toHaveURL(/.*meals/);
    await expect(page.getByRole('heading', { name: 'Meal Log' })).toBeVisible();
  });

  test('should navigate to planner page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Planner' }).click();
    await expect(page).toHaveURL(/.*planner/);
  });

  test('should have working search input', async ({ page }) => {
    await page.goto('/');
    // The main page now has a search input for inventory items
    await expect(page.getByPlaceholder('Search items')).toBeVisible();
  });
});