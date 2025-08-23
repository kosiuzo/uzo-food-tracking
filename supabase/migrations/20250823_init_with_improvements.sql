-- Food Tracking App Database Schema
-- Created: 2025-08-08, Updated: 2025-08-23 with data validation and audit improvements

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Drop the old meal_plans table and related indexes if they exist
DROP INDEX IF EXISTS idx_meal_plans_date;
DROP INDEX IF EXISTS idx_meal_plans_recipe_id;
DROP TABLE IF EXISTS meal_plans;

-- Create serving unit type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'serving_unit_type') THEN
    CREATE TYPE serving_unit_type AS ENUM ('volume', 'weight', 'package');
  END IF;
END$$;

-- Create items table
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    price NUMERIC(10,2) CHECK (price IS NULL OR price >= 0),
    carbs_per_serving NUMERIC(10,2) CHECK (carbs_per_serving IS NULL OR carbs_per_serving >= 0),
    fat_per_serving NUMERIC(10,2) CHECK (fat_per_serving IS NULL OR fat_per_serving >= 0),
    protein_per_serving NUMERIC(10,2) CHECK (protein_per_serving IS NULL OR protein_per_serving >= 0),
    calories_per_serving NUMERIC(10,2) CHECK (calories_per_serving IS NULL OR calories_per_serving >= 0),
    servings_per_container NUMERIC(10,2) CHECK (servings_per_container IS NULL OR servings_per_container > 0),
    serving_size_grams NUMERIC(10,2) DEFAULT 100 CHECK (serving_size_grams IS NULL OR serving_size_grams > 0),
    serving_quantity NUMERIC(10,2) CHECK (serving_quantity IS NULL OR serving_quantity > 0),
    serving_unit TEXT,
    serving_unit_type serving_unit_type,
    image_url TEXT,
    ingredients TEXT,
    nutrition_source TEXT,
    barcode TEXT,
    last_purchased DATE,
    purchase_count INTEGER DEFAULT 0 CHECK (purchase_count IS NULL OR purchase_count >= 0),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    last_edited TIMESTAMP DEFAULT NOW(),
    normalized_name TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Trigger function to set normalized_name
