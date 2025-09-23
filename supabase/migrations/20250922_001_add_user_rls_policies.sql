-- Add user-based RLS policies allowing ANON key access and user ownership
-- This replaces the current public access policies with ANON + owner access

-- First, add user_id columns to all tables that don't have them
ALTER TABLE items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE tags ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE weekly_meal_plans ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop all existing public access policies
DROP POLICY IF EXISTS "Allow public access to items" ON items;
DROP POLICY IF EXISTS "Allow public access to recipes" ON recipes;
DROP POLICY IF EXISTS "Allow public access to meal_logs" ON meal_logs;
DROP POLICY IF EXISTS "Allow public access to tags" ON tags;
DROP POLICY IF EXISTS "Allow public access to recipe_tags" ON recipe_tags;
DROP POLICY IF EXISTS "Allow public access to recipe_items" ON recipe_items;
DROP POLICY IF EXISTS "Allow public access to weekly_meal_plans" ON weekly_meal_plans;
DROP POLICY IF EXISTS "Allow public access to meal_plan_blocks" ON meal_plan_blocks;
DROP POLICY IF EXISTS "Allow public access to recipe_rotations" ON recipe_rotations;
DROP POLICY IF EXISTS "Allow public access to rotation_recipes" ON rotation_recipes;
DROP POLICY IF EXISTS "Allow public access to block_snacks" ON block_snacks;

