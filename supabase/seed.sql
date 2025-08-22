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
-- Additional items needed for recipes
('Fresh Cucumber, 1 lb', 'Member''s Mark', 'Vegetables', true, 1.99, 3.6, 0.1, 0.7, 4, 100, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', 'Fresh cucumber', 4, 'manual', '1234567890183', '2024-11-24', 3, '2025-01-15 10:00:00'),
('Fresh Lemon Juice, 32 fl oz', 'Member''s Mark', 'Condiments & Sauces', true, 4.98, 2.5, 0, 0.2, 64, 15, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'Fresh lemon juice', 4, 'manual', '1234567890184', '2024-11-23', 2, '2025-01-15 10:00:00'),
('Fresh Dill, 1 oz', 'Member''s Mark', 'Vegetables', true, 2.49, 1.1, 0.1, 0.4, 8, 3.5, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Fresh dill', 4, 'manual', '1234567890185', '2024-11-22', 1, '2025-01-15 10:00:00'),
('Coconut Aminos, 16 fl oz', 'Coconut Secret', 'Condiments & Sauces', true, 8.99, 0, 0, 0, 32, 15, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Coconut aminos', 4, 'manual', '1234567890186', '2024-11-21', 2, '2025-01-15 10:00:00'),
('Red Pepper Flakes, 2 oz', 'Member''s Mark', 'Seasonings & Spices', true, 3.99, 0, 0, 0, 100, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Red pepper flakes', 4, 'manual', '1234567890187', '2024-11-20', 1, '2025-01-15 10:00:00'),
('Fresh Cauliflower, 1 head', 'Member''s Mark', 'Vegetables', true, 3.99, 5.3, 0.3, 2.0, 6, 100, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Fresh cauliflower', 4, 'manual', '1234567890188', '2024-11-19', 2, '2025-01-15 10:00:00'),
('Fresh Pineapple, 1 piece', 'Member''s Mark', 'Fruits', true, 4.99, 22.0, 0.1, 0.9, 8, 100, 1, 'cup', 'volume', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400', 'Fresh pineapple', 4, 'manual', '1234567890189', '2024-11-18', 1, '2025-01-15 10:00:00'),
('Fresh Red Bell Pepper, 1 piece', 'Member''s Mark', 'Vegetables', true, 1.49, 6.0, 0.3, 1.0, 1, 100, 1, 'piece', 'package', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Fresh red bell pepper', 4, 'manual', '1234567890190', '2024-11-17', 2, '2025-01-15 10:00:00'),
('Fresh Green Onions, 1 bunch', 'Member''s Mark', 'Vegetables', true, 1.99, 1.8, 0.1, 0.5, 8, 15, 1, 'tbsp', 'volume', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', 'Fresh green onions', 4, 'manual', '1234567890191', '2024-11-16', 1, '2025-01-15 10:00:00'),
('Raw Cashews, 16 oz', 'Member''s Mark', 'Snacks', true, 8.99, 8.6, 12.4, 5.2, 16, 28, 0.25, 'cup', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Raw cashews', 4, 'manual', '1234567890192', '2024-11-15', 2, '2025-01-15 10:00:00'),
('Almond Flour, 16 oz', 'Member''s Mark', 'Baking Supplies', true, 12.99, 6.0, 14.0, 6.0, 32, 28, 0.25, 'cup', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Almond flour', 4, 'manual', '1234567890193', '2024-11-14', 1, '2025-01-15 10:00:00'),
('Vanilla Protein Powder, 1 lb', 'Member''s Mark', 'Proteins', true, 24.99, 3.0, 1.5, 24.0, 30, 30, 1, 'scoop', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Vanilla protein powder', 4, 'manual', '1234567890194', '2024-11-13', 2, '2025-01-15 10:00:00'),
('Ground Cinnamon, 16 oz', 'Member''s Mark', 'Seasonings & Spices', true, 7.99, 1.8, 0.1, 0.2, 200, 2, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Ground cinnamon', 4, 'manual', '1234567890195', '2024-11-12', 1, '2025-01-15 10:00:00'),
('Pure Vanilla Extract, 8 fl oz', 'Member''s Mark', 'Baking Supplies', true, 9.99, 0, 0, 0, 96, 5, 1, 'tsp', 'volume', 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', 'Pure vanilla extract', 4, 'manual', '1234567890196', '2024-11-11', 2, '2025-01-15 10:00:00');

-- Insert recipes from Recipes.md
INSERT INTO recipes (name, cuisine_type, meal_type, difficulty, prep_time, cook_time, total_time, servings, instructions, tags, notes, created_at, updated_at) VALUES
('Tzatziki', 'Greek', ARRAY['sauce', 'dip', 'condiment'], 'easy', 15, 0, 15, 8, '1. Prepare the cucumber: Peel the cucumber (optional, based on your preference). Cut it into chunks and place it in the food processor. Pulse briefly until finely chopped (but not pureed). Transfer the chopped cucumber to a fine-mesh sieve or cheesecloth. Press or squeeze out excess water thoroughly.

2. Combine ingredients: Return the drained cucumber to the food processor. Add the Greek yogurt, minced garlic, olive oil, lemon juice, dill, and a pinch of salt and black pepper.

3. Blend: Pulse the mixture until you reach your desired consistency: For chunky tzatziki: Pulse briefly. For smooth tzatziki: Blend longer.

4. Taste and adjust: Taste the mixture and adjust seasoning as needed. Add more lemon juice, dill, or salt to suit your preferences.

5. Chill: Transfer the tzatziki to a serving bowl. Cover and refrigerate for at least 30 minutes to allow the flavors to meld.', ARRAY['paleo', 'dairy-free-option', 'gluten-free', 'vegetarian'], 'Perfect as a dip for fresh vegetables, crackers, or pita bread. Excellent alongside grilled meats, fish, or roasted vegetables. Great as a sauce for wraps, bowls, or salads. Can be made dairy-free by using coconut yogurt. Best when chilled for at least 30 minutes before serving.', NOW(), NOW()),
('Coconut Aminos Sauce', 'Asian', ARRAY['sauce', 'marinade', 'condiment'], 'easy', 5, 3, 8, 4, '1. Combine ingredients: In a small saucepan, whisk together the coconut aminos, water, apple cider vinegar, honey or maple syrup (if using), red pepper flakes (if using), powdered ginger, and granulated garlic.

2. Heat and simmer: Bring the mixture to a simmer over medium heat. Let it simmer for 2-3 minutes, or until the flavors have combined and the sauce has thickened slightly.

3. Cool and use: Remove from heat and let cool slightly before using.', ARRAY['paleo', 'gluten-free', 'vegan', 'dairy-free'], 'Versatile sauce perfect for drizzling over grilled or roasted meats. Excellent tossed with stir-fries or salads. Works great as a marinade for chicken or tofu. Perfect dipping sauce for spring rolls or dumplings. Store in refrigerator for up to a week. Can be made sweeter with honey or spicier with extra red pepper flakes.', NOW(), NOW()),
('Paleo Pineapple Fried Rice with Chicken Breast', 'Asian', ARRAY['main-dish', 'protein-based', 'stir-fry'], 'medium', 15, 20, 35, 4, '1. Prepare the cauliflower rice: In a large skillet or wok, heat the avocado oil over medium heat. Add the riced cauliflower and salt. Cook, stirring occasionally, for 5-7 minutes, or until the cauliflower rice is softened slightly. Remove from the pan and set aside.

2. Cook the chicken: Heat the remaining avocado oil in the same skillet over medium-high heat. Add the diced chicken and cook for 5-7 minutes, or until golden brown and cooked through. Remove the chicken from the pan and set aside.

3. Sauté the aromatics: Add the garlic and ginger to the pan and cook for 30 seconds, or until fragrant.

4. Incorporate vegetables and pineapple: Add the chopped red bell pepper and white parts of the green onion to the pan. Cook for 2-3 minutes, or until softened slightly. Then, add the chopped pineapple and cook for another minute.

5. Scramble the eggs: Push the vegetables to one side of the pan and pour in the beaten eggs. Scramble the eggs until cooked through, then stir them together with the vegetables.

6. Combine everything: Add the cooked cauliflower rice, chicken, coconut aminos, and cashews (if using) back to the pan. Stir-fry for 2-3 minutes, or until everything is heated through.

7. Season and serve: Season with salt and black pepper to taste. Garnish with the green parts of the green onion and serve immediately.', ARRAY['paleo', 'gluten-free', 'dairy-free', 'high-protein'], 'Great meal prep option - stores well for up to 3 days in refrigerator. Add extra vegetables like broccoli, carrots, or snap peas for more nutrition. Can substitute soy sauce for coconut aminos if not following paleo diet. Cashews are optional but add great crunch. Best served immediately while hot, but reheats well in skillet or microwave.', NOW(), NOW()),
('Bacon Brussels Sprouts', 'American', ARRAY['side-dish', 'vegetables'], 'easy', 10, 30, 40, 4, '1. Preheat oven to 400°F (200°C).

2. Prepare sprouts: Trim the stem end of each Brussels sprout. Remove loose or yellow leaves. Cut each sprout in half lengthwise (through the stem). Quarter large ones.

3. Combine: In a bowl, toss Brussels sprouts with chopped raw bacon, oil, salt, and pepper.

4. Roast: Spread on a parchment-lined baking sheet in a single layer, cut side down. Roast for 25–30 minutes, flipping halfway, until Brussels are golden and bacon is crisp.

5. Optional Glaze: Drizzle with balsamic vinegar or raw honey. Roast for an additional 2 minutes to lightly caramelize.', ARRAY['paleo', 'gluten-free', 'dairy-free', 'keto-friendly'], 'Perfect side dish for any protein. Add sliced garlic or red pepper flakes for extra flavor. Use two baking sheets if needed to avoid overcrowding for maximum crispiness. Optional balsamic glaze adds sweet-tangy finish. Great for meal prep - can be made ahead and reheated. Pairs excellently with roasted meats or as part of a hearty salad.', NOW(), NOW()),
('Paleo Banana Almond Flour Protein Waffles', 'American', ARRAY['breakfast', 'starch-grains', 'protein'], 'medium', 15, 20, 35, 12, '1. Preheat your waffle iron and lightly grease with coconut oil or spray.

2. In a large bowl, mash the bananas or blend them until smooth.

3. Whisk in the eggs, melted oil, and vanilla.

4. In another bowl, mix almond flour, protein powder, baking soda, cinnamon, and salt.

5. Combine wet and dry until just mixed (don''t over-stir).

6. Pour ~1/3–1/2 cup of batter per waffle and cook for 3–5 min or until golden brown.

7. Serve hot or store for later!', ARRAY['paleo', 'gluten-free', 'dairy-free', 'protein-rich', 'meal-prep'], 'Excellent meal prep breakfast - makes 12 waffles that freeze beautifully for up to a month. Let cool completely before storing to maintain crispiness. Reheat in toaster or waffle iron for best texture (avoid microwave). Great topped with almond butter, berries, or maple syrup. High protein content makes them very filling. Can be made ahead for busy mornings.', NOW(), NOW());

-- Insert recipe ingredients for new recipes
INSERT INTO recipe_items (recipe_id, item_id, quantity, unit, cost_per_unit, total_cost, cost_calculated_at) VALUES
-- Tzatziki (Recipe 1)
(1, 2, 2, 'tbsp', 0.20, 0.40, NOW()),          -- Olive Oil (2 tbsp)
(1, 14, 1, 'container', 4.28, 4.28, NOW()),    -- Greek Yogurt (1 container)
(1, 16, 1, 'tsp', 0.04, 0.04, NOW()),          -- Black Pepper (1 tsp)
(1, 17, 1.5, 'tsp', 0.04, 0.06, NOW()),        -- Garlic Powder (1.5 tsp)
(1, 61, 1, 'lb', 1.99, 1.99, NOW()),           -- Fresh Cucumber (1 lb)
(1, 62, 1, 'tbsp', 0.31, 0.31, NOW()),         -- Fresh Lemon Juice (1 tbsp)
(1, 63, 1, 'tbsp', 0.31, 0.31, NOW()),         -- Fresh Dill (1 tbsp)
-- Coconut Aminos Sauce (Recipe 2)
(2, 4, 1, 'tbsp', 0.30, 0.30, NOW()),          -- Honey (1 tbsp)
(2, 17, 0.25, 'tsp', 0.04, 0.01, NOW()),       -- Garlic Powder (1/4 tsp)
(2, 18, 0.25, 'tsp', 0.04, 0.01, NOW()),       -- Ground Ginger (1/4 tsp)
(2, 34, 0.25, 'cup', 26.00, 6.50, NOW()),      -- Apple Cider Vinegar (1/4 cup)
(2, 64, 0.25, 'cup', 8.99, 2.25, NOW()),       -- Coconut Aminos (1/4 cup)
(2, 65, 0.5, 'tsp', 0.04, 0.02, NOW()),        -- Red Pepper Flakes (1/2 tsp)
-- Paleo Pineapple Fried Rice with Chicken Breast (Recipe 3)
(3, 3, 1, 'tbsp', 0.15, 0.15, NOW()),          -- Coconut Oil (1 tbsp)
(3, 6, 1, 'lb', 21.11, 21.11, NOW()),          -- Chicken Breast (1 lb)
(3, 7, 2, 'piece', 0.50, 1.00, NOW()),         -- Eggs (2 pieces)
(3, 16, 1, 'tsp', 0.04, 0.04, NOW()),          -- Black Pepper (1 tsp)
(3, 17, 2, 'tsp', 0.04, 0.08, NOW()),          -- Garlic Powder (2 tsp)
(3, 18, 1, 'tsp', 0.04, 0.04, NOW()),          -- Ground Ginger (1 tsp)
(3, 64, 3, 'tbsp', 8.99, 1.69, NOW()),         -- Coconut Aminos (3 tbsp)
(3, 66, 1, 'head', 3.99, 3.99, NOW()),         -- Fresh Cauliflower (1 head)
(3, 67, 1, 'cup', 4.99, 4.99, NOW()),          -- Fresh Pineapple (1 cup)
(3, 68, 0.5, 'piece', 1.49, 0.75, NOW()),      -- Fresh Red Bell Pepper (1/2 piece)
(3, 69, 0.25, 'bunch', 1.99, 0.50, NOW()),     -- Fresh Green Onions (1/4 bunch)
(3, 70, 0.25, 'cup', 8.99, 2.25, NOW()),       -- Raw Cashews (1/4 cup, optional)
-- Bacon Brussels Sprouts (Recipe 4)
(4, 2, 1, 'tbsp', 0.20, 0.20, NOW()),          -- Olive Oil (1-2 tbsp)
(4, 16, 1, 'tsp', 0.04, 0.04, NOW()),          -- Black Pepper (1 tsp)
(4, 21, 1, 'lb', 4.18, 4.18, NOW()),           -- Brussels Sprouts (1 lb)
-- Paleo Banana Almond Flour Protein Waffles (Recipe 5)
(5, 3, 0.75, 'cup', 0.15, 0.11, NOW()),        -- Coconut Oil (3/4 cup)
(5, 7, 5, 'piece', 0.50, 2.50, NOW()),         -- Eggs (5-6 pieces)
(5, 12, 6, 'piece', 0.58, 3.48, NOW()),        -- Bananas (6 pieces)
(5, 15, 0.75, 'tsp', 0.04, 0.03, NOW()),       -- Salt (0.75 tsp)
(5, 31, 0.75, 'tsp', 0.28, 0.21, NOW()),       -- Baking Soda (0.75 tsp)
(5, 71, 3, 'cup', 12.99, 1.22, NOW()),         -- Almond Flour (3 cups)
(5, 72, 2, 'scoop', 24.99, 1.67, NOW()),       -- Vanilla Protein Powder (2 scoops)
(5, 73, 1.5, 'tsp', 0.04, 0.06, NOW()),        -- Ground Cinnamon (1.5 tsp)
(5, 74, 1.5, 'tsp', 0.10, 0.15, NOW());        -- Pure Vanilla Extract (1.5 tsp)

-- Insert sample meal logs for new recipes
INSERT INTO meal_logs (recipe_id, cooked_at, notes, rating, macros, cost, created_at) VALUES
(1, '2024-01-15', 'Perfect creamy tzatziki! Great with grilled chicken.', 4.5, '{"calories": 45, "protein": 2, "carbs": 3, "fat": 3}', 7.39, NOW()),
(2, '2024-01-14', 'Delicious sauce, perfect for stir-fries', 4.8, '{"calories": 25, "protein": 0, "carbs": 5, "fat": 0}', 9.09, NOW()),
(3, '2024-01-13', 'Amazing paleo fried rice! Love the pineapple addition.', 4.7, '{"calories": 320, "protein": 28, "carbs": 15, "fat": 18}', 34.71, NOW()),
(4, '2024-01-12', 'Crispy Brussels sprouts with bacon - amazing!', 4.6, '{"calories": 180, "protein": 8, "carbs": 12, "fat": 12}', 8.74, NOW()),
(5, '2024-01-11', 'Perfect paleo waffles, great texture and flavor!', 4.8, '{"calories": 280, "protein": 12, "carbs": 18, "fat": 20}', 9.39, NOW());

-- Insert sample weekly meal plan
INSERT INTO weekly_meal_plans (week_start, created_at) VALUES
('2024-01-15', NOW());

-- Insert meal plan blocks
INSERT INTO meal_plan_blocks (weekly_plan_id, name, start_day, end_day, created_at) VALUES
(1, 'Mon-Wed Block', 0, 2, NOW()),
(1, 'Thu-Sat Block', 3, 5, NOW());

-- Insert recipe rotations for new recipes
INSERT INTO recipe_rotations (block_id, name, notes, created_at) VALUES
(1, 'Rotation 1', 'Tzatziki with grilled chicken and vegetables', NOW()),
(1, 'Rotation 2', 'Coconut aminos sauce with stir-fry and rice', NOW()),
(2, 'Rotation 1', 'Paleo pineapple fried rice with chicken', NOW()),
(2, 'Rotation 2', 'Bacon Brussels sprouts with protein', NOW());

-- Assign recipes to rotations
INSERT INTO rotation_recipes (rotation_id, recipe_id, created_at) VALUES
(1, 1, NOW()),  -- Tzatziki
(2, 2, NOW()),  -- Coconut Aminos Sauce
(3, 3, NOW()),  -- Paleo Pineapple Fried Rice with Chicken Breast
(4, 4, NOW());  -- Bacon Brussels Sprouts

-- We don't have snack recipes defined yet, so commenting out snacks for now
-- INSERT INTO block_snacks (block_id, recipe_id, created_at) VALUES
-- (1, recipe_id_for_protein_bar, NOW()),
-- (1, recipe_id_for_mixed_nuts, NOW()),
-- (2, recipe_id_for_berries, NOW()),
-- (2, recipe_id_for_greek_yogurt, NOW());