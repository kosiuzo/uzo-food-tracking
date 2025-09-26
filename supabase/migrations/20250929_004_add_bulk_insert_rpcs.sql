-- Add bulk insert RPC functions for recipes, meal_logs, and items
-- These functions allow efficient bulk insertion operations for PostgreSQL interactions

-- Bulk insert items RPC
CREATE OR REPLACE FUNCTION bulk_insert_items(items_data JSONB)
RETURNS SETOF items AS $$
DECLARE
    item_record JSONB;
    inserted_item items%ROWTYPE;
BEGIN
    -- Iterate through each item in the JSON array
    FOR item_record IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
        INSERT INTO items (
            name,
            brand,
            category,
            image_url,
            ingredients,
            purchase_count,
            rating,
            notes,
            user_id
        ) VALUES (
            (item_record->>'name')::TEXT,
            (item_record->>'brand')::TEXT,
            (item_record->>'category')::TEXT,
            (item_record->>'image_url')::TEXT,
            (item_record->>'ingredients')::TEXT,
            COALESCE((item_record->>'purchase_count')::INTEGER, 0),
            (item_record->>'rating')::INTEGER,
            COALESCE((item_record->'notes')::JSONB, '[]'::JSONB),
            COALESCE((item_record->>'user_id')::UUID, auth.uid())
        )
        RETURNING * INTO inserted_item;

        RETURN NEXT inserted_item;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bulk insert recipes RPC
CREATE OR REPLACE FUNCTION bulk_insert_recipes(recipes_data JSONB)
RETURNS SETOF recipes AS $$
DECLARE
    recipe_record JSONB;
    inserted_recipe recipes%ROWTYPE;
BEGIN
    -- Iterate through each recipe in the JSON array
    FOR recipe_record IN SELECT * FROM jsonb_array_elements(recipes_data)
    LOOP
        INSERT INTO recipes (
            name,
            total_time,
            servings,
            instructions,
            nutrition_per_serving,
            is_favorite,
            source_link,
            notes,
            times_cooked,
            last_cooked,
            ingredient_list,
            nutrition_source,
            feedback,
            user_id,
            tags
        ) VALUES (
            (recipe_record->>'name')::TEXT,
            (recipe_record->>'total_time')::INTEGER,
            (recipe_record->>'servings')::INTEGER,
            (recipe_record->>'instructions')::TEXT,
            (recipe_record->'nutrition_per_serving')::JSONB,
            COALESCE((recipe_record->>'is_favorite')::BOOLEAN, false),
            (recipe_record->>'source_link')::TEXT,
            (recipe_record->>'notes')::TEXT,
            COALESCE((recipe_record->>'times_cooked')::INTEGER, 0),
            (recipe_record->>'last_cooked')::TIMESTAMP,
            CASE
                WHEN recipe_record->'ingredient_list' IS NOT NULL
                THEN ARRAY(SELECT jsonb_array_elements_text(recipe_record->'ingredient_list'))
                ELSE NULL
            END,
            COALESCE((recipe_record->>'nutrition_source')::VARCHAR(20), 'calculated'),
            (recipe_record->'feedback')::JSONB,
            COALESCE((recipe_record->>'user_id')::UUID, auth.uid()),
            CASE
                WHEN recipe_record->'tags' IS NOT NULL
                THEN ARRAY(SELECT jsonb_array_elements_text(recipe_record->'tags'))
                ELSE '{}'::TEXT[]
            END
        )
        RETURNING * INTO inserted_recipe;

        RETURN NEXT inserted_recipe;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bulk insert meal_logs RPC
CREATE OR REPLACE FUNCTION bulk_insert_meal_logs(meal_logs_data JSONB)
RETURNS SETOF meal_logs AS $$
DECLARE
    meal_log_record JSONB;
    inserted_meal_log meal_logs%ROWTYPE;
BEGIN
    -- Iterate through each meal log in the JSON array
    FOR meal_log_record IN SELECT * FROM jsonb_array_elements(meal_logs_data)
    LOOP
        INSERT INTO meal_logs (
            meal_name,
            notes,
            rating,
            macros,
            items,
            eaten_on,
            user_id
        ) VALUES (
            (meal_log_record->>'meal_name')::TEXT,
            (meal_log_record->>'notes')::TEXT,
            (meal_log_record->>'rating')::NUMERIC(2,1),
            COALESCE((meal_log_record->'macros')::JSONB, '{}'::JSONB),
            CASE
                WHEN meal_log_record->'items' IS NOT NULL
                THEN ARRAY(SELECT jsonb_array_elements_text(meal_log_record->'items'))
                ELSE '{}'::TEXT[]
            END,
            (meal_log_record->>'eaten_on')::DATE,
            COALESCE((meal_log_record->>'user_id')::UUID, auth.uid())
        )
        RETURNING * INTO inserted_meal_log;

        RETURN NEXT inserted_meal_log;
    END LOOP;

    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION bulk_insert_items(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_insert_recipes(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_insert_meal_logs(JSONB) TO authenticated;

-- Grant execute permissions to anon users (for compatibility with current RLS policies)
GRANT EXECUTE ON FUNCTION bulk_insert_items(JSONB) TO anon;
GRANT EXECUTE ON FUNCTION bulk_insert_recipes(JSONB) TO anon;
GRANT EXECUTE ON FUNCTION bulk_insert_meal_logs(JSONB) TO anon;