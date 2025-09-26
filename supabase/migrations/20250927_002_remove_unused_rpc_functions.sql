-- Migration: Remove unused RPC functions
-- Created: 2025-09-26
-- Description: Drop all RPC functions that are not being used in the application

-- Drop analytics RPC function (replaced with client-side calculations)
DROP FUNCTION IF EXISTS get_analytics_data(p_days_back INTEGER);

-- Drop recipe stats update function (not used for automatic recalculation)
DROP FUNCTION IF EXISTS update_recipe_stats(p_recipe_id BIGINT);

-- Drop batch item upsert function (no bulk import functionality)
DROP FUNCTION IF EXISTS batch_upsert_items(items_data JSONB);

-- Drop single item upsert function (using standard REST operations)
DROP FUNCTION IF EXISTS upsert_item_by_name(
    p_name TEXT,
    p_brand TEXT,
    p_price NUMERIC,
    p_category TEXT,
    p_in_stock BOOLEAN
);

-- Note: unaccent is a PostgreSQL extension function, not a custom RPC
-- It's exposed as an RPC endpoint automatically but we can't drop it
-- since it's part of the unaccent extension. If needed, the entire
-- extension could be dropped with: DROP EXTENSION IF EXISTS unaccent;
-- However, we'll leave it in case it's useful for future database-level search

-- Note: Keep the trigger functions that handle updated_at timestamps
-- as these are still used by the database triggers
-- - trigger_update_recipes_updated_at()
-- - trigger_update_meal_plan_blocks_updated_at()
-- - trigger_update_recipe_rotations_updated_at()
-- - trigger_update_weekly_meal_plans_updated_at()
-- - trigger_update_tags_updated_at()
-- - trigger_update_items_updated_at()
-- - trigger_update_recipe_items_updated_at()

-- Note: Keep the search vector update functions as these are used by triggers
-- - update_items_search_vector()
-- - update_recipes_search_vector()
-- - update_tags_search_vector()

-- Note: Keep the normalized name function as it's used by triggers
-- - set_normalized_name()