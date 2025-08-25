import { test, expect } from '@playwright/test';

test.describe('Inventory Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display inventory page elements', async ({ page }) => {
    await expect(page.getByText('In Stock').first()).toBeVisible();
    await expect(page.getByText('Out of Stock').first()).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await expect(page.getByPlaceholder(/Search items by name/)).toBeVisible();
  });

  test('should have filter options', async ({ page }) => {
    await expect(page.getByText('All Categories')).toBeVisible();
    await expect(page.getByText('All Items')).toBeVisible();
    await expect(page.getByText('All Ratings')).toBeVisible();
  });

  test('should show floating action button for adding items', async ({ page }) => {
    const floatingButton = page.locator('button').last();
    await expect(floatingButton).toBeVisible();
  });

  test('should display appropriate content for inventory state', async ({ page }) => {
    const noItemsText = page.getByText('No items found');
    const inventoryItems = page.locator('[data-testid="inventory-item"]');
    
    // Either we have "No items found" or we have inventory items
    try {
      await expect(noItemsText).toBeVisible({ timeout: 2000 });
    } catch {
      // If no "No items found" text, there should be inventory content
      const hasItems = await inventoryItems.count() > 0;
      const hasStockCounts = await page.getByText('In Stock').first().isVisible();
      expect(hasItems || hasStockCounts).toBeTruthy();
    }
  });
});