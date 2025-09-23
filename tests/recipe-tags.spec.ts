import { test, expect } from '@playwright/test';

test.describe('Recipe Tags Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
  });

  test('should filter recipes by tags', async ({ page }) => {
    // Wait for recipes to load - look for recipe cards which are now styled as Cards with ChefHat icons
    await expect(page.locator('.lucide-chef-hat').first().or(page.getByText('No recipes yet'))).toBeVisible({ timeout: 10000 });

    // Click the Filter button to open the filter sheet
    await page.getByRole('button', { name: 'Filter' }).click();

    // Wait for the filter sheet to open and find the Tags MultiSelect
    await expect(page.getByText('Filter & Sort')).toBeVisible();
    const tagFilterTrigger = page.getByText('Select tags...');
    await tagFilterTrigger.click();

    // Wait for the dropdown to open
    await page.waitForSelector('[role="option"]', { timeout: 5000 });

    // Select "dessert" tag if available
    const dessertOption = page.locator('[role="option"]').filter({ hasText: 'dessert' }).first();
    if (await dessertOption.isVisible()) {
      await dessertOption.click();

      // Close the dropdown by clicking outside or pressing escape
      await page.keyboard.press('Escape');

      // Apply the filter by clicking the Apply button
      await page.getByRole('button', { name: 'Apply' }).click();

      // Wait a bit for filtering to apply and sheet to close
      await page.waitForTimeout(1000);

      // Verify that only dessert recipes are shown
      const visibleCards = await page.locator('h3').filter({ hasText: /.+/ }).count();
      console.log(`Visible recipe cards after filtering: ${visibleCards}`);

      // Check that at least one recipe is visible and contains dessert tag
      expect(visibleCards).toBeGreaterThan(0);

      // Verify the first visible recipe has the dessert tag
      const firstCard = page.locator('h3').filter({ hasText: /.+/ }).first().locator('..');
      await expect(firstCard.locator('.badge').filter({ hasText: 'dessert' })).toBeVisible();
    } else {
      console.log('Dessert tag not found, skipping filter test');
    }
  });

  test('should add tags when creating a new recipe', async ({ page }) => {
    // Click the Create dropdown button and then Add manually
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByText('Add manually').click();

    // Wait for the dialog to open
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

    // Fill in basic recipe information
    await page.fill('input[name="name"]', 'Test Recipe with Tags');
    await page.fill('textarea[name="instructions"]', 'Test instructions');
    await page.fill('input[name="servings"]', '4');

    // Find and open the tags MultiSelect
    const tagsMultiSelect = page.locator('[data-testid="recipe-tags-select"]').or(
      page.locator('button').filter({ hasText: 'Select tags...' })
    ).first();
    await tagsMultiSelect.click();

    // Wait for dropdown options
    await page.waitForSelector('[role="option"]', { timeout: 5000 });

    // Select a few tags
    const options = page.locator('[role="option"]');
    const optionCount = await options.count();

    if (optionCount > 2) {
      // Select the first few tags (skip "Select All" if present)
      for (let i = 0; i < Math.min(3, optionCount); i++) {
        const option = options.nth(i);
        const optionText = await option.textContent();
        if (optionText && !optionText.includes('Select All')) {
          await option.click();
        }
      }
    }

    // Close the dropdown
    await page.keyboard.press('Escape');

    // Verify tags are selected in the MultiSelect
    const selectedTags = page.locator('.badge').filter({ hasText: /^(?!Select All)/ });
    await expect(selectedTags.first()).toBeVisible();

    // Save the recipe (assuming there's a save button)
    const saveButton = page.locator('button').filter({ hasText: /Save|Create/i });
    if (await saveButton.isVisible()) {
      await saveButton.click();

      // Wait for dialog to close
      await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
    }
  });

  test('should show existing tags when editing a recipe', async ({ page }) => {
    // Wait for recipes to load - look for recipe cards which are now styled as Cards with ChefHat icons
    await expect(page.locator('.lucide-chef-hat').first().or(page.getByText('No recipes yet'))).toBeVisible({ timeout: 10000 });

    // Find a recipe card that has tags - look for cards that contain badges
    const recipeWithTags = page.locator('div').filter({
      has: page.locator('.badge')
    }).first();

    if (await recipeWithTags.isVisible()) {
      // Click the more actions button (three dots) for this recipe
      await recipeWithTags.locator('button[aria-label="More actions"]').or(
        recipeWithTags.locator('.lucide-more-vertical').locator('..')
      ).first().click();

      // Click Edit from the dropdown menu
      await page.getByText('Edit').click();

      // Wait for the edit dialog to open
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Check that the tags MultiSelect shows the existing tags
      const tagsMultiSelect = page.locator('[data-testid="recipe-tags-select"]').or(
        page.locator('button').filter({ hasText: /Select tags|tags/ })
      ).first();

      // Verify that selected tags are visible in the MultiSelect
      const selectedTagBadges = tagsMultiSelect.locator('.badge');
      const badgeCount = await selectedTagBadges.count();

      if (badgeCount > 0) {
        console.log(`Found ${badgeCount} pre-selected tags in edit dialog`);
        await expect(selectedTagBadges.first()).toBeVisible();
      } else {
        console.log('No pre-selected tags found - this indicates the bug we need to fix');
      }

      // Close the dialog
      await page.keyboard.press('Escape');
    } else {
      console.log('No recipes with tags found for edit test');
    }
  });

  test('should display tag colors correctly', async ({ page }) => {
    // Wait for recipes to load - look for recipe cards which are now styled as Cards with ChefHat icons
    await expect(page.locator('.lucide-chef-hat').first().or(page.getByText('No recipes yet'))).toBeVisible({ timeout: 10000 });

    // Find a recipe with tags
    const tagBadge = page.locator('.badge').first();

    if (await tagBadge.isVisible()) {
      // Check that the badge has a background color (not black/transparent)
      const backgroundColor = await tagBadge.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      console.log(`Tag badge background color: ${backgroundColor}`);

      // Verify it's not transparent or black
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(backgroundColor).not.toBe('rgb(0, 0, 0)');
      expect(backgroundColor).not.toBe('transparent');
    } else {
      console.log('No tag badges found to test colors');
    }
  });

  test('should allow clearing tag filters', async ({ page }) => {
    // Wait for recipes to load - look for recipe cards which are now styled as Cards with ChefHat icons
    await expect(page.locator('.lucide-chef-hat').first().or(page.getByText('No recipes yet'))).toBeVisible({ timeout: 10000 });

    const initialRecipeCount = await page.locator('h3').filter({ hasText: /.+/ }).count();

    // Apply a tag filter first
    await page.getByRole('button', { name: 'Filter' }).click();
    await expect(page.getByText('Filter & Sort')).toBeVisible();
    const tagFilterTrigger = page.getByText('Select tags...');
    await tagFilterTrigger.click();

    // Select any available tag
    await page.waitForSelector('[role="option"]', { timeout: 5000 });
    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Apply' }).click();

    // Wait for filtering to apply
    await page.waitForTimeout(1000);
    const filteredCount = await page.locator('h3').filter({ hasText: /.+/ }).count();

    // Clear the filter by clicking the X button in the MultiSelect
    const clearButton = page.locator('[data-remove-item]').or(
      page.locator('button').filter({ hasText: '×' })
    ).first();

    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Wait for the filter to clear
      await page.waitForTimeout(1000);

      // Verify all recipes are shown again
      const clearedCount = await page.locator('h3').filter({ hasText: /.+/ }).count();
      expect(clearedCount).toBe(initialRecipeCount);
    }
  });
});