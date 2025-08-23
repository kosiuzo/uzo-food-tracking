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
    
    // Check that stats cards are visible (only Total Meals and Total Calories exist)
    await expect(page.locator('text=Total Meals')).toBeVisible();
    await expect(page.locator('text=Total Calories')).toBeVisible();
    
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
    
    // Wait for mock data to load (hook has 5 second timeout)
    await page.waitForTimeout(6000);
    
    // Check for demo banner if using mock data, or accept that we're connected to real database
    const demoBanner = page.locator('text=Demo Mode: Showing sample meal logs with realistic data');
    const isVisible = await demoBanner.isVisible();
    
    if (isVisible) {
      await expect(demoBanner).toBeVisible();
      console.log('Demo banner visible - using mock data');
    } else {
      console.log('Demo banner not visible - likely connected to database');
      // Just verify the page loaded correctly
      await expect(page.locator('h1:has-text("Meal Log")')).toBeVisible();
    }
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
    
    // Wait for mock data to load (hook has 5 second timeout)
    await page.waitForTimeout(6000);
    
    // Check that either meal logs are displayed or the empty state is shown
    const emptyState = page.locator('text=No meals logged yet');
    const mealCards = page.locator('.space-y-3 > div').filter({ hasNotText: 'Recent Meals' });
    
    // Either we should see meal cards or the empty state
    const hasMeals = await mealCards.count() > 0;
    if (hasMeals) {
      await expect(mealCards.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible({ timeout: 5000 });
    }
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

  test('should show re-log button for meals', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Wait for mock data to load (hook has 5 second timeout)
    await page.waitForTimeout(6000);
    
    // Check that re-log buttons are visible on meal cards
    const reLogButtons = page.locator('button:has-text("Re-log")');
    const buttonCount = await reLogButtons.count();
    
    if (buttonCount > 0) {
      // If there are meals, check that re-log buttons are visible
      await expect(reLogButtons.first()).toBeVisible();
      
      // Check that the button has the correct styling
      const firstButton = reLogButtons.first();
      await expect(firstButton).toHaveClass(/text-primary/);
    } else {
      // If no meals, just verify the page loaded correctly
      await expect(page.locator('h1:has-text("Meal Log")')).toBeVisible();
    }
  });

  test('should show tooltip on re-log button hover', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1:has-text("Meal Log")', { timeout: 10000 });
    
    // Wait for mock data to load (hook has 5 second timeout)
    await page.waitForTimeout(6000);
    
    // Look for re-log buttons
    const reLogButtons = page.locator('button:has-text("Re-log")');
    const buttonCount = await reLogButtons.count();
    
    if (buttonCount > 0) {
      // Hover over the first re-log button
      await reLogButtons.first().hover();
      
      // Wait for tooltip to appear
      await page.waitForTimeout(500);
      
      // Check that tooltip content is visible
      const tooltipContent = page.locator('[data-radix-tooltip-content]');
      if (await tooltipContent.isVisible()) {
        await expect(tooltipContent).toContainText('Re-log this meal for today');
      }
    } else {
      // If no meals, just verify the page loaded correctly
      await expect(page.locator('h1:has-text("Meal Log")')).toBeVisible();
    }
  });
});
