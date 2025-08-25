import { test, expect } from '@playwright/test';

test.describe('Recipes Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes');
  });

  test('should display recipes page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
    await expect(page.getByText('Manage your recipes and favorites')).toBeVisible();
  });

  test('should show recipe statistics', async ({ page }) => {
    await expect(page.getByText('Total Recipes')).toBeVisible();
    await expect(page.getByText('Favorites', { exact: true })).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await expect(page.getByPlaceholder(/Search recipes by name/)).toBeVisible();
  });

  test('should have filter options', async ({ page }) => {
    await expect(page.getByText('Filter by tags:')).toBeVisible();
    await expect(page.getByText('Select tags to filter...')).toBeVisible();
    await expect(page.getByText('Favorites only')).toBeVisible();
  });

  test('should show AI recipe generation button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Generate Recipe with AI' })).toBeVisible();
  });

  test('should display recipe cards when recipes exist', async ({ page }) => {
    const recipeCards = page.locator('[data-testid="recipe-card"], h3');
    const count = await recipeCards.count();
    if (count > 0) {
      await expect(recipeCards.first()).toBeVisible();
    }
  });
});