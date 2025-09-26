-- Simplified seed data for the food tracking app (after schema simplification)

-- Insert simplified food inventory
INSERT INTO items (name, brand, category, image_url, ingredients, rating, purchase_count, last_edited) VALUES
('Thai Jasmine Rice, 25 lb.', 'Member''s Mark', 'Grains & Starches', 'https://images.openfoodfacts.org/images/products/019/396/814/8096/front_en.3.400.jpg', 'Long grain jasmine rice', NULL, 5, '2025-01-15 10:00:00'),
('100% Pure Olive Oil, 101 fl oz', 'Member''s Mark', 'Oils & Fats', NULL, 'Olive oil', NULL, 3, '2025-01-15 10:00:00'),
('Organic Virgin Coconut Oil, 56 oz', 'Member''s Mark Organic', 'Oils & Fats', NULL, 'Organic pure virgin unrefined coconut oil', NULL, 2, '2025-01-15 10:00:00'),
('Raw and Unfiltered Honey, 32 oz', 'Nature''s Nate Honey Co.', 'Condiments & Sauces', NULL, 'Raw unfiltered honey', NULL, 4, '2025-01-15 10:00:00'),
('Organic 100% Pure Maple Syrup, 32 oz', 'Member''s Mark Organic', 'Condiments & Sauces', NULL, 'Organic maple syrup', NULL, 3, '2025-01-15 10:00:00'),
('Boneless and Skinless Chicken Breasts, 3 lb', 'Member''s Mark', 'Proteins', NULL, 'Boneless skinless chicken breasts', NULL, 6, '2025-01-15 10:00:00'),
('Organic Ground Beef 85% Lean, 1 lb', 'Member''s Mark Organic', 'Proteins', NULL, 'Organic ground beef', NULL, 4, '2025-01-15 10:00:00'),
('Fresh Atlantic Salmon Fillets, 2 lb', 'Member''s Mark', 'Proteins', NULL, 'Atlantic salmon fillets', NULL, 2, '2025-01-15 10:00:00'),
('Organic Whole Milk, 1 gallon', 'Member''s Mark Organic', 'Dairy', NULL, 'Organic whole milk', NULL, 8, '2025-01-15 10:00:00'),
('Organic Large Brown Eggs, 24 count', 'Member''s Mark Organic', 'Proteins', NULL, 'Organic brown eggs', NULL, 12, '2025-01-15 10:00:00');

-- Insert sample recipes with ingredient lists and tags (simplified)
INSERT INTO recipes (name, instructions, servings, ingredient_list, tags, nutrition_source) VALUES
('Tzatziki', 'Mix yogurt with diced cucumber, garlic powder, lemon juice, and olive oil. Season with salt and pepper.', 4, ARRAY['1 container Plain Nonfat Greek Yogurt', '1 lb Fresh Cucumber', '1 tbsp Fresh Dill', '1 tbsp Fresh Lemon Juice', '2 tbsp Olive Oil', '1 tsp Black Pepper', '1.5 tsp Garlic Powder'], ARRAY['sauce'], 'ai_generated'),
('Coconut Aminos Sauce', 'Whisk together coconut aminos, apple cider vinegar, honey, garlic powder, ginger, and red pepper flakes.', 2, ARRAY['0.25 cup Coconut Aminos', '0.25 cup Apple Cider Vinegar', '1 tbsp Raw Honey', '0.25 tsp Garlic Powder', '0.25 tsp Ground Ginger', '0.5 tsp Red Pepper Flakes'], ARRAY['sauce'], 'ai_generated'),
('Reverse Sear Steak', 'Season steak with salt and pepper. Reverse sear in oven then finish on high heat.', 2, ARRAY['1 piece Prime Beef Strip Steak', '1 tsp Himalayan Pink Salt', '0.5 tsp Black Pepper'], ARRAY['beef'], 'ai_generated'),
('Paleo Fried Chicken', 'Crispy fried chicken with almond flour coating.', 4, ARRAY['2 lbs Chicken Thighs', '1 cup Almond Flour', '1 tsp Paprika'], ARRAY['chicken', 'baking'], 'ai_generated'),
('Classic Guacamole', 'Fresh avocado dip with lime and cilantro.', 6, ARRAY['4 Avocados', '2 Limes', '1/4 cup Cilantro', '1 Jalapeno'], ARRAY['sauce'], 'ai_generated');

-- Insert sample meal logs
INSERT INTO meal_logs (meal_name, items, eaten_on) VALUES
('Breakfast Bowl', ARRAY['Organic Whole Milk', 'Organic Large Brown Eggs'], '2025-01-15'),
('Grilled Chicken Dinner', ARRAY['Boneless and Skinless Chicken Breasts', 'Thai Jasmine Rice'], '2025-01-14'),
('Salmon with Honey Glaze', ARRAY['Fresh Atlantic Salmon Fillets', 'Raw and Unfiltered Honey'], '2025-01-13');