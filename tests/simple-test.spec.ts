import { test, expect } from '@playwright/test';

test('should load the main page', async ({ page }) => {
  // Navigate to the main page
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the page title is visible
  await expect(page.locator('h1')).toBeVisible();
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/main-page.png' });
});

test('should navigate to meals page', async ({ page }) => {
  // Navigate to the meals page
  await page.goto('/meals');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the meals page header is visible
  await expect(page.locator('h1:has-text("Meal Log")')).toBeVisible();
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/meals-page.png' });
});
