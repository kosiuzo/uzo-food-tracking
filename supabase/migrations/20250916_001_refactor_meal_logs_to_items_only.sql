-- Migration: Refactor meal_logs to use items array instead of recipes
-- Remove recipe-based functionality and cost tracking
-- Simplify to items-only approach with LLM-generated macros

-- Drop the trigger first (depends on the function)
DROP TRIGGER IF EXISTS trigger_meal_logs_update_recipe_stats ON meal_logs;

-- Drop the trigger function
DROP FUNCTION IF EXISTS trigger_update_recipe_stats();

-- Drop indexes related to recipe_ids and cooked_at
DROP INDEX IF EXISTS idx_meal_logs_recipe_ids;
DROP INDEX IF EXISTS idx_meal_logs_cooked_at;
DROP INDEX IF EXISTS idx_meal_logs_item_entries;

-- Remove columns we no longer need and add the new items column
ALTER TABLE meal_logs
  DROP COLUMN IF EXISTS recipe_ids,
  DROP COLUMN IF EXISTS cost,
  DROP COLUMN IF EXISTS cooked_at,
  DROP COLUMN IF EXISTS item_entries,
  ADD COLUMN items TEXT[] NOT NULL DEFAULT '{}';

-- Remove the old constraint that required recipe_ids
ALTER TABLE meal_logs DROP CONSTRAINT IF EXISTS meal_logs_recipe_ids_check;

-- Add constraint to ensure items array is not empty
ALTER TABLE meal_logs ADD CONSTRAINT meal_logs_items_check CHECK (array_length(items, 1) > 0);

-- Create index for items array for efficient searching
CREATE INDEX idx_meal_logs_items ON meal_logs USING GIN (items);

-- Create index for created_at since we're now using it for date queries instead of cooked_at
CREATE INDEX IF NOT EXISTS idx_meal_logs_created_at ON meal_logs(created_at);

-- Update the meal_name column to be NOT NULL (it's required now)
ALTER TABLE meal_logs ALTER COLUMN meal_name SET NOT NULL;

-- Ensure macros column has a default empty object
ALTER TABLE meal_logs ALTER COLUMN macros SET DEFAULT '{}';