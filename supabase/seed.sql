-- Seed data for the food tracking app

-- Insert food items (simplified for initial setup)
INSERT INTO items (name, brand, category, in_stock, price, carbs_per_serving, fat_per_serving, protein_per_serving, servings_per_container, serving_size_grams, serving_quantity, serving_unit, serving_unit_type, image_url, ingredients, rating, nutrition_source, last_edited) VALUES
-- Key volume-based items for testing conversions
('Thai Jasmine Rice', 'Member''s Mark', 'Grains & Starches', true, 18.98, 34.9, 0.4, 3.2, 200, 45, 0.25, 'cup', 'volume', NULL, 'Jasmine rice', 4, 'manual', NOW()),
('Olive Oil', 'Member''s Mark', 'Oils & Fats', true, 18.98, 0, 14, 0, 101, 14, 1, 'tbsp', 'volume', NULL, 'Olive oil', 4, 'manual', NOW()),
('Coconut Oil', 'Member''s Mark Organic', 'Oils & Fats', true, 10.98, 0, 14, 0, 112, 14, 1, 'tbsp', 'volume', NULL, 'Organic pure virgin unrefined coconut oil', 5, 'manual', NOW()),
('Honey', 'Nature''s Nate', 'Condiments & Sauces', true, 13.98, 17, 0, 0, 50, 21, 1, 'tbsp', 'volume', NULL, 'Raw unfiltered honey', 5, 'manual', NOW()),
('Maple Syrup', 'Member''s Mark Organic', 'Condiments & Sauces', true, 11.98, 13, 0, 0, 64, 20, 1, 'tbsp', 'volume', NULL, 'Organic maple syrup', 4, 'manual', NOW()),
-- Package-based items
('Chicken Breast', 'Member''s Mark', 'Proteins', true, 21.11, 0, 3.6, 31, 8, 113, 1, 'piece', 'package', NULL, 'Boneless skinless chicken breasts', 5, 'manual', NOW()),
('Eggs', 'Member''s Mark Organic', 'Dairy & Eggs', true, 7.00, 0.4, 5, 6, 12, 50, 1, 'piece', 'package', NULL, 'Pasture-raised eggs', 5, 'manual', NOW()),
('Salmon Fillet', 'Member''s Mark', 'Proteins', true, 23.94, 0, 6.4, 20, 8, 113, 1, 'piece', 'package', NULL, 'Atlantic salmon fillet', 5, 'manual', NOW()),
-- Weight-based items
('Ground Beef', 'Member''s Mark', 'Proteins', true, 17.94, 0, 15.0, 18.6, 8, 100, 100, 'g', 'weight', NULL, 'Ground beef (85% lean, 15% fat)', 5, 'manual', NOW()),
('Parmesan Cheese', 'Kroger', 'Dairy & Eggs', true, 4.99, 4, 28.6, 38.4, 50, 100, 28, 'g', 'weight', NULL, 'Parmigiano Reggiano cheese', 5, 'manual', NOW()),
-- Items without serving unit data (legacy)
('Avocados', 'Member''s Mark', 'Fruits', true, 4.48, 8.5, 14.7, 2, 5, 100, NULL, NULL, NULL, NULL, 'Avocados', 5, 'manual', NOW()),
('Bananas', 'Chiquita', 'Fruits', true, 1.97, 22.8, 0.3, 1.1, 12, 100, NULL, NULL, NULL, NULL, 'Bananas', 4, 'manual', NOW()),
('Spinach', 'Kroger', 'Vegetables', true, 2.49, 2.08, 0.14, 0.69, 4, 100, NULL, NULL, NULL, NULL, 'Fresh spinach', 4, 'manual', NOW()),
('Broccoli', 'Kroger', 'Vegetables', true, 3.99, 6.04, 0.34, 1.01, 1, 100, NULL, NULL, NULL, NULL, 'Fresh broccoli', 4, 'manual', NOW()),
('Greek Yogurt', 'Member''s Mark', 'Dairy & Eggs', true, 4.28, 3.59, 0.39, 10.18, 1, 100, NULL, NULL, NULL, NULL, 'Nonfat Greek yogurt', 4, 'manual', NOW()),
('Salt', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0, 0, 0, 200, 100, NULL, NULL, NULL, NULL, 'Pink Himalayan salt', 5, 'manual', NOW()),
('Black Pepper', 'Member''s Mark', 'Seasonings & Spices', true, 8.50, 64.0, 3.3, 10.4, 200, 100, NULL, NULL, NULL, NULL, 'Ground black pepper', 4, 'manual', NOW()),
('Garlic Powder', 'Member''s Mark', 'Seasonings & Spices', true, 8.00, 73.0, 0.7, 16.0, 200, 100, NULL, NULL, NULL, NULL, 'Ground garlic', 4, 'manual', NOW()),
-- Additional items for meal planning
('Bacon', 'Member''s Mark', 'Proteins', true, 12.99, 0, 12, 8, 12, 15, 1, 'slice', 'package', NULL, 'Thick cut bacon', 5, 'manual', NOW()),
('Lettuce', 'Kroger', 'Vegetables', true, 2.99, 2.9, 0.2, 1.4, 1, 100, NULL, NULL, NULL, NULL, 'Romaine lettuce', 4, 'manual', NOW()),
('Guacamole', 'Member''s Mark', 'Condiments & Sauces', true, 5.99, 4, 8, 2, 8, 30, 2, 'tbsp', 'volume', NULL, 'Fresh guacamole', 5, 'manual', NOW()),
('Cabbage', 'Kroger', 'Vegetables', true, 1.99, 5.8, 0.1, 1.3, 1, 100, NULL, NULL, NULL, NULL, 'Green cabbage', 4, 'manual', NOW()),
('Protein Bar', 'Member''s Mark', 'Snacks', true, 15.99, 25, 8, 20, 12, 60, 1, 'piece', 'package', NULL, 'High protein bar', 4, 'manual', NOW()),
('Mixed Nuts', 'Member''s Mark', 'Snacks', true, 12.99, 8, 16, 6, 20, 28, 0.25, 'cup', 'volume', NULL, 'Mixed nuts and seeds', 5, 'manual', NOW()),
('Berries', 'Member''s Mark', 'Fruits', true, 8.99, 15, 0.5, 1, 1, 100, NULL, NULL, NULL, NULL, 'Mixed berries', 5, 'manual', NOW());

