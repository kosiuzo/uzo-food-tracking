-- Migration: Consolidate tags into recipes table and remove separate tags/recipe_tags tables
-- Date: 2025-09-25
-- Description: Migrates tag data from relational tables into a simple tags array on recipes table

-- Step 1: Add tags array column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Step 2: Migrate existing tag relationships into the tags array
-- This will create an array of simple tag names for each recipe
UPDATE recipes
SET tags = (
  SELECT ARRAY(
    SELECT t.name
    FROM recipe_tags rt
    JOIN tags t ON rt.tag_id = t.id
    WHERE rt.recipe_id = recipes.id
    ORDER BY t.name
  )
)
WHERE id IN (
  SELECT DISTINCT recipe_id
  FROM recipe_tags
);

-- Step 3: Drop the recipe_tags table (junction table)
DROP TABLE IF EXISTS recipe_tags CASCADE;

-- Step 4: Drop the tags table (no longer needed)
DROP TABLE IF EXISTS tags CASCADE;

-- Note: Tags are now stored as a simple array of tag name strings.
-- This simplifies the data model by removing the need for separate tag tables and relationships.
-- Examples: ["baking", "chicken", "sauce", "stir-fry"]