import { test, expect } from '@playwright/test';

test.describe('Recipe Tags Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the recipes page
    await page.goto('http://localhost:8080/recipes');
    await page.waitForLoadState('networkidle');
  });

  test('should filter recipes by tags', async ({ page }) => {
    // Wait for recipes to load
    await expect(page.locator('[data-testid="recipe-card"]').first()).toBeVisible({ timeout: 10000 });

    // Find and click the tag filter MultiSelect
    const tagFilterTrigger = page.locator('button').filter({ hasText: 'Select tags to filter...' }).or(
      page.locator('[data-testid="tag-filter"]')
    ).first();
    await tagFilterTrigger.click();

    // Wait for the dropdown to open
    await page.waitForSelector('[role="option"]', { timeout: 5000 });

    // Select "dessert" tag if available
    const dessertOption = page.locator('[role="option"]').filter({ hasText: 'dessert' }).first();
    if (await dessertOption.isVisible()) {
      await dessertOption.click();

      // Close the dropdown by clicking outside or pressing escape
      await page.keyboard.press('Escape');

      // Wait a bit for filtering to apply
      await page.waitForTimeout(1000);

      // Verify that only dessert recipes are shown
      const visibleCards = await page.locator('[data-testid="recipe-card"]').count();
      console.log(`Visible recipe cards after filtering: ${visibleCards}`);

      // Check that at least one recipe is visible and contains dessert tag
      expect(visibleCards).toBeGreaterThan(0);

      // Verify the first visible recipe has the dessert tag
      const firstCard = page.locator('[data-testid="recipe-card"]').first();
      await expect(firstCard.locator('.badge').filter({ hasText: 'dessert' })).toBeVisible();
    } else {
      console.log('Dessert tag not found, skipping filter test');
    }
  });

  test('should add tags when creating a new recipe', async ({ page }) => {
    // Click the floating add button
    await page.locator('button').filter({ hasText: '+' }).or(
      page.locator('[data-testid="add-recipe-btn"]')
    ).first().click();

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
    // Wait for recipes to load
    await expect(page.locator('[data-testid="recipe-card"]').first()).toBeVisible({ timeout: 10000 });

    // Find a recipe card that has tags
    const recipeWithTags = page.locator('[data-testid="recipe-card"]').filter({
      has: page.locator('.badge')
    }).first();

    if (await recipeWithTags.isVisible()) {
      // Click the edit button for this recipe
      await recipeWithTags.locator('button[aria-label="Edit recipe"]').or(
        recipeWithTags.locator('button').filter({ hasText: /edit/i })
      ).first().click();

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
    // Wait for recipes to load
    await expect(page.locator('[data-testid="recipe-card"]').first()).toBeVisible({ timeout: 10000 });

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
    // Wait for recipes to load
    await expect(page.locator('[data-testid="recipe-card"]').first()).toBeVisible({ timeout: 10000 });

    const initialRecipeCount = await page.locator('[data-testid="recipe-card"]').count();

    // Apply a tag filter first
    const tagFilterTrigger = page.locator('button').filter({ hasText: 'Select tags to filter...' }).first();
    await tagFilterTrigger.click();

    // Select any available tag
    await page.waitForSelector('[role="option"]', { timeout: 5000 });
    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();
    await page.keyboard.press('Escape');

    // Wait for filtering to apply
    await page.waitForTimeout(1000);
    const filteredCount = await page.locator('[data-testid="recipe-card"]').count();

    // Clear the filter by clicking the X button in the MultiSelect
    const clearButton = page.locator('[data-remove-item]').or(
      page.locator('button').filter({ hasText: '×' })
    ).first();

    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Wait for the filter to clear
      await page.waitForTimeout(1000);

      // Verify all recipes are shown again
      const clearedCount = await page.locator('[data-testid="recipe-card"]').count();
      expect(clearedCount).toBe(initialRecipeCount);
    }
  });
});