-- Insert sample recipes with volume-based measurements
INSERT INTO recipes (name, cuisine_type, meal_type, difficulty, prep_time, cook_time, total_time, servings, instructions, nutrition_per_serving, tags, rating, cost_per_serving, total_cost, cost_last_calculated, notes, created_at, updated_at) VALUES
('Coconut Rice', 'Asian', ARRAY['dinner'], 'Easy', 5, 25, 30, 4, '1. Rinse rice until water runs clear
2. Heat coconut oil in a pot
3. Add rice and toast for 2 minutes
4. Add water and salt
5. Bring to boil, then simmer covered for 18 minutes
6. Let rest 5 minutes before fluffing', '{"calories": 220, "protein": 4, "carbs": 45, "fat": 3}', ARRAY['asian', 'side'], 4.5, 1.25, 5.00, NOW(), 'Perfect with curry or stir-fry', NOW(), NOW()),
('Honey Glazed Chicken', 'American', ARRAY['lunch', 'dinner'], 'Medium', 10, 20, 30, 2, '1. Season chicken with salt and pepper
2. Heat olive oil in pan
3. Cook chicken 6-7 minutes per side
4. Add honey glaze in last 2 minutes
5. Rest for 5 minutes before serving', '{"calories": 380, "protein": 35, "carbs": 18, "fat": 12}', ARRAY['protein', 'sweet'], 4.8, 8.50, 17.00, NOW(), 'Great for meal prep', NOW(), NOW()),
('Simple Scrambled Eggs', 'American', ARRAY['breakfast'], 'Easy', 2, 5, 7, 1, '1. Heat olive oil in pan over medium heat
2. Crack eggs into bowl and whisk
3. Add to pan and gently scramble
4. Season with salt and pepper
5. Serve immediately', '{"calories": 180, "protein": 12, "carbs": 2, "fat": 14}', ARRAY['breakfast', 'quick'], 4.0, 1.50, 1.50, NOW(), 'Perfect protein breakfast', NOW(), NOW()),
-- Additional recipes for meal planning
('Salmon & Eggs with Salsa', 'American', ARRAY['breakfast', 'lunch'], 'Medium', 10, 15, 25, 2, '1. Season salmon with salt and pepper
2. Cook salmon in olive oil 4-5 minutes per side
3. Scramble eggs in same pan
4. Serve with fresh salsa', '{"calories": 420, "protein": 38, "carbs": 8, "fat": 26}', ARRAY['protein', 'breakfast'], 4.7, 12.50, 25.00, NOW(), 'High protein breakfast', NOW(), NOW()),
('Chicken Breast with Orange Sauce', 'Asian', ARRAY['lunch', 'dinner'], 'Medium', 15, 20, 35, 2, '1. Season chicken with salt and pepper
2. Cook chicken in olive oil 6-7 minutes per side
3. Prepare orange sauce with honey and garlic
4. Glaze chicken with sauce', '{"calories": 350, "protein": 35, "carbs": 15, "fat": 18}', ARRAY['protein', 'asian'], 4.6, 9.00, 18.00, NOW(), 'Sweet and savory', NOW(), NOW()),
('Steak with Honey and Garlic Sauce', 'American', ARRAY['dinner'], 'Medium', 10, 15, 25, 2, '1. Season steak with salt and pepper
2. Cook steak to desired doneness
3. Prepare honey garlic sauce
4. Serve with sauce drizzled on top', '{"calories": 450, "protein": 40, "carbs": 12, "fat": 28}', ARRAY['protein', 'steak'], 4.8, 15.00, 30.00, NOW(), 'Restaurant quality', NOW(), NOW()),
('Ground Beef with Bacon and Guacamole', 'Mexican', ARRAY['lunch', 'dinner'], 'Easy', 10, 20, 30, 2, '1. Cook bacon until crispy
2. Cook ground beef in bacon fat
3. Season with salt and pepper
4. Serve with guacamole and lettuce', '{"calories": 520, "protein": 42, "carbs": 6, "fat": 38}', ARRAY['protein', 'mexican'], 4.5, 11.00, 22.00, NOW(), 'Keto friendly', NOW(), NOW());

-- Insert recipe ingredients with volume measurements
INSERT INTO recipe_items (recipe_id, item_id, quantity, unit, cost_per_unit, total_cost, cost_calculated_at) VALUES
-- Coconut Rice
(1, 1, 1, 'cup', 0.10, 0.40, NOW()),    -- Rice (1 cup)
(1, 3, 2, 'tbsp', 0.15, 0.30, NOW()),   -- Coconut Oil (2 tbsp)
-- Honey Glazed Chicken  
(2, 6, 2, 'piece', 6.00, 12.00, NOW()), -- Chicken Breast (2 pieces)
(2, 2, 1, 'tbsp', 0.20, 0.20, NOW()),   -- Olive Oil (1 tbsp)
(2, 4, 2, 'tbsp', 0.30, 0.60, NOW()),   -- Honey (2 tbsp)
-- Simple Scrambled Eggs
(3, 7, 2, 'piece', 0.50, 1.00, NOW()),  -- Eggs (2 pieces)
(3, 2, 1, 'tsp', 0.05, 0.05, NOW()),    -- Olive Oil (1 tsp)
-- Salmon & Eggs with Salsa
(4, 8, 2, 'piece', 3.00, 6.00, NOW()),  -- Salmon (2 pieces)
(4, 7, 4, 'piece', 0.50, 2.00, NOW()),  -- Eggs (4 pieces)
(4, 2, 1, 'tbsp', 0.20, 0.20, NOW()),   -- Olive Oil (1 tbsp)
-- Chicken Breast with Orange Sauce
(5, 6, 2, 'piece', 6.00, 12.00, NOW()), -- Chicken Breast (2 pieces)
(5, 2, 1, 'tbsp', 0.20, 0.20, NOW()),   -- Olive Oil (1 tbsp)
(5, 4, 2, 'tbsp', 0.30, 0.60, NOW()),   -- Honey (2 tbsp)
-- Steak with Honey and Garlic Sauce
(6, 9, 200, 'g', 0.18, 36.00, NOW()),   -- Ground Beef (200g)
(6, 4, 2, 'tbsp', 0.30, 0.60, NOW()),   -- Honey (2 tbsp)
(6, 2, 1, 'tbsp', 0.20, 0.20, NOW()),   -- Olive Oil (1 tbsp)
-- Ground Beef with Bacon and Guacamole
(7, 9, 200, 'g', 0.18, 36.00, NOW()),   -- Ground Beef (200g)
(7, 20, 4, 'slice', 1.08, 4.32, NOW()), -- Bacon (4 slices)
(7, 22, 4, 'tbsp', 0.75, 3.00, NOW());  -- Guacamole (4 tbsp)

-- Insert sample meal logs
INSERT INTO meal_logs (recipe_id, cooked_at, notes, rating, macros, cost, created_at) VALUES
(1, '2024-01-15', 'Perfect fluffy rice!', 4.5, '{"calories": 220, "protein": 4, "carbs": 45, "fat": 3}', 1.25, NOW()),
(2, '2024-01-14', 'Sweet and savory combo', 4.8, '{"calories": 380, "protein": 35, "carbs": 18, "fat": 12}', 8.50, NOW()),
(3, '2024-01-13', 'Quick protein breakfast', 4.0, '{"calories": 180, "protein": 12, "carbs": 2, "fat": 14}', 1.50, NOW());

-- Insert sample weekly meal plan
INSERT INTO weekly_meal_plans (week_start, created_at) VALUES
('2024-01-15', NOW());

-- Insert meal plan blocks
INSERT INTO meal_plan_blocks (weekly_plan_id, name, start_day, end_day, created_at) VALUES
(1, 'Mon-Wed Block', 0, 2, NOW()),
(1, 'Thu-Sat Block', 3, 5, NOW());

-- Insert recipe rotations
INSERT INTO recipe_rotations (block_id, name, notes, created_at) VALUES
(1, 'Rotation 1', 'Salmon & eggs with salsa', NOW()),
(1, 'Rotation 2', 'Chicken breast with orange chicken sauce, and broccoli', NOW()),
(2, 'Rotation 1', 'Steak with honey and garlic sauce, cabbage', NOW()),
(2, 'Rotation 2', 'Ground beef, bacon, lettuce, and guacamole', NOW());

-- Assign recipes to rotations
INSERT INTO rotation_recipes (rotation_id, recipe_id, created_at) VALUES
(1, 4, NOW()),  -- Salmon & Eggs with Salsa
(2, 5, NOW()),  -- Chicken Breast with Orange Sauce
(3, 6, NOW()),  -- Steak with Honey and Garlic Sauce
(4, 7, NOW());  -- Ground Beef with Bacon and Guacamole

-- We don't have snack recipes defined yet, so commenting out snacks for now
-- INSERT INTO block_snacks (block_id, recipe_id, created_at) VALUES
-- (1, recipe_id_for_protein_bar, NOW()),
-- (1, recipe_id_for_mixed_nuts, NOW()),
-- (2, recipe_id_for_berries, NOW()),
-- (2, recipe_id_for_greek_yogurt, NOW());