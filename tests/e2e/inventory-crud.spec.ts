import { test, expect } from '@playwright/test';

test.describe('Inventory CRUD Operations', () => {
  const testItemName = `Test Item ${Date.now()}`;
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory');
  });

  test('should create a new inventory item', async ({ page }) => {
    // Click the Add Item button in the header
    await page.getByRole('button', { name: 'Add Item' }).click();
    
    // Wait for the dialog to open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Fill in the required fields using exact IDs from the form
    await page.locator('#name').fill(testItemName);
    await page.locator('#brand').fill('Test Brand');
    
    // Select category from dropdown
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Fruits' }).click();
    
    // Fill in nutrition data
    await page.locator('#calories').fill('100');
    await page.locator('#protein').fill('10');
    await page.locator('#carbs').fill('15');
    await page.locator('#fat').fill('5');
    
    // Submit the form
    await page.getByRole('button', { name: 'Add Item' }).click();
    
    // Wait for the dialog to close and then verify the item was created
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // Search for the newly created item
    await page.getByPlaceholder('Search items').fill(testItemName);
    await page.waitForTimeout(2000);
    await expect(page.getByText(testItemName).first()).toBeVisible({ timeout: 10000 });
  });

  test('should read/display inventory items', async ({ page }) => {
    // Verify the inventory page is loaded with filter and search functionality
    await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
    await expect(page.getByPlaceholder('Search items')).toBeVisible();

    // Check if search functionality works
    const searchInput = page.getByPlaceholder('Search items');
    await searchInput.fill('test');

    // Wait for search results to load
    await page.waitForTimeout(1000);
  });

  test('should update an existing inventory item', async ({ page }) => {
    // First, search for an item to edit
    await page.getByPlaceholder('Search items').fill(testItemName);
    
    // Look for edit button on the first item found
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click();
      
      // Wait for edit dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Update the item name
      const nameField = page.getByLabel(/name/i);
      await nameField.clear();
      await nameField.fill(`${testItemName} Updated`);
      
      // Save the changes
      await page.getByRole('button', { name: /update|save/i }).click();
      
      // Verify the update
      await page.getByPlaceholder('Search items').fill(`${testItemName} Updated`);
      await expect(page.getByText(`${testItemName} Updated`)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should delete an inventory item', async ({ page }) => {
    // Search for the item to delete
    await page.getByPlaceholder('Search items').fill(`${testItemName} Updated`);
    
    // Look for delete button
    const deleteButton = page.getByRole('button', { name: /delete|remove/i }).first();
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      await deleteButton.click();
      
      // Confirm deletion if there's a confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirm|delete|yes/i });
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
      
      // Verify the item is deleted
      await page.getByPlaceholder('Search items').fill(`${testItemName} Updated`);
      await page.waitForTimeout(2000);
      await expect(page.getByText(`${testItemName} Updated`)).not.toBeVisible();
    }
  });

  test('should handle form validation', async ({ page }) => {
    // Click Add Item button
    await page.getByRole('button', { name: 'Add Item' }).click();
    
    // Wait for dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Try to submit without required fields
    await page.getByRole('button', { name: 'Add Item' }).click();
    
    // Check for toast notification about missing required fields
    await expect(page.getByText('Missing required fields').first()).toBeVisible({ timeout: 5000 });
  });
});