CREATE OR REPLACE FUNCTION set_normalized_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_name := regexp_replace(
    lower(unaccent(coalesce(NEW.name, ''))),
    '[^a-z0-9]+', '', 'g'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update normalized_name on INSERT or UPDATE
CREATE TRIGGER trg_set_normalized_name
BEFORE INSERT OR UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION set_normalized_name();

-- Create recipes table
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    cuisine_type TEXT,
    difficulty TEXT,
    prep_time INT CHECK (prep_time IS NULL OR prep_time >= 0),
    cook_time INT CHECK (cook_time IS NULL OR cook_time >= 0),
    total_time INT CHECK (total_time IS NULL OR total_time >= 0),
    servings INT CHECK (servings IS NULL OR servings > 0),
    instructions TEXT,
    nutrition_per_serving JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    source_link TEXT,
    cost_per_serving NUMERIC(10,2) CHECK (cost_per_serving IS NULL OR cost_per_serving >= 0),
    total_cost NUMERIC(10,4) CHECK (total_cost IS NULL OR total_cost >= 0),
    cost_last_calculated TIMESTAMP,
    notes TEXT,
    times_cooked INT DEFAULT 0 CHECK (times_cooked IS NULL OR times_cooked >= 0),
    last_cooked TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create tags table
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3b82f6',
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create recipe_tags junction table
CREATE TABLE recipe_tags (
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (recipe_id, tag_id)
);

-- Create recipe_items junction table
CREATE TABLE recipe_items (
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    item_id BIGINT REFERENCES items(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) CHECK (quantity IS NULL OR quantity > 0),
    unit TEXT,
    cost_per_unit NUMERIC(10,4) CHECK (cost_per_unit IS NULL OR cost_per_unit >= 0),
    total_cost NUMERIC(10,4) CHECK (total_cost IS NULL OR total_cost >= 0),
    cost_calculated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
    PRIMARY KEY (recipe_id, item_id)
);

-- Create meal_logs table with support for multiple recipes per meal
CREATE TABLE meal_logs (
    id BIGSERIAL PRIMARY KEY,
    recipe_ids BIGINT[] NOT NULL,
    meal_name TEXT,
    cooked_at DATE,
    notes TEXT,
    rating NUMERIC(2,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    macros JSONB,
    cost NUMERIC(10,2) CHECK (cost IS NULL OR cost >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT meal_logs_recipe_ids_check CHECK (array_length(recipe_ids, 1) > 0)
);

-- Create new meal planning tables
-- Weekly meal plans
CREATE TABLE weekly_meal_plans (
    id BIGSERIAL PRIMARY KEY,
    week_start DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Meal plan blocks (day ranges)
CREATE TABLE meal_plan_blocks (
    id BIGSERIAL PRIMARY KEY,
    weekly_plan_id BIGINT REFERENCES weekly_meal_plans(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_day INTEGER NOT NULL CHECK (start_day >= 0 AND start_day <= 6), -- 0 = Monday, 6 = Sunday
    end_day INTEGER NOT NULL CHECK (end_day >= 0 AND end_day <= 6),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_day_range CHECK (end_day >= start_day)
);

-- Recipe rotations within blocks
CREATE TABLE recipe_rotations (
    id BIGSERIAL PRIMARY KEY,
    block_id BIGINT REFERENCES meal_plan_blocks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recipes assigned to rotations
CREATE TABLE rotation_recipes (
    rotation_id BIGINT REFERENCES recipe_rotations(id) ON DELETE CASCADE,
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (rotation_id, recipe_id)
);

-- Snacks for meal plan blocks
CREATE TABLE block_snacks (
    block_id BIGINT REFERENCES meal_plan_blocks(id) ON DELETE CASCADE,
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (block_id, recipe_id)
);

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS ux_items_normalized_name ON items(normalized_name);
CREATE UNIQUE INDEX IF NOT EXISTS ux_items_barcode ON items(barcode);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_in_stock ON items(in_stock);
CREATE INDEX IF NOT EXISTS idx_items_rating ON items(rating);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag_id ON recipe_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_cooked_at ON meal_logs(cooked_at);
CREATE INDEX IF NOT EXISTS idx_meal_logs_recipe_ids ON meal_logs USING GIN(recipe_ids);
CREATE INDEX IF NOT EXISTS idx_weekly_meal_plans_week_start ON weekly_meal_plans(week_start);
CREATE INDEX IF NOT EXISTS idx_meal_plan_blocks_weekly_plan_id ON meal_plan_blocks(weekly_plan_id);
CREATE INDEX IF NOT EXISTS idx_recipe_rotations_block_id ON recipe_rotations(block_id);
CREATE INDEX IF NOT EXISTS idx_rotation_recipes_rotation_id ON rotation_recipes(rotation_id);
CREATE INDEX IF NOT EXISTS idx_block_snacks_block_id ON block_snacks(block_id);

-- Additional indexes for audit fields
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_items_updated_at ON items(updated_at);
CREATE INDEX IF NOT EXISTS idx_recipe_items_created_at ON recipe_items(created_at);
CREATE INDEX IF NOT EXISTS idx_recipe_items_updated_at ON recipe_items(updated_at);

-- Create RPC function for upserting items by name
CREATE OR REPLACE FUNCTION upsert_item_by_name(
    p_name TEXT,
    p_brand TEXT,
    p_price NUMERIC,
    p_category TEXT DEFAULT NULL,
    p_in_stock BOOLEAN DEFAULT TRUE
) RETURNS items AS $$
INSERT INTO items (name, brand, price, category, in_stock, last_edited)
VALUES (p_name, p_brand, p_price, p_category, COALESCE(p_in_stock, TRUE), NOW())
ON CONFLICT (normalized_name) DO UPDATE
    SET brand       = EXCLUDED.brand,
        price       = EXCLUDED.price,
        last_edited = NOW()
RETURNING *;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create RPC function for batch upserting items
CREATE OR REPLACE FUNCTION batch_upsert_items(
    items_data JSONB
) RETURNS SETOF items AS $$
DECLARE
    item_data JSONB;
    result_item items;
BEGIN
    FOR item_data IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
        INSERT INTO items (
            name, 
            brand, 
            price, 
            category, 
            in_stock, 
            carbs_per_serving,
            fat_per_serving,
            protein_per_serving,
            calories_per_serving,
            servings_per_container,
            serving_size_grams,
            serving_quantity,
            serving_unit,
            serving_unit_type,
            image_url,
            ingredients,
            nutrition_source,
            barcode,
            rating,
            last_edited
        )
        VALUES (
            item_data->>'name',
            item_data->>'brand',
            (item_data->>'price')::NUMERIC,
            item_data->>'category',
            COALESCE((item_data->>'in_stock')::BOOLEAN, TRUE),
            (item_data->>'carbs_per_serving')::NUMERIC,
            (item_data->>'fat_per_serving')::NUMERIC,
            (item_data->>'protein_per_serving')::NUMERIC,
            (item_data->>'calories_per_serving')::NUMERIC,
            (item_data->>'servings_per_container')::NUMERIC,
            COALESCE((item_data->>'serving_size_grams')::NUMERIC, 100),
            (item_data->>'serving_quantity')::NUMERIC,
            item_data->>'serving_unit',
            (item_data->>'serving_unit_type')::serving_unit_type,
            item_data->>'image_url',
            item_data->>'ingredients',
            item_data->>'nutrition_source',
            item_data->>'barcode',
            (item_data->>'rating')::INTEGER,
            NOW()
        )
        ON CONFLICT (normalized_name) DO UPDATE
        SET 
            brand = EXCLUDED.brand,
            price = EXCLUDED.price,
            category = EXCLUDED.category,
            in_stock = EXCLUDED.in_stock,
            carbs_per_serving = EXCLUDED.carbs_per_serving,
            fat_per_serving = EXCLUDED.fat_per_serving,
            protein_per_serving = EXCLUDED.protein_per_serving,
            calories_per_serving = EXCLUDED.calories_per_serving,
            servings_per_container = EXCLUDED.servings_per_container,
            serving_size_grams = EXCLUDED.serving_size_grams,
            serving_quantity = EXCLUDED.serving_quantity,
            serving_unit = EXCLUDED.serving_unit,
            serving_unit_type = EXCLUDED.serving_unit_type,
            image_url = EXCLUDED.image_url,
            ingredients = EXCLUDED.ingredients,
            nutrition_source = EXCLUDED.nutrition_source,
            barcode = EXCLUDED.barcode,
            rating = EXCLUDED.rating,
            last_edited = NOW()
        RETURNING * INTO result_item;
        
        RETURN NEXT result_item;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create RPC function for getting analytics data
CREATE OR REPLACE FUNCTION get_analytics_data(
    p_days_back INTEGER DEFAULT 30
) RETURNS TABLE(
    avg_meal_cost NUMERIC,
    avg_calories NUMERIC,
    avg_protein NUMERIC,
    avg_carbs NUMERIC,
    avg_fat NUMERIC,
    total_meals INTEGER,
    top_recipes JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH meal_stats AS (
        SELECT 
            AVG(cost) as avg_cost,
            AVG((macros->>'calories')::NUMERIC) as avg_calories,
            AVG((macros->>'protein')::NUMERIC) as avg_protein,
            AVG((macros->>'carbs')::NUMERIC) as avg_carbs,
            AVG((macros->>'fat')::NUMERIC) as avg_fat,
            COUNT(*) as total_meals
        FROM meal_logs
        WHERE cooked_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    ),
    top_recipes_stats AS (
        SELECT 
            r.name,
            COUNT(ml.id) as times_cooked,
            AVG(ml.rating) as avg_rating
        FROM recipes r
        JOIN meal_logs ml ON r.id = ANY(ml.recipe_ids)
        WHERE ml.cooked_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY r.id, r.name
        ORDER BY times_cooked DESC, avg_rating DESC
        LIMIT 5
    )
    SELECT 
        ms.avg_cost,
        ms.avg_calories,
        ms.avg_protein,
        ms.avg_carbs,
        ms.avg_fat,
        ms.total_meals,
        COALESCE(jsonb_agg(
            jsonb_build_object(
                'name', trs.name,
                'times_cooked', trs.times_cooked,
                'avg_rating', trs.avg_rating
            )
        ), '[]'::jsonb) as top_recipes
    FROM meal_stats ms
    CROSS JOIN LATERAL (
        SELECT * FROM top_recipes_stats
    ) trs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create RPC function for updating recipe statistics
CREATE OR REPLACE FUNCTION update_recipe_stats(
    p_recipe_id BIGINT
) RETURNS VOID AS $$
BEGIN
    UPDATE recipes 
    SET 
        times_cooked = (
            SELECT COUNT(*) 
            FROM meal_logs 
            WHERE p_recipe_id = ANY(recipe_ids)
        ),
        last_cooked = (
            SELECT MAX(cooked_at) 
            FROM meal_logs 
            WHERE p_recipe_id = ANY(recipe_ids)
        )
    WHERE id = p_recipe_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update recipe stats when meal logs are added/updated
CREATE OR REPLACE FUNCTION trigger_update_recipe_stats()
RETURNS TRIGGER AS $$
DECLARE
    recipe_id BIGINT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update stats for all recipes in the new meal log
        FOREACH recipe_id IN ARRAY NEW.recipe_ids
        LOOP
            PERFORM update_recipe_stats(recipe_id);
        END LOOP;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Update stats for all recipes in the new meal log
        FOREACH recipe_id IN ARRAY NEW.recipe_ids
        LOOP
            PERFORM update_recipe_stats(recipe_id);
        END LOOP;
        -- If recipe_ids changed, update stats for old recipes too
        IF OLD.recipe_ids != NEW.recipe_ids THEN
            FOREACH recipe_id IN ARRAY OLD.recipe_ids
            LOOP
                PERFORM update_recipe_stats(recipe_id);
            END LOOP;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Update stats for all recipes in the deleted meal log
        FOREACH recipe_id IN ARRAY OLD.recipe_ids
        LOOP
            PERFORM update_recipe_stats(recipe_id);
        END LOOP;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_meal_logs_update_recipe_stats
    AFTER INSERT OR UPDATE OR DELETE ON meal_logs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_recipe_stats();

-- Create trigger to update updated_at timestamp on recipes
CREATE OR REPLACE FUNCTION trigger_update_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recipes_update_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_recipes_updated_at();

-- Create trigger to update updated_at timestamp on meal plan blocks
CREATE OR REPLACE FUNCTION trigger_update_meal_plan_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_meal_plan_blocks_update_updated_at
    BEFORE UPDATE ON meal_plan_blocks
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_meal_plan_blocks_updated_at();

-- Create trigger to update updated_at timestamp on recipe rotations
CREATE OR REPLACE FUNCTION trigger_update_recipe_rotations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recipe_rotations_update_updated_at
    BEFORE UPDATE ON recipe_rotations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_recipe_rotations_updated_at();

-- Create trigger to update updated_at timestamp on weekly meal plans
CREATE OR REPLACE FUNCTION trigger_update_weekly_meal_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_weekly_meal_plans_update_updated_at
    BEFORE UPDATE ON weekly_meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_weekly_meal_plans_updated_at();

-- Create trigger to update updated_at timestamp on tags
CREATE OR REPLACE FUNCTION trigger_update_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tags_update_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_tags_updated_at();

-- Updated items trigger to maintain both updated_at and last_edited
CREATE OR REPLACE FUNCTION trigger_update_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_edited = NOW(); -- Keep last_edited for backward compatibility
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_items_update_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_items_updated_at();

-- Recipe items trigger
CREATE OR REPLACE FUNCTION trigger_update_recipe_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recipe_items_update_updated_at
    BEFORE UPDATE ON recipe_items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_recipe_items_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotation_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_snacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a single-user app)
CREATE POLICY "Allow public access to items" ON items FOR ALL USING (true);
CREATE POLICY "Allow public access to recipes" ON recipes FOR ALL USING (true);
CREATE POLICY "Allow public access to recipe_items" ON recipe_items FOR ALL USING (true);
CREATE POLICY "Allow public access to meal_logs" ON meal_logs FOR ALL USING (true);
CREATE POLICY "Allow public access to weekly_meal_plans" ON weekly_meal_plans FOR ALL USING (true);
CREATE POLICY "Allow public access to meal_plan_blocks" ON meal_plan_blocks FOR ALL USING (true);
CREATE POLICY "Allow public access to recipe_rotations" ON recipe_rotations FOR ALL USING (true);
CREATE POLICY "Allow public access to rotation_recipes" ON rotation_recipes FOR ALL USING (true);
CREATE POLICY "Allow public access to block_snacks" ON block_snacks FOR ALL USING (true);
CREATE POLICY "Allow public access to tags" ON tags FOR ALL USING (true);
CREATE POLICY "Allow public access to recipe_tags" ON recipe_tags FOR ALL USING (true);
