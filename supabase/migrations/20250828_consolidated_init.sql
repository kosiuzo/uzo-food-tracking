-- Consolidated migration: Complete food tracking application schema
-- Created: 2025-08-28
-- Consolidates all previous migrations into a single comprehensive schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create items table with comprehensive nutrition and cost tracking
CREATE TABLE IF NOT EXISTS items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    in_stock BOOLEAN DEFAULT true,
    price NUMERIC(10,2) CHECK (price IS NULL OR price >= 0),
    price_per_serving NUMERIC(10,4) DEFAULT 0 CHECK (price_per_serving IS NULL OR price_per_serving >= 0),
    calories_per_serving NUMERIC(6,2) DEFAULT 0 CHECK (calories_per_serving >= 0),
    carbs_per_serving NUMERIC(6,2) DEFAULT 0 CHECK (carbs_per_serving >= 0),
    fat_per_serving NUMERIC(6,2) DEFAULT 0 CHECK (fat_per_serving >= 0),
    protein_per_serving NUMERIC(6,2) DEFAULT 0 CHECK (protein_per_serving >= 0),
    servings_per_container NUMERIC(8,2) DEFAULT 1 CHECK (servings_per_container > 0),
    serving_size_grams NUMERIC(8,2) DEFAULT 100 CHECK (serving_size_grams > 0),
    serving_quantity NUMERIC(8,2) CHECK (serving_quantity IS NULL OR serving_quantity > 0),
    serving_unit TEXT,
    serving_unit_type TEXT CHECK (serving_unit_type IN ('volume', 'weight', 'package')),
    image_url TEXT,
    ingredients TEXT,
    nutrition_source TEXT,
    barcode TEXT,
    rating NUMERIC(2,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    last_purchased DATE,
    purchase_count INTEGER DEFAULT 0 CHECK (purchase_count >= 0),
    last_edited TIMESTAMPTZ,
    normalized_name TEXT,
    search_vector tsvector,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create search indexes for items
CREATE INDEX IF NOT EXISTS idx_items_search_vector ON items USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_in_stock ON items(in_stock);
CREATE INDEX IF NOT EXISTS idx_items_normalized_name ON items(normalized_name);

-- Create trigger to update search vector
CREATE OR REPLACE FUNCTION update_items_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english', 
        COALESCE(NEW.name, '') || ' ' || 
        COALESCE(NEW.brand, '') || ' ' || 
        COALESCE(NEW.category, '') || ' ' ||
        COALESCE(NEW.ingredients, '')
    );
    NEW.normalized_name = LOWER(TRIM(NEW.name));
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_items_search_vector
    BEFORE INSERT OR UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_items_search_vector();

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    cuisine_type TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    prep_time INTEGER CHECK (prep_time >= 0),
    cook_time INTEGER CHECK (cook_time >= 0),
    total_time INTEGER CHECK (total_time >= 0),
    servings INTEGER DEFAULT 1 CHECK (servings > 0),
    instructions TEXT,
    nutrition_per_serving JSONB DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    source_link TEXT,
    cost_per_serving NUMERIC(10,2) CHECK (cost_per_serving IS NULL OR cost_per_serving >= 0),
    total_cost NUMERIC(10,2) CHECK (total_cost IS NULL OR total_cost >= 0),
    cost_last_calculated TIMESTAMPTZ,
    notes TEXT,
    times_cooked INTEGER DEFAULT 0 CHECK (times_cooked >= 0),
    last_cooked DATE,
    search_vector tsvector,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for recipes
CREATE INDEX IF NOT EXISTS idx_recipes_search_vector ON recipes USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_recipes_is_favorite ON recipes(is_favorite);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_type ON recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);

-- Create trigger to update recipe search vector
CREATE OR REPLACE FUNCTION update_recipes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = to_tsvector('english', 
        COALESCE(NEW.name, '') || ' ' || 
        COALESCE(NEW.cuisine_type, '') || ' ' || 
        COALESCE(NEW.instructions, '') || ' ' ||
        COALESCE(NEW.notes, '')
    );
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recipes_search_vector
    BEFORE INSERT OR UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_recipes_search_vector();

