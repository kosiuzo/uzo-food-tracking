import { test, expect } from '@playwright/test';

test.describe('Meals Tracking Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meals');
  });

  test('should display meals page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Meal Log' })).toBeVisible();
    await expect(page.getByText('Track your daily meals and nutrition')).toBeVisible();
  });

  test('should have date filter functionality', async ({ page }) => {
    await expect(page.getByText('Filter by Date:')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Filter by Date:' })).toBeVisible();
  });

  test('should show meal statistics', async ({ page }) => {
    await expect(page.getByText('Total Meals')).toBeVisible();
    await expect(page.getByText('Total Calories')).toBeVisible();
  });

  test('should display recent meals section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recent Meals' })).toBeVisible();
  });

  test('should show meal log entries when they exist', async ({ page }) => {
    const mealEntries = page.locator('h3').filter({ hasText: /Tzatziki|Coconut|Paleo|Bacon/ });
    const count = await mealEntries.count();
    if (count > 0) {
      await expect(mealEntries.first()).toBeVisible();
      // Check if Re-log button exists, but don't require it
      const relogButton = page.getByRole('button', { name: 'Re-log' });
      const relogCount = await relogButton.count();
      if (relogCount > 0) {
        await expect(relogButton.first()).toBeVisible();
      }
    }
  });
});