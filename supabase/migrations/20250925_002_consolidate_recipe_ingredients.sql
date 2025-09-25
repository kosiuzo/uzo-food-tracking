-- Migration: Consolidate recipe_items into ingredient_list and remove recipe_items table
-- Date: 2025-09-25
-- Description: Migrates structured recipe_items data into the ingredient_list text array field and removes the recipe_items table

-- Step 1: Update recipes that have recipe_items but no ingredient_list
-- Convert recipe_items to formatted ingredient strings
UPDATE recipes
SET ingredient_list = (
  SELECT ARRAY(
    SELECT
      CASE
        -- Format: "quantity unit item_name" (e.g., "2.00 tbsp 100% Pure Olive Oil")
        WHEN ri.quantity IS NOT NULL AND ri.unit IS NOT NULL THEN
          CONCAT(ri.quantity, ' ', ri.unit, ' ', i.name)
        WHEN ri.quantity IS NOT NULL THEN
          CONCAT(ri.quantity, ' ', i.name)
        WHEN ri.unit IS NOT NULL THEN
          CONCAT(ri.unit, ' ', i.name)
        ELSE i.name
      END
    FROM recipe_items ri
    JOIN items i ON ri.item_id = i.id
    WHERE ri.recipe_id = recipes.id
    ORDER BY i.name
  )
)
WHERE id IN (
  SELECT DISTINCT recipe_id
  FROM recipe_items
)
AND (ingredient_list IS NULL OR array_length(ingredient_list, 1) = 0);

-- Step 2: For recipes that have both recipe_items AND existing ingredient_list,
-- merge them (keep existing ingredient_list and add recipe_items)
UPDATE recipes
SET ingredient_list = (
  SELECT ARRAY(
    SELECT DISTINCT unnest_item
    FROM (
      -- Existing ingredient_list items
      SELECT unnest(ingredient_list) as unnest_item
      UNION ALL
      -- New items from recipe_items
      SELECT
        CASE
          WHEN ri.quantity IS NOT NULL AND ri.unit IS NOT NULL THEN
            CONCAT(ri.quantity, ' ', ri.unit, ' ', i.name)
          WHEN ri.quantity IS NOT NULL THEN
            CONCAT(ri.quantity, ' ', i.name)
          WHEN ri.unit IS NOT NULL THEN
            CONCAT(ri.unit, ' ', i.name)
          ELSE i.name
        END
      FROM recipe_items ri
      JOIN items i ON ri.item_id = i.id
      WHERE ri.recipe_id = recipes.id
    ) combined
    ORDER BY unnest_item
  )
)
WHERE id IN (
  SELECT DISTINCT recipe_id
  FROM recipe_items
)
AND ingredient_list IS NOT NULL
AND array_length(ingredient_list, 1) > 0;

-- Step 3: Update nutrition_source to 'ai_generated' for recipes that had recipe_items
-- This ensures the ingredient_list will be displayed properly in the UI
UPDATE recipes
SET nutrition_source = 'ai_generated'
WHERE ingredient_list IS NOT NULL
AND array_length(ingredient_list, 1) > 0;

-- Step 4: Drop the recipe_items table and related constraints
DROP TABLE IF EXISTS recipe_items CASCADE;

-- Note: All recipe_items data has been migrated to the ingredient_list field.
-- The ingredient_list now contains formatted strings like "2.00 tbsp Olive Oil".
-- The nutrition_source has been updated to 'ai_generated' to ensure proper display.
-- This simplifies the data model by removing the need for a separate junction table.