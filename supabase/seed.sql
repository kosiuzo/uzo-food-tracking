-- Seed data for the food tracking app

-- Insert comprehensive food inventory from CSV
INSERT INTO items (name, brand, category, in_stock, price, carbs_per_serving, fat_per_serving, protein_per_serving, servings_per_container, serving_size_grams, serving_quantity, serving_unit, serving_unit_type, image_url, ingredients, rating, nutrition_source, barcode, last_purchased, purchase_count, last_edited) VALUES
('Thai Jasmine Rice, 25 lb.', 'Member''s Mark', 'Grains & Starches', true, 18.98, 42, 0, 3, 200, 50, 0.25, 'cup', 'volume', 'https://images.openfoodfacts.org/images/products/019/396/814/8096/front_en.3.400.jpg', 'Long grain jasmine rice', 4, 'openfoodfacts', '0193968148096', '2025-01-15', 5, '2025-01-15 10:00:00'),
('100% Pure Olive Oil, 101 fl oz', 'Member''s Mark', 'Oils & Fats', true, 18.98, 0, 14, 0, 101, 14, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Olive oil', 4, 'manual', '1234567890124', '2025-01-14', 3, '2025-01-15 10:00:00'),
('Organic Virgin Coconut Oil, 56 oz', 'Member''s Mark Organic', 'Oils & Fats', true, 10.98, 0, 14, 0, 112, 14, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Organic pure virgin unrefined coconut oil', 5, 'manual', '1234567890125', '2025-01-13', 2, '2025-01-15 10:00:00'),
('Raw and Unfiltered Honey, 32 oz', 'Nature''s Nate Honey Co.', 'Condiments & Sauces', true, 13.98, 17, 0, 0, 50, 21, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Raw unfiltered honey', 5, 'manual', '1234567890126', '2025-01-12', 4, '2025-01-15 10:00:00'),
('Organic 100% Pure Maple Syrup, 32 oz', 'Member''s Mark Organic', 'Condiments & Sauces', true, 11.98, 13, 0, 0, 64, 20, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Organic maple syrup', 4, 'manual', '1234567890127', '2025-01-11', 3, '2025-01-15 10:00:00'),
('Boneless and Skinless Chicken Breasts, 3 lb', 'Member''s Mark', 'Proteins', true, 21.11, 0, 3.6, 31, 8, 113, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Boneless skinless chicken breasts', 5, 'manual', '1234567890128', '2025-01-14', 6, '2025-01-15 10:00:00'),
('Organic Pasture Raised Eggs, 12 ct', 'Member''s Mark Organic', 'Dairy & Eggs', true, 7.00, 0.6, 5.4, 7.5, 12, 68, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'Pasture-raised eggs', 5, 'manual', '1234567890129', '2025-01-13', 8, '2025-01-15 10:00:00'),
('Skinless and Boneless Atlantic Salmon Fillet, 2.5 lb', 'Member''s Mark', 'Proteins', true, 23.94, 0, 5.4, 17, 8, 85, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Atlantic salmon fillet', 5, 'manual', '1234567890130', '2025-01-12', 4, '2025-01-15 10:00:00'),
('85/15 Organic Grass Fed Ground Beef, 2 lb', 'Member''s Mark', 'Proteins', true, 17.94, 0, 15, 21, 8, 113, 100, 'g', 'weight', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Ground beef (85% lean, 15% fat)', 5, 'manual', '1234567890131', '2025-01-14', 7, '2025-01-15 10:00:00'),
('Grated Parmigiano Reggiano, 8 oz', 'Kroger', 'Dairy & Eggs', true, 4.99, 4, 28.6, 38.4, 50, 100, 28, 'g', 'weight', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'Parmigiano Reggiano cheese', 5, 'manual', '1234567890132', '2025-01-13', 5, '2025-01-15 10:00:00'),
('Avocados, 5 ct', 'Member''s Mark', 'Fruits', true, 4.48, 8.5, 14.7, 2, 5, 100, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Avocados', 5, 'manual', '1234567890133', '2025-01-14', 6, '2025-01-15 10:00:00'),
('Bananas, 3 lb', 'Chiquita / Member''s Mark Organic', 'Fruits', true, 1.97, 22.8, 0.3, 1.1, 12, 118, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Bananas', 4, 'manual', '1234567890134', '2025-01-13', 9, '2025-01-15 10:00:00'),
('Simple Truth Organic Shredded Romaine Lettuce, 8 oz', 'Simple Truth', 'Vegetables', true, 2.79, 1.5, 0.1, 0.5, 4, 72, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Organic romaine lettuce', 4, 'manual', '1234567890135', '2025-01-12', 4, '2025-01-15 10:00:00'),
('Plain Nonfat Greek Yogurt, 40 oz', 'Member''s Mark', 'Dairy & Eggs', true, 4.28, 6.1, 0.66, 17.3, 1, 170, 1, 'container', 'package', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'Nonfat Greek yogurt', 4, 'manual', '1234567890136', '2025-01-11', 5, '2025-01-15 10:00:00'),
('Himalayan Pink Salt, Fine Ground, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0, 0, 0, 200, 5, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Pink Himalayan salt', 5, 'manual', '1234567890137', '2025-01-10', 2, '2025-01-15 10:00:00'),
('Black Pepper, Fine, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 8.50, 1, 0, 0, 200, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Ground black pepper', 4, 'manual', '1234567890138', '2025-01-09', 3, '2025-01-15 10:00:00'),
('Garlic Powder, Fine, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 8.00, 2.3, 0.02, 0.51, 200, 3, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Ground garlic', 4, 'manual', '1234567890139', '2025-01-08', 4, '2025-01-15 10:00:00'),
('Organic Ground Ginger, 16 oz', 'Member''s Mark Organic', 'Seasonings & Spices', true, 8.50, 1.3, 0.1, 0.2, 200, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Organic ground ginger', 4, 'manual', '1234567890140', '2025-01-07', 2, '2025-01-15 10:00:00'),
('Organic Ground Turmeric, 16 oz', 'Member''s Mark Organic', 'Seasonings & Spices', true, 8.50, 1.43, 0.22, 0.17, 200, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Organic ground turmeric', 4, 'manual', '1234567890141', '2025-01-06', 3, '2025-01-15 10:00:00'),
('Multi Bell Sweet Peppers, 6 ct', 'Member''s Mark', 'Vegetables', true, 6.72, 9, 0.5, 1.5, 6, 149, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Bell peppers', 4, 'manual', '1234567890142', '2025-01-05', 4, '2025-01-15 10:00:00'),
('Taylor Farms Brussels Sprouts, 2 lb', 'Taylor Farms', 'Vegetables', true, 4.18, 11, 0.8, 4, 8, 156, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Brussels sprouts', 4, 'manual', '1234567890143', '2025-01-04', 3, '2025-01-15 10:00:00'),
('Anjou Pears, 5 lb', 'Member''s Mark', 'Fruits', true, 8.44, 27, 0.3, 0.6, 10, 178, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Pears', 4, 'manual', '1234567890144', '2025-01-03', 5, '2025-01-15 10:00:00'),
('Green Seedless Grapes, 3 lb', 'Member''s Mark', 'Fruits', true, 5.97, 16, 0.3, 0.6, 6, 92, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Green seedless grapes', 4, 'manual', '1234567890145', '2025-01-02', 6, '2025-01-15 10:00:00'),
('Mangos, 8.8 lb', 'Member''s Mark', 'Fruits', true, 8.18, 25, 0.6, 1.4, 8, 165, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Mangoes', 5, 'manual', '1234567890146', '2025-01-01', 4, '2025-01-15 10:00:00'),
('Bone-In Chicken Drumsticks, 2 lb', 'Member''s Mark', 'Proteins', true, 5.75, 0, 5.7, 24.2, 8, 100, 3.5, 'oz', 'weight', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Chicken drumsticks (skinless, boneless)', 4, 'manual', '1234567890147', '2024-12-30', 5, '2025-01-15 10:00:00'),
('Bone-In Chicken Thighs, 2 lb', 'Member''s Mark', 'Proteins', true, 8.13, 0, 8.2, 24.8, 8, 100, 3.5, 'oz', 'weight', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Chicken thighs (skinless, boneless)', 4, 'manual', '1234567890148', '2024-12-29', 4, '2025-01-15 10:00:00'),
('Grass Fed Beef Ribeye Steak, 1.5 lb', 'Member''s Mark', 'Proteins', true, 19.17, 0, 10.8, 23.8, 4, 85, 3, 'oz', 'weight', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Ribeye steak', 5, 'manual', '1234567890149', '2024-12-28', 3, '2025-01-15 10:00:00'),
('Prime Beef Strip Steak, 1.5 lb', 'Member''s Mark', 'Proteins', true, 24.67, 0, 7.6, 26, 4, 85, 3, 'oz', 'weight', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Prime beef strip steak', 5, 'manual', '1234567890150', '2024-12-27', 2, '2025-01-15 10:00:00'),
('USDA Choice Angus Beef NY Strip Steak, 2 lb', 'Member''s Mark', 'Proteins', true, 49.38, 0, 7.6, 26, 4, 85, 3, 'oz', 'weight', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'USDA Choice Angus beef NY strip', 5, 'manual', '1234567890151', '2024-12-26', 1, '2025-01-15 10:00:00'),
('Vital Proteins Collagen Peptides Powder, 1.5 lb', 'Vital Proteins', 'Proteins', true, 29.98, 0, 0, 18, 30, 20, 2, 'scoop', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Hydrolyzed bovine collagen peptides', 5, 'manual', '1234567890152', '2024-12-25', 3, '2025-01-15 10:00:00'),
('Arm & Hammer Baking Soda, 13.5 lb', 'Arm & Hammer', 'Baking Supplies', true, 27.89, 0, 0, 0, 1000, 5, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Sodium bicarbonate', 5, 'manual', '1234567890153', '2024-12-24', 1, '2025-01-15 10:00:00'),
('Coconut Water, 12 fl oz, 12 pk', 'Vita Coco', 'Beverages', true, 19.98, 10.4, 0, 0.5, 12, 245, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Coconut water', 4, 'manual', '1234567890154', '2024-12-23', 8, '2025-01-15 10:00:00'),
('Member''s Mark Purified Water, 16.9 fl oz, 40 pk', 'Member''s Mark', 'Beverages', true, 3.98, 0, 0, 0, 40, 500, 1, 'bottle', 'package', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Purified water', 4, 'manual', '1234567890155', '2024-12-22', 12, '2025-01-15 10:00:00'),
('Organic Raw Unfiltered Apple Cider Vinegar, 32 fl oz', 'Bragg''s', 'Condiments & Sauces', true, 26.00, 0, 0, 0, 100, 15, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Organic apple cider vinegar', 5, 'manual', '1234567890156', '2024-12-21', 2, '2025-01-15 10:00:00'),
('Pure Irish Butter, Salted, Grass-Fed, 8 oz', 'Kerrygold', 'Dairy & Eggs', true, 12.22, 0, 11, 0, 32, 14, 1, 'tbsp', 'volume', 'https://images.openfoodfacts.org/images/products/076/770/701/4777/front_en.7.400.jpg', 'Pasteurized cream, salt, milk', 5, 'openfoodfacts', '0767707014777', '2024-12-20', 6, '2025-01-15 10:00:00'),
('Daisy Brand Pure and Natural Sour Cream, 14 oz, 2 pk', 'Daisy Brand', 'Dairy & Eggs', true, 4.88, 1, 5, 1, 28, 30, 2, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'Cultured cream', 4, 'manual', '1234567890158', '2024-12-19', 4, '2025-01-15 10:00:00'),
('Gold Kiwi, 2 lb', 'Member''s Mark', 'Fruits', true, 7.97, 10.1, 0.4, 0.8, 8, 75, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Kiwifruit', 5, 'manual', '1234567890159', '2024-12-18', 5, '2025-01-15 10:00:00'),
('Green Kiwi, 3 lb', 'Member''s Mark', 'Fruits', true, 8.47, 10.1, 0.4, 0.8, 12, 75, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Kiwifruit', 4, 'manual', '1234567890160', '2024-12-17', 4, '2025-01-15 10:00:00'),
('Clementine Mandarins, 5 lb', 'Member''s Mark', 'Fruits', true, 7.62, 9, 0, 1, 15, 74, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Clementines', 4, 'manual', '1234567890161', '2024-12-16', 7, '2025-01-15 10:00:00'),
('Onion Powder, Ground, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 8.00, 1.9, 0.02, 0.25, 200, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Ground onion', 4, 'manual', '1234567890162', '2024-12-15', 3, '2025-01-15 10:00:00'),
('Parsley Flakes, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0.25, 0.03, 0.13, 200, 1, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Dried parsley', 4, 'manual', '1234567890163', '2024-12-14', 2, '2025-01-15 10:00:00'),
('Cumin, Ground, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0.93, 0.47, 0.37, 200, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Ground cumin seeds', 4, 'manual', '1234567890164', '2024-12-13', 4, '2025-01-15 10:00:00'),
('Beef Fajita Seasoning, 1 Oz', 'Siete', 'Seasonings & Spices', true, 2.99, 0, 0, 0, 8, 5, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/c/o/copy-of-810091781128_siete-1oz-beef-fajita-seasoning_front_1_1.jpg?w=1227&jpg_quality=90', 'Smoked Sea Salt, Garlic, Black Pepper, Onions, Paprika, Sea Salt, Hatch Red Chiles, Ground Dates.', 3, 'manual', '1234567890165', '2024-12-12', 1, '2025-01-15 10:00:00'),
('Chicken Fajita Seasoning, 1 Oz', 'Siete', 'Seasonings & Spices', true, 2.99, 0, 0, 0, 8, 5, 1, 'tsp', 'volume', 'https://www.instacart.com/assets/domains/product-image/file/large_509357c6-e962-4854-b779-0cd33a935350.png', 'Smoked sea salt, garlic, ground dates, onions, sea salt, black pepper, paprika, cumin, red bell peppers, chile flakes, green bell peppers, lime oil.', 4, 'manual', '1234567890166', '2024-12-11', 2, '2025-01-15 10:00:00'),
('Cilantro Lime Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 4, 7, 1, 7, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-cilantro-lime-sauce-1126626285_279x.jpg?v=1738777602', 'Water, High Oleic Sunflower Oil, Roasted Poblano Chilies, Cilantro, Parsley, Dehydrated Garlic, Lime Juice Concentrate, Jalapeño, Sea Salt, Lemon Juice Concentrate, Dehydrated Roasted Garlic, Tapioca Starch, Spices, Black Pepper, Xanthan Gum, Sunflower Lecithin, Monkfruit Extract, Citric Acid.', 4, 'manual', '1234567890167', '2024-12-10', 3, '2025-01-15 10:00:00'),
('Classic Taco Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 17, 1.5, 0, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-classic-taco-sauce-1126626287_1800x1800.jpg?v=1738777608', 'Water, Fire Roasted Tomatoes (Fire Roasted Tomatoes, Tomato Juice, Salt, Citric Acid, Calcium Chloride), Chicken Stock (Chicken Stock, Salt), Roasted Poblano Chilies, Chicken Fat, Cilantro, Spices, Tapioca Starch, Tamarind Puree (Tamarind Pulp, Water), Lime Juice Concentrate, Smoked Granulated Onion, Sea Salt, Yeast Extract, Smoked Paprika, Dehydrated Garlic, Xanthan Gum, Citric Acid, Monk Fruit Extract.', 3, 'manual', '1234567890168', '2024-12-09', 2, '2025-01-15 10:00:00'),
('Honey Garlic Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 16, 0, 1, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-honey-garlic-sauce-1126626289_1800x1800.jpg?v=1738777800', 'Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Distilled Vinegar, Roasted Garlic, Honey, Orange Juice Concentrate, Yeast Extract, Tapioca Starch, Dehydrated Garlic, Xanthan Gum, Spices, Granulated Onion, Citric Acid, Monk Fruit Extract, Orange Oil.', 4, 'manual', '1234567890169', '2024-12-08', 4, '2025-01-15 10:00:00'),
('Lemongrass Basil Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 6, 6, 1, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-lemongrass-basil-sauce-1126626297_279x.jpg?v=1738777080', 'Coconut Milk (Coconut Cream, Water), Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Coconut Sugar, Lemongrass Puree (Lemongrass, Water), Basil, Lime Juice Concentrate, Tapioca Starch, Dehydrated Onion, Dehydrated Garlic, Sea Salt, Jalapeño, Spices, Apple Cider Vinegar, Shiitake Mushroom, Paprika, Yeast Extract, Ground Ginger, Xanthan Gum, Citric Acid, Monkfruit Extract.', 3, 'manual', '1234567890170', '2024-12-07', 2, '2025-01-15 10:00:00'),
('Orange Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 13, 0, 0, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-orange-sauce-1126626298_279x.jpg?v=1738777081', 'Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Orange Juice Concentrate, Coconut Sugar, Distilled Vinegar, Sherry Wine, Tapioca Starch, Yeast Extract, Xanthan Gum, Sea Salt, Spices, Granulated Onion, Granulated Garlic, Citric Acid, Monk Fruit Extract, Orange Oil.', 3, 'manual', '1234567890171', '2024-12-06', 3, '2025-01-15 10:00:00'),
('Organic Adobo Seasoning, 2.9 Oz', 'Loisa', 'Seasonings & Spices', true, 7.79, 0, 0, 0, 82, 5, 1, 'tsp', 'volume', 'https://www.instacart.com/image-server/466x466/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/domains/product-image/file/large_0b9bbfc0-eb6f-4f56-967c-bfca1f5491fd.png', 'Sea salt, organic garlic, organic turmeric, organic oregano, organic black pepper.', 4, 'manual', '1234567890172', '2024-12-05', 1, '2025-01-15 10:00:00'),
('Organic Sazón Seasoning, 2.3 Oz', 'Loisa', 'Seasonings & Spices', true, 7.79, 0, 0, 0, 65, 5, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/8/5/856633007073_front_1_1.jpg?w=1227&jpg_quality=90', 'Sea salt, organic achiote, organic cumin, organic coriander, organic garlic, organic oregano, organic black pepper.', 4, 'manual', '1234567890173', '2024-12-04', 2, '2025-01-15 10:00:00'),
('Sea Salt Flakes, 8.5 Oz', 'Maldon', 'Seasonings & Spices', true, 6.99, 0, 0, 0, 160, 2, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/8/4/847972000009_1_1.jpg?w=1167&jpg_quality=90', 'Sea Salt Flakes.', 5, 'manual', '1234567890174', '2024-12-03', 3, '2025-01-15 10:00:00'),
('Seasoning Mix, Garden Ranch, 0.81 Oz Pouch', 'Primal Palate', 'Seasonings & Spices', true, 1.79, 0, 0, 0, 23, 5, 1, 'tsp', 'volume', 'https://shop.primalpalate.com/cdn/shop/products/GardenRanchPacket.jpg?v=1604055766&width=1158', 'Onion, Garlic, Himalayan Pink Salt, Dillweed, Parsley, Chives, Black Pepper.', 3, 'manual', '1234567890175', '2024-12-02', 4, '2025-01-15 10:00:00'),
('Seasoning, Barbecue Rub, 3.1 Oz', 'Primal Palate', 'Seasonings & Spices', true, 8.99, 0, 0, 0, 88, 5, 1, 'tsp', 'volume', 'https://shop.primalpalate.com/cdn/shop/products/BarbecueRub.jpg?v=1603741835&width=1200', 'Pink Himalayan Salt, Onion, Garlic, Paprika, Oregano, Turmeric, Black Pepper, Ginger, Cumin, Cayenne, Coriander.', 4, 'manual', '1234567890176', '2024-12-01', 2, '2025-01-15 10:00:00'),
('Seasoning, Seafood, 2.1 Oz', 'Primal Palate', 'Seasonings & Spices', true, 8.99, 0, 0, 0, 60, 5, 1, 'tsp', 'volume', 'https://shop.primalpalate.com/cdn/shop/products/SeafoodSeasoning.jpg?v=1603737594&width=1200', 'Pink Himalayan Salt, Onion, Black Pepper, Lemon Peel, Garlic, Bay Leaves, Parsley, Chives.', 3, 'manual', '1234567890177', '2024-11-30', 3, '2025-01-15 10:00:00'),
('Taco Seasoning, Mild, 1.3 Oz', 'Siete', 'Seasonings & Spices', true, 2.99, 0, 0, 0, 7, 5, 1, 'tsp', 'volume', 'https://www.instacart.com/assets/domains/product-image/file/large_6482e1c5-1a88-4037-a345-9958061765af.png', 'Chile powder, sea salt, ground dates, tomato powder, garlic powder, nutritional yeast, cumin, onion flakes, cassava flour, cream of tartar, black pepper, and paprika.', 3, 'manual', '1234567890178', '2024-11-29', 5, '2025-01-15 10:00:00'),
('Thai Coconut Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 7, 7, 1, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-thai-coconut-sauce-1126626302_279x.jpg?v=1738776726', 'Coconut Milk (Coconut Cream, Water), Water, Coconut Sugar, Lime Juice Concentrate, Spices, Tapioca Starch, Basil, Yeast Extract, Dehydrated Onion, Basil, Dehydrated Garlic, Sea Salt, Lemongrass Puree (Lemongrass, Water), Turmeric, Xanthan Gum, Dehydrated Ginger, Citric Acid, Black Pepper, Monkfruit Extract.', 4, 'manual', '1234567890179', '2024-11-28', 3, '2025-01-15 10:00:00'),
('The New Primal, Noble Made Organic All-Purpose Seasoning, 2 oz', 'The New Primal (Noble Made)', 'Seasonings & Spices', true, 6.99, 0, 0, 0, 81, 5, 1, 'tsp', 'volume', 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_724cd215-3482-4ba7-9d67-65c893a7e642.jpg', 'Organic Dehydrated Garlic, Sea Salt, Organic Ground Mustard Seed, Organic Black Pepper, Organic Lemon Peel, Organic Apple Cider Vinegar Powder (Organic Apple Cider Vinegar, Organic Acacia Gum), Organic Rosemary, Organic Basil, Citric Acid, Organic Lemon Juice Powder.', 3, 'manual', '1234567890180', '2024-11-27', 2, '2025-01-15 10:00:00'),
('The New Primal, Noble Made Poultry Seasoning, 2.6 oz', 'The New Primal (Noble Made)', 'Seasonings & Spices', true, 6.99, 0, 0, 0, 82, 5, 1, 'tsp', 'volume', 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_03aa38c4-213d-4a6f-a695-c35bff5b7b56.jpg', 'Organic Dehydrated Garlic, Organic Dehydrated Onion, Sea Salt, Organic Cracked Black Pepper, Organic Orange Peel, Organic Cayenne, Organic Sage, Organic Parsley, Organic Dehydrated Green Bell Pepper.', 3, 'manual', '1234567890181', '2024-11-26', 4, '2025-01-15 10:00:00'),
('The New Primal, Noble Made Steak Seasoning, 2.5 oz', 'The New Primal (Noble Made)', 'Seasonings & Spices', true, 6.99, 0, 0, 0, 89, 5, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/8/5/850000398412_front_1__1_1.jpg', 'Sea salt, organic cracked black pepper, organic dehydrated garlic, organic dehydrated onion, organic coriander, organic dill seed powder, organic coriander seed, organic dill seed.', 4, 'manual', '1234567890182', '2024-11-25', 2, '2025-01-15 10:00:00'),
('Chobani Greek Yogurt Key Lime Blended, 5.3 oz', 'Chobani', 'Dairy & Eggs', true, 1.49, 17, 2.5, 11, 1, 150, 1, 'container', 'package', 'https://images.openfoodfacts.org/images/products/081/829/001/2715/front_en.20.400.jpg', 'Lowfat yogurt (cultured pasteurized nonfat milk, cream), evaporated cane sugar, water, key lime puree, key lime juice concentrate, natural flavor, locust bean gum, fruit pectin, turmeric and fruit juice concentrate (for color), lemon juice concentrate. Contains live and active cultures: s. thermophilus, l. bulgaricus, l. acidophilus, bifidus and l. casei.', 4, 'openfoodfacts', '0818290012715', '2024-11-24', 3, '2025-01-15 10:00:00'),
('Chobani Non-Fat Greek Yogurt Plain, 5.3 oz', 'Chobani', 'Dairy & Eggs', true, 1.29, 4, 0, 10, 1, 150, 1, 'container', 'package', 'https://images.openfoodfacts.org/images/products/081/829/001/3811/front_en.7.400.jpg', 'Nonfat yogurt (cultured pasteurized nonfat milk). Contains live and active cultures: s. thermophilus, l. bulgaricus, l. acidophilus, bifidus and l. casei.', 5, 'openfoodfacts', '0818290013811', '2024-11-23', 6, '2025-01-15 10:00:00'),
('Chobani Greek Yogurt Raspberry, 5.3 oz', 'Chobani', 'Dairy & Eggs', true, 1.49, 15, 0, 12, 1, 150, 1, 'container', 'package', 'https://images.openfoodfacts.org/images/products/081/829/001/3828/front_en.14.400.jpg', 'Nonfat yogurt (cultured pasteurized nonfat milk), evaporated cane sugar, water, raspberry puree, fruit pectin, locust bean gum, fruit and vegetable juice concentrate (for color), natural flavors, lemon juice concentrate. Contains live and active cultures: s. thermophilus, l. bulgaricus, l. acidophilus, bifidus and l. casei.', 4, 'openfoodfacts', '0818290013828', '2024-11-22', 4, '2025-01-15 10:00:00'),
('Chobani Blueberry Greek Yogurt, 170g', 'Chobani', 'Dairy & Eggs', true, 1.99, 18.3, 0.3, 13.7, 1, 170, 1, 'container', 'package', 'https://images.openfoodfacts.org/images/products/931/065/310/2541/front_en.13.400.jpg', 'Low fat yogurt (skim milk, live yogurt cultures), blueberry blend (blueberries, sugar, water, vegetable gums, natural flavors, mineral salt (calcium citrate), acidity regulators (cutric acid, sodium citrate)', 4, 'openfoodfacts', '9310653102541', '2024-11-21', 5, '2025-01-15 10:00:00');

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