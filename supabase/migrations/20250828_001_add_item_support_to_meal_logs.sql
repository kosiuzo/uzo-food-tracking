-- Add support for individual items in meal logs
-- Migration: Add item_entries column and update constraints

-- Add new column for individual item entries
ALTER TABLE meal_logs 
ADD COLUMN item_entries JSONB DEFAULT '[]'::jsonb;

-- Update the check constraint to allow either recipe_ids OR item_entries
ALTER TABLE meal_logs 
DROP CONSTRAINT meal_logs_recipe_ids_check;

-- Add new constraint to ensure at least one of recipe_ids or item_entries is provided
ALTER TABLE meal_logs 
ADD CONSTRAINT meal_logs_content_check 
CHECK (
  (array_length(recipe_ids, 1) > 0) OR 
  (jsonb_array_length(item_entries) > 0)
);

-- Allow empty recipe_ids array when item_entries is provided
ALTER TABLE meal_logs 
ALTER COLUMN recipe_ids SET DEFAULT '{}';

-- Add comment explaining the structure
COMMENT ON COLUMN meal_logs.item_entries IS 'Array of individual item entries with structure: [{"item_id": number, "quantity": number, "unit": string, "nutrition": {...}, "cost": number}]';

-- Create index for efficient queries on item_entries
CREATE INDEX idx_meal_logs_item_entries ON meal_logs USING GIN (item_entries);

-- Update the trigger function to handle both recipes and items for stats
-- This will be handled in the application logic for now since the trigger currently only handles recipes