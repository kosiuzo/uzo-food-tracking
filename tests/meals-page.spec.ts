import { test, expect } from '@playwright/test';

test.describe('Meals Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the meals page
    await page.goto('/meals');
  });

  test('should load and display content', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Check that the main content is visible
    await expect(page.locator('h1:has-text("Meal Log")')).toBeVisible();
    await expect(page.locator('text=Track your daily meals and nutrition')).toBeVisible();
    
    // Check that stats cards are visible
    await expect(page.locator('text=Total Meals')).toBeVisible();
    await expect(page.locator('text=Total Calories')).toBeVisible();
    await expect(page.locator('text=Total Cost')).toBeVisible();
    
    // Check that date filter is visible
    await expect(page.locator('text=Filter by Date:')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    
    // Check that quick date navigation buttons are visible
    await expect(page.locator('button:has-text("Today")')).toBeVisible();
    await expect(page.locator('button:has-text("Yesterday")')).toBeVisible();
    await expect(page.locator('button:has-text("This Week")')).toBeVisible();
    await expect(page.locator('button:has-text("Last Week")')).toBeVisible();
    
    // Check that meals section is visible
    await expect(page.locator('h2:has-text("Recent Meals")')).toBeVisible();
  });

  test('should display demo banner when using mock data', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Check for demo banner (should appear when using mock data)
    const demoBanner = page.locator('text=Demo Mode:');
    await expect(demoBanner).toBeVisible({ timeout: 5000 });
  });

  test('should filter meals by date', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Click on "Today" button
    await page.click('button:has-text("Today")');
    
    // Check that the date filter is set
    const dateInput = page.locator('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    await expect(dateInput).toHaveValue(today);
    
    // Check that the section header updates - use a more flexible selector
    await expect(page.locator('h2').filter({ hasText: 'Meals on' })).toBeVisible();
  });

  test('should show add meal button', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Check that the floating add button is visible
    const addButton = page.locator('button[class*="fixed bottom-20 right-4"]');
    await expect(addButton).toBeVisible();
  });

  test('should display meal logs', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Wait for meal logs to appear (mock data should load)
    await page.waitForSelector('[class*="card"]', { timeout: 10000 });
    
    // Check that at least one meal log is displayed
    const mealCards = page.locator('[class*="card"]');
    await expect(mealCards.first()).toBeVisible();
    
    // Check that meal information is displayed
    await expect(page.locator('text=Breakfast Smoothie')).toBeVisible({ timeout: 5000 });
  });

  test('should handle date filter changes', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Click on "This Week" button
    await page.click('button:has-text("This Week")');
    
    // Check that the date filter is set to a date from 7 days ago
    const dateInput = page.locator('input[type="date"]');
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const expectedDate = thisWeek.toISOString().split('T')[0];
    await expect(dateInput).toHaveValue(expectedDate);
    
    // Clear the filter
    await page.click('button:has-text("Clear Filter")');
    
    // Check that the filter is cleared
    await expect(dateInput).toHaveValue('');
    
    // Check that the section header is back to "Recent Meals"
    await expect(page.locator('h2:has-text("Recent Meals")')).toBeVisible();
  });
});
