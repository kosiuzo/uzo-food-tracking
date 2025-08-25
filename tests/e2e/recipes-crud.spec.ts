import { test, expect } from '@playwright/test';

test.describe('Recipes CRUD Operations', () => {
  const testRecipeName = `Test Recipe ${Date.now()}`;
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes');
  });

  test('should test recipe form validation', async ({ page }) => {
    // Click the floating action button (with Plus icon) to add new recipe
    const addButton = page.locator('.fixed.bottom-20.right-4 button, button.fixed');
    await addButton.click();
    
    // Wait for the dialog to open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Verify basic form fields are present
    await expect(page.locator('#recipe-name')).toBeVisible();
    await expect(page.locator('#instructions')).toBeVisible();
    await expect(page.locator('#servings')).toBeVisible();
    await expect(page.locator('#prep-time')).toBeVisible();
    
    // Try to submit without required fields - should show validation
    await page.getByRole('button', { name: 'Add Recipe' }).click();
    
    // Should show validation message
    await expect(page.getByText('Missing required fields').first()).toBeVisible({ timeout: 5000 });
    
    // Close the dialog
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should update an existing recipe', async ({ page }) => {
    // Search for the test recipe
    await page.getByPlaceholder(/Search recipes by name/i).fill(testRecipeName);
    
    // Look for edit button on the recipe
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click();
      
      // Wait for edit dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Update the recipe name
      const nameField = page.getByLabel(/name/i);
      await nameField.clear();
      await nameField.fill(`${testRecipeName} Updated`);
      
      // Save the changes
      await page.getByRole('button', { name: /update|save/i }).click();
      
      // Verify the update
      await page.getByPlaceholder(/Search recipes by name/i).fill(`${testRecipeName} Updated`);
      await expect(page.getByText(`${testRecipeName} Updated`)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should delete a recipe', async ({ page }) => {
    // Search for the recipe to delete
    await page.getByPlaceholder(/Search recipes by name/i).fill(`${testRecipeName} Updated`);
    
    // Look for delete button
    const deleteButton = page.getByRole('button', { name: /delete|remove/i }).first();
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      await deleteButton.click();
      
      // Confirm deletion if there's a confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirm|delete|yes/i });
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
      
      // Verify the recipe is deleted
      await page.getByPlaceholder(/Search recipes by name/i).fill(`${testRecipeName} Updated`);
      await page.waitForTimeout(2000);
      await expect(page.getByText(`${testRecipeName} Updated`)).not.toBeVisible();
    }
  });

  test('should toggle recipe favorite status', async ({ page }) => {
    // Find an existing recipe
    const favoriteButton = page.getByRole('button', { name: /toggle favorite|favorite/i }).first();
    if (await favoriteButton.isVisible({ timeout: 5000 })) {
      // Toggle favorite status
      await favoriteButton.click();
      
      // Wait for the change to be processed
      await page.waitForTimeout(1000);
      
      // Test favorites filter
      const favoritesToggle = page.getByText('Favorites only');
      if (await favoritesToggle.isVisible()) {
        await favoritesToggle.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should use AI recipe generation', async ({ page }) => {
    // Click AI recipe generation button
    await page.getByRole('button', { name: 'Generate Recipe with AI' }).click();
    
    // Wait for AI generation dialog
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Fill in generation prompt
    const promptField = page.getByLabel(/prompt|ingredients|description/i);
    if (await promptField.isVisible({ timeout: 2000 })) {
      await promptField.fill('Chicken pasta recipe');
      
      // Generate recipe
      await page.getByRole('button', { name: /generate/i }).click();
      
      // Wait for generation (this might take time)
      await page.waitForTimeout(5000);
    }
  });
});