-- Create RLS policies allowing ANON key access and user ownership for main tables
CREATE POLICY "Allow anon and owner access to items" ON items
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner insert to items" ON items
    FOR INSERT WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner access to recipes" ON recipes
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner insert to recipes" ON recipes
    FOR INSERT WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner access to meal_logs" ON meal_logs
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner insert to meal_logs" ON meal_logs
    FOR INSERT WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner access to tags" ON tags
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner insert to tags" ON tags
    FOR INSERT WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner access to weekly_meal_plans" ON weekly_meal_plans
    FOR ALL USING (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anon and owner insert to weekly_meal_plans" ON weekly_meal_plans
    FOR INSERT WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- For junction tables, create policies allowing ANON and owner access
CREATE POLICY "Allow anon and owner access to recipe_tags" ON recipe_tags
    FOR ALL USING (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = recipe_tags.recipe_id
            AND (recipes.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner insert to recipe_tags" ON recipe_tags
    FOR INSERT WITH CHECK (
        auth.uid() IS NULL
        OR
        (
            EXISTS (
                SELECT 1 FROM recipes
                WHERE recipes.id = recipe_tags.recipe_id
                AND (recipes.user_id = auth.uid() OR auth.uid() IS NULL)
            )
            AND
            EXISTS (
                SELECT 1 FROM tags
                WHERE tags.id = recipe_tags.tag_id
                AND (tags.user_id = auth.uid() OR auth.uid() IS NULL)
            )
        )
    );

CREATE POLICY "Allow anon and owner access to recipe_items" ON recipe_items
    FOR ALL USING (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM recipes
            WHERE recipes.id = recipe_items.recipe_id
            AND (recipes.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner insert to recipe_items" ON recipe_items
    FOR INSERT WITH CHECK (
        auth.uid() IS NULL
        OR
        (
            EXISTS (
                SELECT 1 FROM recipes
                WHERE recipes.id = recipe_items.recipe_id
                AND (recipes.user_id = auth.uid() OR auth.uid() IS NULL)
            )
            AND
            EXISTS (
                SELECT 1 FROM items
                WHERE items.id = recipe_items.item_id
                AND (items.user_id = auth.uid() OR auth.uid() IS NULL)
            )
        )
    );

CREATE POLICY "Allow anon and owner access to meal_plan_blocks" ON meal_plan_blocks
    FOR ALL USING (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM weekly_meal_plans
            WHERE weekly_meal_plans.id = meal_plan_blocks.weekly_plan_id
            AND (weekly_meal_plans.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner insert to meal_plan_blocks" ON meal_plan_blocks
    FOR INSERT WITH CHECK (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM weekly_meal_plans
            WHERE weekly_meal_plans.id = meal_plan_blocks.weekly_plan_id
            AND (weekly_meal_plans.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner access to recipe_rotations" ON recipe_rotations
    FOR ALL USING (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM meal_plan_blocks mpb
            JOIN weekly_meal_plans wmp ON mpb.weekly_plan_id = wmp.id
            WHERE mpb.id = recipe_rotations.block_id
            AND (wmp.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner insert to recipe_rotations" ON recipe_rotations
    FOR INSERT WITH CHECK (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM meal_plan_blocks mpb
            JOIN weekly_meal_plans wmp ON mpb.weekly_plan_id = wmp.id
            WHERE mpb.id = recipe_rotations.block_id
            AND (wmp.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner access to rotation_recipes" ON rotation_recipes
    FOR ALL USING (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM recipe_rotations rr
            JOIN meal_plan_blocks mpb ON rr.block_id = mpb.id
            JOIN weekly_meal_plans wmp ON mpb.weekly_plan_id = wmp.id
            WHERE rr.id = rotation_recipes.rotation_id
            AND (wmp.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner insert to rotation_recipes" ON rotation_recipes
    FOR INSERT WITH CHECK (
        auth.uid() IS NULL
        OR
        (
            EXISTS (
                SELECT 1 FROM recipe_rotations rr
                JOIN meal_plan_blocks mpb ON rr.block_id = mpb.id
                JOIN weekly_meal_plans wmp ON mpb.weekly_plan_id = wmp.id
                WHERE rr.id = rotation_recipes.rotation_id
                AND (wmp.user_id = auth.uid() OR auth.uid() IS NULL)
            )
            AND
            EXISTS (
                SELECT 1 FROM recipes
                WHERE recipes.id = rotation_recipes.recipe_id
                AND (recipes.user_id = auth.uid() OR auth.uid() IS NULL)
            )
        )
    );

CREATE POLICY "Allow anon and owner access to block_snacks" ON block_snacks
    FOR ALL USING (
        auth.uid() IS NULL
        OR
        EXISTS (
            SELECT 1 FROM meal_plan_blocks mpb
            JOIN weekly_meal_plans wmp ON mpb.weekly_plan_id = wmp.id
            WHERE mpb.id = block_snacks.block_id
            AND (wmp.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

CREATE POLICY "Allow anon and owner insert to block_snacks" ON block_snacks
    FOR INSERT WITH CHECK (
        auth.uid() IS NULL
        OR
        (
            EXISTS (
                SELECT 1 FROM meal_plan_blocks mpb
                JOIN weekly_meal_plans wmp ON mpb.weekly_plan_id = wmp.id
                WHERE mpb.id = block_snacks.block_id
                AND (wmp.user_id = auth.uid() OR auth.uid() IS NULL)
            )
            AND
            EXISTS (
                SELECT 1 FROM recipes
                WHERE recipes.id = block_snacks.recipe_id
                AND (recipes.user_id = auth.uid() OR auth.uid() IS NULL)
            )
        )
    );

-- Assign all existing data to a test/demo user
-- NOTE: Replace this UUID with your actual user ID after authentication is set up
DO $$
DECLARE
    demo_user_id UUID := '43af6e15-1b3d-4634-be91-d59cf414a33e'::UUID;
BEGIN
    -- Update all existing records to belong to the demo user
    UPDATE items SET user_id = demo_user_id WHERE user_id IS NULL;
    UPDATE recipes SET user_id = demo_user_id WHERE user_id IS NULL;
    UPDATE meal_logs SET user_id = demo_user_id WHERE user_id IS NULL;
    UPDATE tags SET user_id = demo_user_id WHERE user_id IS NULL;
    UPDATE weekly_meal_plans SET user_id = demo_user_id WHERE user_id IS NULL;

    -- Log the results
    RAISE NOTICE 'Updated % items', (SELECT COUNT(*) FROM items WHERE user_id = demo_user_id);
    RAISE NOTICE 'Updated % recipes', (SELECT COUNT(*) FROM recipes WHERE user_id = demo_user_id);
    RAISE NOTICE 'Updated % meal_logs', (SELECT COUNT(*) FROM meal_logs WHERE user_id = demo_user_id);
    RAISE NOTICE 'Updated % tags', (SELECT COUNT(*) FROM tags WHERE user_id = demo_user_id);
    RAISE NOTICE 'Updated % weekly_meal_plans', (SELECT COUNT(*) FROM weekly_meal_plans WHERE user_id = demo_user_id);
END$$;

-- Add indexes for user_id columns for better performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_id ON meal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_meal_plans_user_id ON weekly_meal_plans(user_id);