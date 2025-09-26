-- Seed data for testing analytics cache system
-- Creates 20 realistic meal logs spread across different dates
-- This will trigger the analytics cache to populate with test data

-- Use existing user ID from the database
DO $$
DECLARE
    test_user_id UUID := 'e57888be-f990-4cd4-85ad-a519be335938';
BEGIN
    -- Insert 20 meal logs across the last 3 weeks with realistic variety

    -- Week 1 (most recent week) - 7 meals
    INSERT INTO meal_logs (meal_name, macros, eaten_on, items, user_id) VALUES
    ('Overnight Oats with Berries', '{"calories": 380, "protein": 15, "carbs": 62, "fat": 8}', CURRENT_DATE, ARRAY['oats', 'blueberries', 'almond milk', 'chia seeds'], test_user_id),
    ('Grilled Chicken Salad', '{"calories": 420, "protein": 35, "carbs": 18, "fat": 22}', CURRENT_DATE, ARRAY['chicken breast', 'mixed greens', 'olive oil', 'tomatoes'], test_user_id),
    ('Salmon with Quinoa', '{"calories": 540, "protein": 42, "carbs": 38, "fat": 24}', CURRENT_DATE - 1, ARRAY['salmon fillet', 'quinoa', 'broccoli', 'lemon'], test_user_id),
    ('Greek Yogurt Parfait', '{"calories": 280, "protein": 20, "carbs": 35, "fat": 6}', CURRENT_DATE - 1, ARRAY['greek yogurt', 'granola', 'strawberries', 'honey'], test_user_id),
    ('Turkey Sandwich', '{"calories": 450, "protein": 28, "carbs": 48, "fat": 16}', CURRENT_DATE - 2, ARRAY['whole wheat bread', 'turkey', 'avocado', 'lettuce'], test_user_id),
    ('Protein Smoothie', '{"calories": 320, "protein": 25, "carbs": 28, "fat": 12}', CURRENT_DATE - 2, ARRAY['protein powder', 'banana', 'spinach', 'almond butter'], test_user_id),
    ('Beef Stir Fry', '{"calories": 480, "protein": 32, "carbs": 35, "fat": 22}', CURRENT_DATE - 3, ARRAY['lean beef', 'mixed vegetables', 'brown rice', 'soy sauce'], test_user_id),

    -- Week 2 - 7 meals
    ('Avocado Toast', '{"calories": 350, "protein": 12, "carbs": 32, "fat": 20}', CURRENT_DATE - 7, ARRAY['sourdough bread', 'avocado', 'eggs', 'tomato'], test_user_id),
    ('Chicken Caesar Wrap', '{"calories": 520, "protein": 38, "carbs": 42, "fat": 24}', CURRENT_DATE - 7, ARRAY['tortilla', 'chicken', 'romaine', 'caesar dressing'], test_user_id),
    ('Lentil Soup', '{"calories": 290, "protein": 18, "carbs": 45, "fat": 4}', CURRENT_DATE - 8, ARRAY['red lentils', 'vegetables', 'vegetable broth', 'herbs'], test_user_id),
    ('Tuna Poke Bowl', '{"calories": 460, "protein": 35, "carbs": 52, "fat": 12}', CURRENT_DATE - 9, ARRAY['ahi tuna', 'sushi rice', 'edamame', 'cucumber'], test_user_id),
    ('Egg White Omelet', '{"calories": 180, "protein": 24, "carbs": 8, "fat": 6}', CURRENT_DATE - 10, ARRAY['egg whites', 'mushrooms', 'spinach', 'cheese'], test_user_id),
    ('Pasta Primavera', '{"calories": 420, "protein": 16, "carbs": 68, "fat": 12}', CURRENT_DATE - 11, ARRAY['whole wheat pasta', 'mixed vegetables', 'olive oil', 'parmesan'], test_user_id),
    ('Grilled Fish Tacos', '{"calories": 380, "protein": 28, "carbs": 36, "fat": 16}', CURRENT_DATE - 12, ARRAY['white fish', 'corn tortillas', 'cabbage slaw', 'lime'], test_user_id),

    -- Week 3 - 6 meals
    ('Quinoa Buddha Bowl', '{"calories": 510, "protein": 22, "carbs": 64, "fat": 20}', CURRENT_DATE - 14, ARRAY['quinoa', 'chickpeas', 'roasted vegetables', 'tahini'], test_user_id),
    ('Chicken Noodle Soup', '{"calories": 260, "protein": 18, "carbs": 28, "fat": 8}', CURRENT_DATE - 15, ARRAY['chicken broth', 'egg noodles', 'chicken', 'carrots'], test_user_id),
    ('Veggie Burger', '{"calories": 390, "protein": 20, "carbs": 45, "fat": 16}', CURRENT_DATE - 16, ARRAY['black bean patty', 'whole wheat bun', 'lettuce', 'tomato'], test_user_id),
    ('Protein Pancakes', '{"calories": 340, "protein": 28, "carbs": 32, "fat": 12}', CURRENT_DATE - 17, ARRAY['protein powder', 'oats', 'banana', 'almond milk'], test_user_id),
    ('Mediterranean Salad', '{"calories": 420, "protein": 14, "carbs": 28, "fat": 30}', CURRENT_DATE - 18, ARRAY['mixed greens', 'olives', 'feta cheese', 'olive oil'], test_user_id),
    ('Baked Sweet Potato', '{"calories": 280, "protein": 8, "carbs": 58, "fat": 4}', CURRENT_DATE - 19, ARRAY['sweet potato', 'black beans', 'salsa', 'greek yogurt'], test_user_id);

    RAISE NOTICE 'Successfully inserted 20 meal logs for user %', test_user_id;
    RAISE NOTICE 'Analytics cache tables should now be populated automatically via triggers';
END $$;