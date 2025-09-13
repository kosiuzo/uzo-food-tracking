-- Migration: Simplify recipes schema by removing unused fields
-- Drop check constraints that reference fields we're removing
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_prep_time_check;
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_cook_time_check;
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_cost_per_serving_check;
ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_total_cost_check;

-- Drop index that references cuisine_type
DROP INDEX IF EXISTS idx_recipes_name_cuisine;

-- Drop unused columns
ALTER TABLE recipes 
  DROP COLUMN IF EXISTS prep_time,
  DROP COLUMN IF EXISTS cook_time,
  DROP COLUMN IF EXISTS difficulty,
  DROP COLUMN IF EXISTS cuisine_type,
  DROP COLUMN IF EXISTS cost_per_serving,
  DROP COLUMN IF EXISTS total_cost,
  DROP COLUMN IF EXISTS cost_last_calculated;

-- Recreate the name index without cuisine_type
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes (name);

-- Update the search vector trigger to remove references to deleted fields
CREATE OR REPLACE FUNCTION update_recipes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.instructions, '') || ' ' ||
    COALESCE(NEW.notes, '') || ' ' ||
    COALESCE(array_to_string(NEW.ingredient_list, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;