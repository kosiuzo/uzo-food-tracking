import { test, expect } from '@playwright/test';

test.describe('Add Item Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for React to fully render
    await page.waitForTimeout(2000);
  });

  test('should be able to add a new food item', async ({ page }) => {
    // Look for the floating add button with Plus icon
    const addButton = page.locator('button:has([class*="h-6 w-6"]), button:has([class*="Plus"]), button[class*="fixed"]').first();
    
    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'test-results/before-add-button-click.png' });
    
    if (await addButton.isVisible()) {
      console.log('Found add button, clicking it...');
      
      // Click the add button
      await addButton.click();
      
      // Wait for the dialog to appear
      await page.waitForSelector('[role="dialog"], .dialog, .modal', { timeout: 5000 });
      
      // Take a screenshot of the dialog
      await page.screenshot({ path: 'test-results/dialog-opened.png' });
      
      // Fill in the form fields
      await page.fill('input[placeholder*="name"], input[name="name"], #name', 'Test Chicken Breast');
      
      // Handle the category Select component properly - be more specific
      const categoryCombobox = page.locator('[role="dialog"] button[role="combobox"]:has-text("Select category")');
      await categoryCombobox.click();
      await page.click('div[role="option"]:has-text("Proteins")');
      
      await page.fill('input[placeholder*="price"], input[name="price"], #price', '12.99');
      await page.fill('input[placeholder*="serving size"], input[name="serving_size"], #serving_size', '150');
      
      // Fill in nutrition info
      await page.fill('input[placeholder*="calories"], input[name="calories"], #calories', '165');
      await page.fill('input[placeholder*="protein"], input[name="protein"], #protein', '31');
      await page.fill('input[placeholder*="carbs"], input[name="carbs"], #carbs', '0');
      await page.fill('input[placeholder*="fat"], input[name="fat"], #fat', '3.6');
      
      // Submit the form
      const submitButton = page.locator('button:has-text("Add Item"), button:has-text("Save"), button[type="submit"]').first();
      await submitButton.click();
      
      // Wait for the dialog to close
      await page.waitForSelector('[role="dialog"], .dialog, .modal', { state: 'hidden', timeout: 5000 });
      
      // Wait a bit for the item to be processed
      await page.waitForTimeout(1000);
      
      // Verify the item was added by looking for it in the item list
      // Look for the item card with the name
      const itemCard = page.locator('h3:has-text("Test Chicken Breast")');
      await expect(itemCard).toBeVisible();
      
      console.log('Successfully added Test Chicken Breast to inventory!');
    } else {
      // If no add button found, let's see what's on the page
      console.log('No add button found. Looking for any buttons...');
      
      // Look for any buttons on the page
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} buttons on the page`);
      
      for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i);
        const text = await button.textContent();
        const className = await button.getAttribute('class');
        console.log(`Button ${i}: text="${text}", class="${className}"`);
      }
      
      // Check for console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Take a screenshot to see what's on the page
      await page.screenshot({ path: 'test-results/no-add-button.png' });
      
      // This test should fail if we can't find the add button
      throw new Error(`Could not find add button on the page. Found ${buttonCount} buttons. Console errors: ${consoleErrors.join(', ')}`);
    }
  });

  test('should show add item dialog when add button is clicked', async ({ page }) => {
    // Look for the floating add button with Plus icon
    const addButton = page.locator('button:has([class*="h-6 w-6"]), button:has([class*="Plus"]), button[class*="fixed"]').first();
    
    if (await addButton.isVisible()) {
      console.log('Found add button for dialog test, clicking it...');
      
      // Click the add button
      await addButton.click();
      
      // Wait for the dialog to appear
      const dialog = page.locator('[role="dialog"], .dialog, .modal');
      await expect(dialog).toBeVisible();
      
      // Take a screenshot of the dialog
      await page.screenshot({ path: 'test-results/dialog-test.png' });
      
      // Verify dialog content - the title should be "Add New Item"
      await expect(page.locator('text=Add New Item')).toBeVisible();
      
      // Check for form fields
      await expect(page.locator('input[placeholder*="name"], input[name="name"], #name')).toBeVisible();
      
      // Check for the category combobox specifically within the dialog
      const dialogCategoryCombobox = page.locator('[role="dialog"] button[role="combobox"]:has-text("Select category")');
      await expect(dialogCategoryCombobox).toBeVisible();
      
      // Close the dialog
      const closeButton = page.locator('button:has-text("Cancel"), button[aria-label="Close"], [data-testid="close"]').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    } else {
      // Take a screenshot and fail the test
      await page.screenshot({ path: 'test-results/no-add-button-dialog-test.png' });
      throw new Error('Could not find add button for dialog test');
    }
  });
});
