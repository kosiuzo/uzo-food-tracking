-- Migration: Add hybrid ingredient system support
-- This adds support for AI-generated recipes with ingredient lists alongside existing item-linked recipes

-- Add ingredient_list column for storing AI-generated ingredient strings
ALTER TABLE recipes 
ADD COLUMN ingredient_list TEXT[];

-- Add nutrition_source column to track how nutrition was determined
ALTER TABLE recipes 
ADD COLUMN nutrition_source VARCHAR(20) DEFAULT 'calculated' CHECK (nutrition_source IN ('calculated', 'ai_generated', 'manual'));

-- Add comments for documentation
COMMENT ON COLUMN recipes.ingredient_list IS 'Array of ingredient strings from AI generation (e.g., ["2 cups flour", "1 tsp salt"])';
COMMENT ON COLUMN recipes.nutrition_source IS 'Source of nutrition data: calculated (from recipe_items), ai_generated (from AI), or manual (user entered)';

-- Update existing recipes to have proper nutrition_source
-- If a recipe has recipe_items, it's calculated nutrition
UPDATE recipes 
SET nutrition_source = 'calculated' 
WHERE id IN (
    SELECT DISTINCT recipe_id 
    FROM recipe_items
);

-- If a recipe has no recipe_items but has nutrition, it's likely manual
UPDATE recipes 
SET nutrition_source = 'manual' 
WHERE nutrition_source = 'calculated' 
AND nutrition_per_serving IS NOT NULL 
AND id NOT IN (
    SELECT DISTINCT recipe_id 
    FROM recipe_items
);

-- Update search vector trigger to include ingredient_list
CREATE OR REPLACE FUNCTION update_recipes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.cuisine_type, '') || ' ' ||
    COALESCE(NEW.instructions, '') || ' ' ||
    COALESCE(NEW.notes, '') || ' ' ||
    COALESCE(array_to_string(NEW.ingredient_list, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;