-- Create recipe_items junction table
CREATE TABLE IF NOT EXISTS recipe_items (
    recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity NUMERIC(8,2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    cost_per_unit NUMERIC(10,4),
    total_cost NUMERIC(10,4),
    cost_calculated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (recipe_id, item_id)
);

-- Create meal_logs table
CREATE TABLE IF NOT EXISTS meal_logs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    recipe_ids BIGINT[] NOT NULL,
    meal_name TEXT,
    cooked_at DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    rating NUMERIC(2,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    macros JSONB DEFAULT '{}',
    cost NUMERIC(10,2) CHECK (cost IS NULL OR cost >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for meal_logs
CREATE INDEX IF NOT EXISTS idx_meal_logs_cooked_at ON meal_logs(cooked_at);
CREATE INDEX IF NOT EXISTS idx_meal_logs_recipe_ids ON meal_logs USING gin(recipe_ids);

-- Create trigger to update meal_logs updated_at
CREATE OR REPLACE FUNCTION update_meal_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_meal_logs_updated_at
    BEFORE UPDATE ON meal_logs
    FOR EACH ROW EXECUTE FUNCTION update_meal_logs_updated_at();

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3b82f6',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create recipe_tags junction table
CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (recipe_id, tag_id)
);

-- Create weekly_meal_plans table
CREATE TABLE IF NOT EXISTS weekly_meal_plans (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    week_start DATE NOT NULL,
    name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(week_start)
);

-- Create meal_plan_blocks table
CREATE TABLE IF NOT EXISTS meal_plan_blocks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    weekly_plan_id BIGINT NOT NULL REFERENCES weekly_meal_plans(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_day INTEGER NOT NULL CHECK (start_day >= 0 AND start_day <= 6),
    end_day INTEGER NOT NULL CHECK (end_day >= 0 AND end_day <= 6),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (start_day <= end_day)
);

-- Create recipe_rotations table
CREATE TABLE IF NOT EXISTS recipe_rotations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    meal_plan_block_id BIGINT NOT NULL REFERENCES meal_plan_blocks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    recipe_ids BIGINT[] NOT NULL,
    rotation_order INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to estimate servings per container based on category and serving size
CREATE OR REPLACE FUNCTION estimate_servings_per_container(
    item_category TEXT,
    item_name TEXT,
    serving_quantity NUMERIC DEFAULT NULL,
    serving_unit TEXT DEFAULT NULL
) RETURNS NUMERIC AS $$
BEGIN
    -- If we already have serving quantity, use it as a base
    IF serving_quantity IS NOT NULL AND serving_quantity > 0 THEN
        -- For oils, sauces, and condiments - typically much higher servings per container
        IF item_category ILIKE '%oil%' OR item_category ILIKE '%sauce%' OR item_category ILIKE '%condiment%' THEN
            RETURN GREATEST(serving_quantity * 3, 16); -- At least 16 servings for oils/sauces
        -- For spices and seasonings - very high servings per container
        ELSIF item_category ILIKE '%spice%' OR item_category ILIKE '%seasoning%' THEN
            RETURN GREATEST(serving_quantity * 5, 32); -- At least 32 servings for spices
        -- For dairy and eggs - moderate servings
        ELSIF item_category ILIKE '%dairy%' OR item_category ILIKE '%egg%' THEN
            RETURN serving_quantity;
        -- For proteins - typically package size
        ELSIF item_category ILIKE '%protein%' OR item_name ILIKE '%chicken%' OR item_name ILIKE '%beef%' OR item_name ILIKE '%fish%' THEN
            RETURN GREATEST(serving_quantity, 4); -- At least 4 servings for proteins
        -- For grains and starches - high servings per container
        ELSIF item_category ILIKE '%grain%' OR item_category ILIKE '%starch%' OR item_name ILIKE '%rice%' OR item_name ILIKE '%flour%' THEN
            RETURN GREATEST(serving_quantity * 4, 20); -- At least 20 servings for grains
        -- Default case
        ELSE
            RETURN serving_quantity;
        END IF;
    END IF;
    
    -- Fallback estimates based on category when no serving quantity is available
    CASE 
        WHEN item_category ILIKE '%oil%' OR item_category ILIKE '%fat%' THEN
            RETURN 32; -- Oils typically have many servings (1 tbsp servings)
        WHEN item_category ILIKE '%spice%' OR item_category ILIKE '%seasoning%' THEN
            RETURN 48; -- Spices have many small servings (1 tsp servings)
        WHEN item_category ILIKE '%sauce%' OR item_category ILIKE '%condiment%' THEN
            RETURN 16; -- Sauces moderate servings (1-2 tbsp servings)
        WHEN item_category ILIKE '%dairy%' THEN
            RETURN 8; -- Dairy products like milk, yogurt
        WHEN item_category ILIKE '%egg%' THEN
            RETURN 12; -- Dozen eggs
        WHEN item_category ILIKE '%protein%' OR item_name ILIKE '%chicken%' OR item_name ILIKE '%beef%' OR item_name ILIKE '%fish%' THEN
            RETURN 4; -- Protein packages typically 4 servings
        WHEN item_category ILIKE '%grain%' OR item_category ILIKE '%starch%' OR item_name ILIKE '%rice%' OR item_name ILIKE '%flour%' THEN
            RETURN 20; -- Grains/starches have many servings
        WHEN item_category ILIKE '%vegetable%' OR item_category ILIKE '%produce%' THEN
            RETURN 4; -- Fresh vegetables typically 4 servings
        ELSE
            RETURN 1; -- Conservative default
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create function to recalculate price_per_serving when price or servings change
CREATE OR REPLACE FUNCTION recalculate_price_per_serving()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price IS NOT NULL AND NEW.price > 0 AND NEW.servings_per_container > 0 THEN
        NEW.price_per_serving = NEW.price / NEW.servings_per_container;
    ELSE
        NEW.price_per_serving = 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update price_per_serving
CREATE TRIGGER trigger_recalculate_price_per_serving
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_price_per_serving();

CREATE TRIGGER trigger_recalculate_price_per_serving_insert
    BEFORE INSERT ON items
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_price_per_serving();

-- Create unit conversion function
CREATE OR REPLACE FUNCTION convert_units(
    quantity NUMERIC,
    from_unit TEXT,
    to_unit TEXT
) RETURNS NUMERIC AS $$
DECLARE
    from_normalized TEXT;
    to_normalized TEXT;
BEGIN
    -- Normalize unit names to lowercase
    from_normalized := LOWER(TRIM(from_unit));
    to_normalized := LOWER(TRIM(to_unit));
    
    -- If units are the same, return original quantity
    IF from_normalized = to_normalized THEN
        RETURN quantity;
    END IF;
    
    -- Handle volume conversions
    -- Cup conversions
    IF from_normalized IN ('cup', 'cups') AND to_normalized IN ('cup', 'cups') THEN
        RETURN quantity;
    ELSIF from_normalized IN ('cup', 'cups') AND to_normalized = 'oz' THEN
        RETURN quantity * 8;
    ELSIF from_normalized IN ('cup', 'cups') AND to_normalized = 'ml' THEN
        RETURN quantity * 236.588;
    ELSIF from_normalized IN ('cup', 'cups') AND to_normalized = 'tbsp' THEN
        RETURN quantity * 16;
    ELSIF from_normalized IN ('cup', 'cups') AND to_normalized = 'tsp' THEN
        RETURN quantity * 48;
    
    -- Tablespoon conversions
    ELSIF from_normalized = 'tbsp' AND to_normalized IN ('cup', 'cups') THEN
        RETURN quantity * 0.0625;
    ELSIF from_normalized = 'tbsp' AND to_normalized = 'tsp' THEN
        RETURN quantity * 3;
    ELSIF from_normalized = 'tbsp' AND to_normalized = 'oz' THEN
        RETURN quantity * 0.5;
    ELSIF from_normalized = 'tbsp' AND to_normalized = 'ml' THEN
        RETURN quantity * 14.787;
    
    -- Teaspoon conversions
    ELSIF from_normalized = 'tsp' AND to_normalized = 'tbsp' THEN
        RETURN quantity * 0.333333;
    ELSIF from_normalized = 'tsp' AND to_normalized IN ('cup', 'cups') THEN
        RETURN quantity * 0.0208333;
    ELSIF from_normalized = 'tsp' AND to_normalized = 'ml' THEN
        RETURN quantity * 4.929;
    
    -- Ounce conversions
    ELSIF from_normalized = 'oz' AND to_normalized IN ('cup', 'cups') THEN
        RETURN quantity * 0.125;
    ELSIF from_normalized = 'oz' AND to_normalized = 'tbsp' THEN
        RETURN quantity * 2;
    ELSIF from_normalized = 'oz' AND to_normalized = 'g' THEN
        RETURN quantity * 28.3495;
    ELSIF from_normalized = 'oz' AND to_normalized = 'ml' THEN
        RETURN quantity * 29.5735;
    
    -- Milliliter conversions
    ELSIF from_normalized = 'ml' AND to_normalized IN ('cup', 'cups') THEN
        RETURN quantity * 0.00422675;
    ELSIF from_normalized = 'ml' AND to_normalized = 'tbsp' THEN
        RETURN quantity * 0.067628;
    ELSIF from_normalized = 'ml' AND to_normalized = 'tsp' THEN
        RETURN quantity * 0.202884;
    ELSIF from_normalized = 'ml' AND to_normalized = 'oz' THEN
        RETURN quantity * 0.033814;
    
    -- Weight conversions
    -- Gram conversions
    ELSIF from_normalized = 'g' AND to_normalized = 'oz' THEN
        RETURN quantity * 0.035274;
    ELSIF from_normalized = 'g' AND to_normalized = 'kg' THEN
        RETURN quantity * 0.001;
    ELSIF from_normalized = 'g' AND to_normalized = 'lbs' THEN
        RETURN quantity * 0.00220462;
    
    -- Kilogram conversions
    ELSIF from_normalized = 'kg' AND to_normalized = 'g' THEN
        RETURN quantity * 1000;
    ELSIF from_normalized = 'kg' AND to_normalized = 'lbs' THEN
        RETURN quantity * 2.20462;
    ELSIF from_normalized = 'kg' AND to_normalized = 'oz' THEN
        RETURN quantity * 35.274;
    
    -- Pound conversions
    ELSIF from_normalized = 'lbs' AND to_normalized = 'kg' THEN
        RETURN quantity * 0.453592;
    ELSIF from_normalized = 'lbs' AND to_normalized = 'g' THEN
        RETURN quantity * 453.592;
    ELSIF from_normalized = 'lbs' AND to_normalized = 'oz' THEN
        RETURN quantity * 16;
    
    -- Package/piece conversions
    ELSIF from_normalized IN ('piece', 'pieces') AND to_normalized IN ('piece', 'pieces') THEN
        RETURN quantity;
    ELSIF from_normalized IN ('piece', 'pieces') AND to_normalized IN ('container', 'containers') THEN
        RETURN quantity;
    ELSIF from_normalized IN ('container', 'containers') AND to_normalized IN ('piece', 'pieces') THEN
        RETURN quantity;
    ELSIF from_normalized IN ('container', 'containers') AND to_normalized IN ('container', 'containers') THEN
        RETURN quantity;
    
    -- Produce-specific conversions (approximate)
    ELSIF from_normalized = 'lb' AND to_normalized IN ('piece', 'pieces') THEN
        -- For produce, approximate 1 lb = 4 pieces (varies by item)
        RETURN quantity * 4;
    ELSIF from_normalized IN ('piece', 'pieces') AND to_normalized = 'lb' THEN
        RETURN quantity * 0.25;
    ELSIF from_normalized = 'head' AND to_normalized IN ('cup', 'cups') THEN
        -- For heads of vegetables like cauliflower: 1 head ≈ 6 cups
        RETURN quantity * 6;
    ELSIF from_normalized IN ('cup', 'cups') AND to_normalized = 'head' THEN
        RETURN quantity * 0.167;
    ELSIF from_normalized = 'bunch' AND to_normalized = 'tbsp' THEN
        -- For herbs/greens: 1 bunch ≈ 8 tbsp
        RETURN quantity * 8;
    ELSIF from_normalized = 'tbsp' AND to_normalized = 'bunch' THEN
        RETURN quantity * 0.125;
    
    -- If no conversion found, assume 1:1 ratio
    ELSE
        RETURN quantity;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate recipe cost from ingredients with proper unit conversion
CREATE OR REPLACE FUNCTION calculate_recipe_cost(p_recipe_id BIGINT)
RETURNS VOID AS $$
DECLARE
    v_total_cost NUMERIC(10,4) := 0;
    v_cost_per_serving NUMERIC(10,2) := 0;
    v_servings INT := 1;
    ingredient_record RECORD;
    v_ingredient_cost NUMERIC(10,4);
    v_converted_quantity NUMERIC(10,4);
BEGIN
    -- Get the recipe servings
    SELECT servings INTO v_servings FROM recipes WHERE id = p_recipe_id;
    
    -- Default to 1 serving if null
    IF v_servings IS NULL OR v_servings <= 0 THEN
        v_servings := 1;
    END IF;
    
    -- Calculate total cost by summing ingredient costs using price_per_serving with unit conversion
    FOR ingredient_record IN 
        SELECT 
            ri.recipe_id,
            ri.item_id,
            ri.quantity,
            ri.unit,
            COALESCE(i.price_per_serving, 0) as price_per_serving,
            i.serving_unit,
            i.name as item_name
        FROM recipe_items ri
        JOIN items i ON ri.item_id = i.id
        WHERE ri.recipe_id = p_recipe_id
    LOOP
        -- Convert the recipe quantity to match the item's serving unit
        v_converted_quantity := convert_units(
            ingredient_record.quantity,
            ingredient_record.unit,
            COALESCE(ingredient_record.serving_unit, ingredient_record.unit)
        );
        
        -- Calculate cost for this ingredient using converted quantity
        v_ingredient_cost := ingredient_record.price_per_serving * v_converted_quantity;
        
        v_total_cost := v_total_cost + v_ingredient_cost;
        
        -- Update the recipe_items table with calculated costs
        UPDATE recipe_items 
        SET 
            cost_per_unit = ingredient_record.price_per_serving,
            total_cost = v_ingredient_cost,
            cost_calculated_at = NOW(),
            updated_at = NOW()
        WHERE recipe_id = ingredient_record.recipe_id 
          AND item_id = ingredient_record.item_id;
    END LOOP;
    
    -- Calculate cost per serving
    v_cost_per_serving := v_total_cost / v_servings;
    
    -- Update the recipe with calculated costs
    UPDATE recipes 
    SET 
        total_cost = v_total_cost,
        cost_per_serving = v_cost_per_serving,
        cost_last_calculated = NOW(),
        updated_at = NOW()
    WHERE id = p_recipe_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate meal log cost from recipes
CREATE OR REPLACE FUNCTION calculate_meal_log_cost()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate cost as sum of recipe cost_per_serving values
    NEW.cost = (
        SELECT COALESCE(SUM(r.cost_per_serving), 0)
        FROM recipes r
        WHERE r.id = ANY(NEW.recipe_ids)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate cost on meal log insert/update
CREATE TRIGGER trigger_meal_log_calculate_cost
    BEFORE INSERT OR UPDATE ON meal_logs
    FOR EACH ROW
    EXECUTE FUNCTION calculate_meal_log_cost();

-- Create function to recalculate meal log costs when recipe costs change
CREATE OR REPLACE FUNCTION trigger_recalculate_meal_log_costs()
RETURNS TRIGGER AS $$
BEGIN
    -- When a recipe's cost changes, update all meal logs that use this recipe
    UPDATE meal_logs 
    SET cost = (
        SELECT COALESCE(SUM(r.cost_per_serving), 0)
        FROM recipes r
        WHERE r.id = ANY(meal_logs.recipe_ids)
    )
    WHERE NEW.id = ANY(meal_logs.recipe_ids);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to recalculate meal log costs when recipe costs are updated
CREATE TRIGGER trigger_recipe_cost_update_meal_logs
    AFTER UPDATE OF cost_per_serving ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_recalculate_meal_log_costs();

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipe_items_updated_at
    BEFORE UPDATE ON recipe_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_weekly_meal_plans_updated_at
    BEFORE UPDATE ON weekly_meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_meal_plan_blocks_updated_at
    BEFORE UPDATE ON meal_plan_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipe_rotations_updated_at
    BEFORE UPDATE ON recipe_rotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();