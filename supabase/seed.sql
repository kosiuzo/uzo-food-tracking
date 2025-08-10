-- Seed data for the food tracking app

-- Insert sample food items
INSERT INTO items (name, brand, category, in_stock, price, carbs_per_serving, fat_per_serving, protein_per_serving, servings_per_container, unit_of_measure, unit_quantity, rating, nutrition_source, last_edited) VALUES
('Chicken Breast', 'Organic Valley', 'Protein', true, 12.99, 0, 3.5, 31, 4, 'piece', 1, 5, 'manual', NOW()),
('Brown Rice', 'Uncle Bens', 'Grains', true, 4.99, 45, 1, 5, 6, 'cup', 1, 4, 'manual', NOW()),
('Broccoli', 'Fresh Market', 'Vegetables', true, 3.49, 6, 0.3, 2.5, 4, 'cup', 1, 5, 'manual', NOW()),
('Salmon', 'Wild Alaskan', 'Protein', false, 18.99, 0, 12, 22, 2, 'piece', 1, 5, 'manual', NOW()),
('Sweet Potato', 'Organic', 'Vegetables', true, 2.99, 27, 0.1, 2, 4, 'piece', 1, 4, 'manual', NOW()),
('Greek Yogurt', 'Chobani', 'Dairy', false, 5.99, 9, 0.5, 15, 6, 'cup', 1, 4, 'manual', NOW()),
('Quinoa', 'Ancient Harvest', 'Grains', false, 6.99, 39, 4, 8, 4, 'cup', 1, 3, 'manual', NOW()),
('Spinach', 'Fresh Market', 'Vegetables', true, 2.49, 1, 0.1, 0.9, 4, 'cup', 1, 5, 'manual', NOW()),
('Eggs', 'Farm Fresh', 'Protein', true, 4.99, 0.6, 5, 6, 12, 'piece', 1, 4, 'manual', NOW()),
('Avocado', 'Organic', 'Fruits', false, 1.99, 9, 15, 2, 1, 'piece', 1, 3, 'manual', NOW());

-- Insert sample recipes
INSERT INTO recipes (name, cuisine_type, meal_type, difficulty, prep_time, cook_time, total_time, servings, instructions, nutrition_per_serving, tags, rating, cost_per_serving, notes, created_at, updated_at) VALUES
('Grilled Chicken Salad', 'American', ARRAY['lunch', 'dinner'], 'Easy', 15, 20, 35, 2, '1. Season chicken breast with salt and pepper
2. Grill for 8-10 minutes per side
3. Let rest for 5 minutes
4. Slice and serve over mixed greens
5. Add your favorite vegetables and dressing', '{"calories": 350, "protein": 35, "carbs": 8, "fat": 12}', ARRAY['healthy', 'quick'], 4.5, 8.50, 'Great for meal prep', NOW(), NOW()),
('Quinoa Buddha Bowl', 'Mediterranean', ARRAY['lunch', 'dinner'], 'Medium', 20, 25, 45, 2, '1. Cook quinoa according to package instructions
2. Roast sweet potatoes and broccoli
3. Prepare tahini dressing
4. Assemble bowl with quinoa, vegetables, and dressing
5. Top with seeds and herbs', '{"calories": 420, "protein": 12, "carbs": 65, "fat": 15}', ARRAY['vegetarian', 'healthy'], 4.8, 6.75, 'Perfect for vegetarian meals', NOW(), NOW()),
('Greek Yogurt Parfait', 'Mediterranean', ARRAY['breakfast'], 'Easy', 5, 0, 5, 1, '1. Layer Greek yogurt in a glass
2. Add fresh berries
3. Sprinkle with granola
4. Drizzle with honey
5. Serve immediately', '{"calories": 280, "protein": 18, "carbs": 35, "fat": 8}', ARRAY['breakfast', 'quick'], 4.2, 3.25, 'Quick and nutritious breakfast', NOW(), NOW()),
('Salmon with Roasted Vegetables', 'Mediterranean', ARRAY['dinner'], 'Medium', 15, 25, 40, 2, '1. Preheat oven to 400F
2. Season salmon with herbs and lemon
3. Arrange vegetables on baking sheet
4. Roast salmon and vegetables for 20-25 minutes
5. Serve with lemon wedges', '{"calories": 380, "protein": 28, "carbs": 15, "fat": 18}', ARRAY['healthy', 'omega-3'], 4.6, 12.50, 'Rich in omega-3 fatty acids', NOW(), NOW()),
('Spinach and Egg Breakfast', 'American', ARRAY['breakfast'], 'Easy', 10, 8, 18, 1, '1. Saute spinach in olive oil
2. Crack eggs over spinach
3. Cook until whites are set
4. Season with salt and pepper
5. Serve with whole grain toast', '{"calories": 220, "protein": 14, "carbs": 6, "fat": 12}', ARRAY['breakfast', 'protein'], 4.0, 4.25, 'High protein breakfast option', NOW(), NOW());

-- Insert recipe ingredients (linking recipes to items)
INSERT INTO recipe_items (recipe_id, item_id, quantity, unit) VALUES
-- Grilled Chicken Salad
(1, 1, 2, 'piece'), -- Chicken Breast
(1, 3, 2, 'cup'),   -- Broccoli
-- Quinoa Buddha Bowl
(2, 7, 1, 'cup'),   -- Quinoa
(2, 5, 1, 'piece'), -- Sweet Potato
(2, 3, 1, 'cup'),   -- Broccoli
-- Greek Yogurt Parfait
(3, 6, 1, 'cup'),   -- Greek Yogurt
-- Salmon with Roasted Vegetables
(4, 4, 2, 'piece'), -- Salmon
(4, 3, 2, 'cup'),   -- Broccoli
(4, 5, 1, 'piece'), -- Sweet Potato
-- Spinach and Egg Breakfast
(5, 8, 2, 'cup'),   -- Spinach
(5, 9, 2, 'piece'); -- Eggs

-- Insert sample meal logs
INSERT INTO meal_logs (recipe_id, cooked_at, notes, rating, macros, cost, created_at) VALUES
(1, '2024-01-15', 'Delicious and filling!', 4.5, '{"calories": 350, "protein": 35, "carbs": 8, "fat": 12}', 8.50, NOW()),
(2, '2024-01-14', 'Great vegetarian option', 4.8, '{"calories": 420, "protein": 12, "carbs": 65, "fat": 15}', 6.75, NOW()),
(3, '2024-01-13', 'Perfect quick breakfast', 4.2, '{"calories": 280, "protein": 18, "carbs": 35, "fat": 8}', 3.25, NOW()),
(4, '2024-01-12', 'Rich in omega-3s', 4.6, '{"calories": 380, "protein": 28, "carbs": 15, "fat": 18}', 12.50, NOW()),
(5, '2024-01-11', 'High protein start to the day', 4.0, '{"calories": 220, "protein": 14, "carbs": 6, "fat": 12}', 4.25, NOW());

-- Insert sample meal plans
INSERT INTO meal_plans (date, meal_type, recipe_id, created_at) VALUES
('2024-01-16', 'breakfast', 3, NOW()),
('2024-01-16', 'lunch', 1, NOW()),
('2024-01-16', 'dinner', 4, NOW()),
('2024-01-17', 'breakfast', 5, NOW()),
('2024-01-17', 'lunch', 2, NOW()),
('2024-01-18', 'breakfast', 3, NOW()),
('2024-01-18', 'dinner', 1, NOW());