-- Migration: Remove cost, nutrition, and serving fields from recipe_items and items tables
-- Date: 2025-09-25
-- Description: Removes unused cost tracking, nutrition, and serving fields to simplify data model

-- Drop check constraints first
ALTER TABLE recipe_items DROP CONSTRAINT IF EXISTS recipe_items_cost_per_unit_check;
ALTER TABLE recipe_items DROP CONSTRAINT IF EXISTS recipe_items_total_cost_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_price_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_calories_per_serving_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_carbs_per_serving_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_fat_per_serving_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_protein_per_serving_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_serving_quantity_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_serving_size_grams_check;
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_servings_per_container_check;

-- Drop cost-related columns from recipe_items table
ALTER TABLE recipe_items DROP COLUMN IF EXISTS cost_per_unit;
ALTER TABLE recipe_items DROP COLUMN IF EXISTS total_cost;
ALTER TABLE recipe_items DROP COLUMN IF EXISTS cost_calculated_at;

-- Drop related indexes and constraints first
DROP INDEX IF EXISTS idx_items_in_stock;
DROP INDEX IF EXISTS ux_items_barcode;

-- Drop cost and nutrition columns from items table
ALTER TABLE items DROP COLUMN IF EXISTS price;
ALTER TABLE items DROP COLUMN IF EXISTS in_stock;
ALTER TABLE items DROP COLUMN IF EXISTS serving_size_grams;
ALTER TABLE items DROP COLUMN IF EXISTS serving_quantity;
ALTER TABLE items DROP COLUMN IF EXISTS serving_unit;
ALTER TABLE items DROP COLUMN IF EXISTS serving_unit_type;
ALTER TABLE items DROP COLUMN IF EXISTS servings_per_container;
ALTER TABLE items DROP COLUMN IF EXISTS calories_per_serving;
ALTER TABLE items DROP COLUMN IF EXISTS protein_per_serving;
ALTER TABLE items DROP COLUMN IF EXISTS carbs_per_serving;
ALTER TABLE items DROP COLUMN IF EXISTS fat_per_serving;
ALTER TABLE items DROP COLUMN IF EXISTS barcode;
ALTER TABLE items DROP COLUMN IF EXISTS nutrition_source;
ALTER TABLE items DROP COLUMN IF EXISTS last_purchased;

-- Remove any cost-related functions that may exist
DROP FUNCTION IF EXISTS calculate_recipe_cost(p_recipe_id bigint);

-- Note: This migration removes cost tracking, nutrition tracking, and serving information
-- from items to simplify the data model. If any of these features are needed in the future,
-- they will need to be reimplemented.