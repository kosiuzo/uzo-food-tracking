-- Migration: Remove unused meal planning tables
-- Date: 2025-09-25
-- Description: Removes meal planning tables that are not used in the current application

-- Step 1: Drop junction tables first (due to foreign key constraints)
DROP TABLE IF EXISTS block_snacks CASCADE;
DROP TABLE IF EXISTS rotation_recipes CASCADE;

-- Step 2: Drop dependent tables
DROP TABLE IF EXISTS recipe_rotations CASCADE;
DROP TABLE IF EXISTS meal_plan_blocks CASCADE;

-- Step 3: Drop the main meal planning table
DROP TABLE IF EXISTS weekly_meal_plans CASCADE;

-- Note: All meal planning functionality has been removed from the database.
-- The current application uses simple meal logging instead of structured meal planning.
-- If meal planning features are needed in the future, these tables will need to be recreated.