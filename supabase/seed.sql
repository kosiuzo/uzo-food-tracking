-- Seed data for the food tracking app

-- Insert comprehensive food inventory from CSV
INSERT INTO items (name, brand, category, in_stock, price, carbs_per_serving, fat_per_serving, protein_per_serving, calories_per_serving, servings_per_container, serving_size_grams, serving_quantity, serving_unit, serving_unit_type, image_url, ingredients, rating, nutrition_source, barcode, last_purchased, purchase_count, last_edited) VALUES
('Thai Jasmine Rice, 25 lb.', 'Member''s Mark', 'Grains & Starches', true, 18.98, 42, 0, 3, 180, 200, 50, 0.25, 'cup', 'volume', 'https://images.openfoodfacts.org/images/products/019/396/814/8096/front_en.3.400.jpg', 'Long grain jasmine rice', NULL, 'openfoodfacts', '0193968148096', '2025-01-15', 5, '2025-01-15 10:00:00'),
('100% Pure Olive Oil, 101 fl oz', 'Member''s Mark', 'Oils & Fats', true, 18.98, 0, 14, 0, 126, 101, 14, 1, 'tbsp', 'volume', NULL, 'Olive oil', NULL, 'manual', '1234567890124', '2025-01-14', 3, '2025-01-15 10:00:00'),
('Organic Virgin Coconut Oil, 56 oz', 'Member''s Mark Organic', 'Oils & Fats', true, 10.98, 0, 14, 0, 126, 112, 14, 1, 'tbsp', 'volume', NULL, 'Organic pure virgin unrefined coconut oil', NULL, 'manual', '1234567890125', '2025-01-13', 2, '2025-01-15 10:00:00'),
('Raw and Unfiltered Honey, 32 oz', 'Nature''s Nate Honey Co.', 'Condiments & Sauces', true, 13.98, 17, 0, 0, 68, 50, 21, 1, 'tbsp', 'volume', NULL, 'Raw unfiltered honey', NULL, 'manual', '1234567890126', '2025-01-12', 4, '2025-01-15 10:00:00'),
('Organic 100% Pure Maple Syrup, 32 oz', 'Member''s Mark Organic', 'Condiments & Sauces', true, 11.98, 13, 0, 0, 52, 64, 20, 1, 'tbsp', 'volume', NULL, 'Organic maple syrup', NULL, 'manual', '1234567890127', '2025-01-11', 3, '2025-01-15 10:00:00'),
('Boneless and Skinless Chicken Breasts, 3 lb', 'Member''s Mark', 'Proteins', true, 21.11, 0, 3.6, 31, 150.4, 8, 113, 1, 'piece', 'package', NULL, 'Boneless skinless chicken breasts', NULL, 'manual', '1234567890128', '2025-01-14', 6, '2025-01-15 10:00:00'),
('Organic Pasture Raised Eggs, 12 ct', 'Member''s Mark Organic', 'Dairy & Eggs', true, 7.00, 0.6, 5.4, 7.5, 78.9, 12, 68, 1, 'piece', 'package', NULL, 'Pasture-raised eggs', NULL, 'manual', '1234567890129', '2025-01-13', 8, '2025-01-15 10:00:00'),
('Skinless and Boneless Atlantic Salmon Fillet, 2.5 lb', 'Member''s Mark', 'Proteins', true, 23.94, 0, 5.4, 17, 123.6, 8, 85, 1, 'piece', 'package', NULL, 'Atlantic salmon fillet', NULL, 'manual', '1234567890130', '2025-01-12', 4, '2025-01-15 10:00:00'),
('85/15 Organic Grass Fed Ground Beef, 2 lb', 'Member''s Mark', 'Proteins', true, 17.94, 0, 15, 21, 219, 8, 113, 100, 'g', 'weight', NULL, 'Ground beef (85% lean, 15% fat)', NULL, 'manual', '1234567890131', '2025-01-14', 7, '2025-01-15 10:00:00'),
('Grated Parmigiano Reggiano, 8 oz', 'Kroger', 'Dairy & Eggs', true, 4.99, 4, 28.6, 38.4, 387.6, 50, 100, 28, 'g', 'weight', NULL, 'Parmigiano Reggiano cheese', NULL, 'manual', '1234567890132', '2025-01-13', 5, '2025-01-15 10:00:00'),
('Avocados, 5 ct', 'Member''s Mark', 'Fruits', true, 4.48, 8.5, 14.7, 2, 160.3, 5, 100, 1, 'piece', 'package', NULL, 'Avocados', NULL, 'manual', '1234567890133', '2025-01-14', 6, '2025-01-15 10:00:00'),
('Bananas, 3 lb', 'Chiquita / Member''s Mark Organic', 'Fruits', true, 1.97, 22.8, 0.3, 1.1, 97.5, 12, 118, 1, 'piece', 'package', NULL, 'Bananas', NULL, 'manual', '1234567890134', '2025-01-13', 9, '2025-01-15 10:00:00'),
('Simple Truth Organic Shredded Romaine Lettuce, 8 oz', 'Simple Truth', 'Vegetables', true, 2.79, 1.5, 0.1, 0.5, 8.9, 4, 72, 1, 'cup', 'volume', NULL, 'Organic romaine lettuce', NULL, 'manual', '1234567890135', '2025-01-12', 4, '2025-01-15 10:00:00'),
('Plain Nonfat Greek Yogurt, 40 oz', 'Member''s Mark', 'Dairy & Eggs', true, 4.28, 6.1, 0.66, 17.3, 98.74, 1, 170, 1, 'container', 'package', NULL, 'Nonfat Greek yogurt', NULL, 'manual', '1234567890136', '2025-01-11', 5, '2025-01-15 10:00:00'),
('Himalayan Pink Salt, Fine Ground, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 7.00, 0, 0, 0, 0, 200, 5, 1, 'tsp', 'volume', NULL, 'Pink Himalayan salt', NULL, 'manual', '1234567890137', '2025-01-10', 2, '2025-01-15 10:00:00'),
('Black Pepper, Fine, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 8.50, 1, 0, 0, 4, 200, 2, 1, 'tsp', 'volume', NULL, 'Ground black pepper', NULL, 'manual', '1234567890138', '2025-01-09', 3, '2025-01-15 10:00:00'),
('Garlic Powder, Fine, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 8.00, 2.3, 0.02, 0.51, 11.5, 200, 3, 1, 'tsp', 'volume', NULL, 'Ground garlic', NULL, 'manual', '1234567890139', '2025-01-08', 4, '2025-01-15 10:00:00'),
('Organic Ground Ginger, 16 oz', 'Member''s Mark Organic', 'Single-Ingredient Spices/Herbs', true, 8.50, 1.3, 0.1, 0.2, 6.5, 200, 2, 1, 'tsp', 'volume', NULL, 'Organic ground ginger', NULL, 'manual', '1234567890140', '2025-01-07', 2, '2025-01-15 10:00:00'),
('Organic Ground Turmeric, 16 oz', 'Member''s Mark Organic', 'Single-Ingredient Spices/Herbs', true, 8.50, 1.43, 0.22, 0.17, 7.5, 200, 2, 1, 'tsp', 'volume', NULL, 'Organic ground turmeric', NULL, 'manual', '1234567890141', '2025-01-06', 3, '2025-01-15 10:00:00'),
('Multi Bell Sweet Peppers, 6 ct', 'Member''s Mark', 'Vegetables', true, 6.72, 9, 0.5, 1.5, 44.5, 6, 149, 1, 'cup', 'volume', NULL, 'Bell peppers', NULL, 'manual', '1234567890142', '2025-01-05', 4, '2025-01-15 10:00:00'),
('Taylor Farms Brussels Sprouts, 2 lb', 'Taylor Farms', 'Vegetables', true, 4.18, 11, 0.8, 4, 67.2, 8, 156, 1, 'cup', 'volume', NULL, 'Brussels sprouts', NULL, 'manual', '1234567890143', '2025-01-04', 3, '2025-01-15 10:00:00'),
('Anjou Pears, 5 lb', 'Member''s Mark', 'Fruits', true, 8.44, 27, 0.3, 0.6, 112.2, 10, 178, 1, 'piece', 'package', NULL, 'Pears', NULL, 'manual', '1234567890144', '2025-01-03', 5, '2025-01-15 10:00:00'),
('Green Seedless Grapes, 3 lb', 'Member''s Mark', 'Fruits', true, 5.97, 16, 0.3, 0.6, 67.8, 6, 92, 1, 'cup', 'volume', NULL, 'Green seedless grapes', NULL, 'manual', '1234567890145', '2025-01-02', 6, '2025-01-15 10:00:00'),
('Mangos, 8.8 lb', 'Member''s Mark', 'Fruits', true, 8.18, 25, 0.6, 1.4, 109.6, 8, 165, 1, 'cup', 'volume', NULL, 'Mangoes', NULL, 'manual', '1234567890146', '2025-01-01', 4, '2025-01-15 10:00:00'),
('Bone-In Chicken Drumsticks, 2 lb', 'Member''s Mark', 'Proteins', true, 5.75, 0, 5.7, 24.2, 147.5, 8, 100, 3.5, 'oz', 'weight', NULL, 'Chicken drumsticks (skinless, boneless)', NULL, 'manual', '1234567890147', '2024-12-30', 5, '2025-01-15 10:00:00'),
('Bone-In Chicken Thighs, 2 lb', 'Member''s Mark', 'Proteins', true, 8.13, 0, 8.2, 24.8, 161.6, 8, 100, 3.5, 'oz', 'weight', NULL, 'Chicken thighs (skinless, boneless)', NULL, 'manual', '1234567890148', '2024-12-29', 4, '2025-01-15 10:00:00'),
('Grass Fed Beef Ribeye Steak, 1.5 lb', 'Member''s Mark', 'Proteins', true, 19.17, 0, 10.8, 23.8, 178.4, 4, 85, 3, 'oz', 'weight', NULL, 'Ribeye steak', NULL, 'manual', '1234567890149', '2024-12-28', 3, '2025-01-15 10:00:00'),
('Prime Beef Strip Steak, 1.5 lb', 'Member''s Mark', 'Proteins', true, 24.67, 0, 7.6, 26, 154.4, 4, 85, 3, 'oz', 'weight', NULL, 'Prime beef strip steak', NULL, 'manual', '1234567890150', '2024-12-27', 2, '2025-01-15 10:00:00'),
('USDA Choice Angus Beef NY Strip Steak, 2 lb', 'Member''s Mark', 'Proteins', true, 49.38, 0, 7.6, 26, 154.4, 4, 85, 3, 'oz', 'weight', NULL, 'USDA Choice Angus beef NY strip', NULL, 'manual', '1234567890151', '2024-12-26', 1, '2025-01-15 10:00:00'),
('Vital Proteins Collagen Peptides Powder, 1.5 lb', 'Vital Proteins', 'Proteins', true, 29.98, 0, 0, 18, 72, 30, 20, 2, 'scoop', 'volume', NULL, 'Hydrolyzed bovine collagen peptides', NULL, 'manual', '1234567890152', '2024-12-25', 3, '2025-01-15 10:00:00'),
('Arm & Hammer Baking Soda, 13.5 lb', 'Arm & Hammer', 'Baking Supplies', true, 27.89, 0, 0, 0, 0, 1000, 5, 1, 'tsp', 'volume', NULL, 'Sodium bicarbonate', NULL, 'manual', '1234567890153', '2024-12-24', 1, '2025-01-15 10:00:00'),
('Coconut Water, 12 fl oz, 12 pk', 'Vita Coco', 'Beverages', true, 19.98, 10.4, 0, 0.5, 43.6, 12, 245, 1, 'cup', 'volume', NULL, 'Coconut water', NULL, 'manual', '1234567890154', '2024-12-23', 8, '2025-01-15 10:00:00'),
('Member''s Mark Purified Water, 16.9 fl oz, 40 pk', 'Member''s Mark', 'Beverages', true, 3.98, 0, 0, 0, 0, 40, 500, 1, 'bottle', 'package', NULL, 'Purified water', NULL, 'manual', '1234567890155', '2024-12-22', 12, '2025-01-15 10:00:00'),
('Organic Raw Unfiltered Apple Cider Vinegar, 32 fl oz', 'Bragg''s', 'Condiments & Sauces', true, 26.00, 0, 0, 0, 0, 100, 15, 1, 'tbsp', 'volume', NULL, 'Organic apple cider vinegar', NULL, 'manual', '1234567890156', '2024-12-21', 2, '2025-01-15 10:00:00'),
('Pure Irish Butter, Salted, Grass-Fed, 8 oz', 'Kerrygold', 'Dairy & Eggs', true, 12.22, 0, 11, 0, 99, 32, 14, 1, 'tbsp', 'volume', 'https://images.openfoodfacts.org/images/products/076/770/701/4777/front_en.7.400.jpg', 'Pasteurized cream, salt, milk', NULL, 'openfoodfacts', '0767707014777', '2024-12-20', 6, '2025-01-15 10:00:00'),
('Daisy Brand Pure and Natural Sour Cream, 14 oz, 2 pk', 'Daisy Brand', 'Dairy & Eggs', true, 4.88, 1, 5, 1, 45, 28, 30, 2, 'tbsp', 'volume', NULL, 'Cultured cream', NULL, 'manual', '1234567890158', '2024-12-19', 4, '2025-01-15 10:00:00'),
('Gold Kiwi, 2 lb', 'Member''s Mark', 'Fruits', true, 7.97, 10.1, 0.4, 0.8, 45.6, 8, 75, 1, 'piece', 'package', NULL, 'Kiwifruit', NULL, 'manual', '1234567890159', '2024-12-18', 5, '2025-01-15 10:00:00'),
('Green Kiwi, 3 lb', 'Member''s Mark', 'Fruits', true, 8.47, 10.1, 0.4, 0.8, 45.6, 12, 75, 1, 'piece', 'package', NULL, 'Kiwifruit', NULL, 'manual', '1234567890160', '2024-12-17', 4, '2025-01-15 10:00:00'),
('Clementine Mandarins, 5 lb', 'Member''s Mark', 'Fruits', true, 7.62, 9, 0, 1, 40, 15, 74, 1, 'piece', 'package', NULL, 'Clementines', NULL, 'manual', '1234567890161', '2024-12-16', 7, '2025-01-15 10:00:00'),
('Onion Powder, Ground, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 8.00, 1.9, 0.02, 0.25, 8.7, 200, 2, 1, 'tsp', 'volume', NULL, 'Ground onion', NULL, 'manual', '1234567890162', '2024-12-15', 3, '2025-01-15 10:00:00'),
('Parsley Flakes, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 7.00, 0.25, 0.03, 0.13, 1.8, 200, 1, 1, 'tsp', 'volume', NULL, 'Dried parsley', NULL, 'manual', '1234567890163', '2024-12-14', 2, '2025-01-15 10:00:00'),
('Cumin, Ground, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 7.00, 0.93, 0.47, 0.37, 8.1, 200, 2, 1, 'tsp', 'volume', NULL, 'Ground cumin seeds', NULL, 'manual', '1234567890164', '2024-12-13', 4, '2025-01-15 10:00:00'),
('Beef Fajita Seasoning, 1 Oz', 'Siete', 'Seasoning Blends/Mixes', true, 2.99, 0, 0, 0, 0, 8, 5, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/c/o/copy-of-810091781128_siete-1oz-beef-fajita-seasoning_front_1_1.jpg?w=1227&jpg_quality=90', 'Smoked Sea Salt, Garlic, Black Pepper, Onions, Paprika, Sea Salt, Hatch Red Chiles, Ground Dates.', NULL, 'manual', '1234567890165', '2024-12-12', 1, '2025-01-15 10:00:00'),
('Chicken Fajita Seasoning, 1 Oz', 'Siete', 'Seasoning Blends/Mixes', true, 2.99, 0, 0, 0, 0, 8, 5, 1, 'tsp', 'volume', 'https://www.instacart.com/assets/domains/product-image/file/large_509357c6-e962-4854-b779-0cd33a935350.png', 'Smoked sea salt, garlic, ground dates, onions, sea salt, black pepper, paprika, cumin, red bell peppers, chile flakes, green bell peppers, lime oil.', NULL, 'manual', '1234567890166', '2024-12-11', 2, '2025-01-15 10:00:00'),
('Cilantro Lime Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 4, 7, 1, 71, 7, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-cilantro-lime-sauce-1126626285_279x.jpg?v=1738777602', 'Water, High Oleic Sunflower Oil, Roasted Poblano Chilies, Cilantro, Parsley, Dehydrated Garlic, Lime Juice Concentrate, Jalapeño, Sea Salt, Lemon Juice Concentrate, Dehydrated Roasted Garlic, Tapioca Starch, Spices, Black Pepper, Xanthan Gum, Sunflower Lecithin, Monkfruit Extract, Citric Acid.', NULL, 'manual', '1234567890167', '2024-12-10', 3, '2025-01-15 10:00:00'),
('Classic Taco Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 17, 1.5, 0, 75, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-classic-taco-sauce-1126626287_1800x1800.jpg?v=1738777608', 'Water, Fire Roasted Tomatoes (Fire Roasted Tomatoes, Tomato Juice, Salt, Citric Acid, Calcium Chloride), Chicken Stock (Chicken Stock, Salt), Roasted Poblano Chilies, Chicken Fat, Cilantro, Spices, Tapioca Starch, Tamarind Puree (Tamarind Pulp, Water), Lime Juice Concentrate, Smoked Granulated Onion, Sea Salt, Yeast Extract, Smoked Paprika, Dehydrated Garlic, Xanthan Gum, Citric Acid, Monk Fruit Extract.', NULL, 'manual', '1234567890168', '2024-12-09', 2, '2025-01-15 10:00:00'),
('Honey Garlic Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 16, 0, 1, 68, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-honey-garlic-sauce-1126626289_1800x1800.jpg?v=1738777800', 'Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Distilled Vinegar, Roasted Garlic, Honey, Orange Juice Concentrate, Yeast Extract, Tapioca Starch, Dehydrated Garlic, Xanthan Gum, Spices, Granulated Onion, Citric Acid, Monk Fruit Extract, Orange Oil.', NULL, 'manual', '1234567890169', '2024-12-08', 4, '2025-01-15 10:00:00'),
('Lemongrass Basil Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 6, 6, 1, 69, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-lemongrass-basil-sauce-1126626297_279x.jpg?v=1738777080', 'Coconut Milk (Coconut Cream, Water), Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Coconut Sugar, Lemongrass Puree (Lemongrass, Water), Basil, Lime Juice Concentrate, Tapioca Starch, Dehydrated Onion, Dehydrated Garlic, Sea Salt, Jalapeño, Spices, Apple Cider Vinegar, Shiitake Mushroom, Paprika, Yeast Extract, Ground Ginger, Xanthan Gum, Citric Acid, Monkfruit Extract.', NULL, 'manual', '1234567890170', '2024-12-07', 2, '2025-01-15 10:00:00'),
('Orange Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 13, 0, 0, 52, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-orange-sauce-1126626298_279x.jpg?v=1738777081', 'Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Orange Juice Concentrate, Coconut Sugar, Distilled Vinegar, Sherry Wine, Tapioca Starch, Yeast Extract, Xanthan Gum, Sea Salt, Spices, Granulated Onion, Granulated Garlic, Citric Acid, Monk Fruit Extract, Orange Oil.', NULL, 'manual', '1234567890171', '2024-12-06', 3, '2025-01-15 10:00:00'),
('Organic Adobo Seasoning, 2.9 Oz', 'Loisa', 'Seasoning Blends/Mixes', true, 7.79, 0, 0, 0, 0, 82, 5, 1, 'tsp', 'volume', 'https://www.instacart.com/image-server/466x466/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/domains/product-image/file/large_0b9bbfc0-eb6f-4f56-967c-bfca1f5491fd.png', 'Sea salt, organic garlic, organic turmeric, organic oregano, organic black pepper.', NULL, 'manual', '1234567890172', '2024-12-05', 1, '2025-01-15 10:00:00'),
('Organic Sazón Seasoning, 2.3 Oz', 'Loisa', 'Seasoning Blends/Mixes', true, 7.79, 0, 0, 0, 0, 65, 5, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/8/5/856633007073_front_1_1.jpg?w=1227&jpg_quality=90', 'Sea salt, organic achiote, organic cumin, organic coriander, organic garlic, organic oregano, organic black pepper.', NULL, 'manual', '1234567890173', '2024-12-04', 2, '2025-01-15 10:00:00'),
('Sea Salt Flakes, 8.5 Oz', 'Maldon', 'Seasoning Blends/Mixes', true, 6.99, 0, 0, 0, 0, 160, 2, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/8/4/847972000009_1_1.jpg?w=1167&jpg_quality=90', 'Sea Salt Flakes.', NULL, 'manual', '1234567890174', '2024-12-03', 3, '2025-01-15 10:00:00'),
('Seasoning Mix, Garden Ranch, 0.81 Oz Pouch', 'Primal Palate', 'Seasoning Blends/Mixes', true, 1.79, 0, 0, 0, 0, 23, 5, 1, 'tsp', 'volume', 'https://shop.primalpalate.com/cdn/shop/products/GardenRanchPacket.jpg?v=1604055766&width=1158', 'Onion, Garlic, Himalayan Pink Salt, Dillweed, Parsley, Chives, Black Pepper.', NULL, 'manual', '1234567890175', '2024-12-02', 4, '2025-01-15 10:00:00'),
('Seasoning, Barbecue Rub, 3.1 Oz', 'Primal Palate', 'Seasoning Blends/Mixes', true, 8.99, 0, 0, 0, 0, 88, 5, 1, 'tsp', 'volume', 'https://shop.primalpalate.com/cdn/shop/products/BarbecueRub.jpg?v=1603741835&width=1200', 'Pink Himalayan Salt, Onion, Garlic, Paprika, Oregano, Turmeric, Black Pepper, Ginger, Cumin, Cayenne, Coriander.', NULL, 'manual', '1234567890176', '2024-12-01', 2, '2025-01-15 10:00:00'),
('Seasoning, Seafood, 2.1 Oz', 'Primal Palate', 'Seasoning Blends/Mixes', true, 8.99, 0, 0, 0, 0, 60, 5, 1, 'tsp', 'volume', 'https://shop.primalpalate.com/cdn/shop/products/SeafoodSeasoning.jpg?v=1603737594&width=1200', 'Pink Himalayan Salt, Onion, Black Pepper, Lemon Peel, Garlic, Bay Leaves, Parsley, Chives.', NULL, 'manual', '1234567890177', '2024-11-30', 3, '2025-01-15 10:00:00'),
('Taco Seasoning, Mild, 1.3 Oz', 'Siete', 'Seasoning Blends/Mixes', true, 2.99, 0, 0, 0, 0, 7, 5, 1, 'tsp', 'volume', 'https://www.instacart.com/assets/domains/product-image/file/large_6482e1c5-1a88-4037-a345-9958061765af.png', 'Chile powder, sea salt, ground dates, tomato powder, garlic powder, nutritional yeast, cumin, onion flakes, cassava flour, cream of tartar, black pepper, and paprika.', NULL, 'manual', '1234567890178', '2024-11-29', 5, '2025-01-15 10:00:00'),
('Thai Coconut Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', true, 3.79, 7, 7, 1, 71, 3.5, 60, 2, 'tbsp', 'volume', 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-thai-coconut-sauce-1126626298_279x.jpg?v=1738776726', 'Coconut Milk (Coconut Cream, Water), Water, Coconut Sugar, Lime Juice Concentrate, Spices, Tapioca Starch, Basil, Yeast Extract, Dehydrated Onion, Basil, Dehydrated Garlic, Sea Salt, Lemongrass Puree (Lemongrass, Water), Turmeric, Xanthan Gum, Dehydrated Ginger, Citric Acid, Black Pepper, Monkfruit Extract.', NULL, 'manual', '1234567890179', '2024-11-28', 3, '2025-01-15 10:00:00'),
('The New Primal, Noble Made Organic All-Purpose Seasoning, 2 oz', 'The New Primal (Noble Made)', 'Seasoning Blends/Mixes', true, 6.99, 0, 0, 0, 0, 81, 5, 1, 'tsp', 'volume', 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_724cd215-3482-4ba7-9d67-65c893a7e642.jpg', 'Organic Dehydrated Garlic, Sea Salt, Organic Ground Mustard Seed, Organic Black Pepper, Organic Lemon Peel, Organic Apple Cider Vinegar Powder (Organic Apple Cider Vinegar, Organic Acacia Gum), Organic Rosemary, Organic Basil, Citric Acid, Organic Lemon Juice Powder.', NULL, 'manual', '1234567890180', '2024-11-27', 2, '2025-01-15 10:00:00'),
('The New Primal, Noble Made Poultry Seasoning, 2.6 oz', 'The New Primal (Noble Made)', 'Seasoning Blends/Mixes', true, 6.99, 0, 0, 0, 0, 82, 5, 1, 'tsp', 'volume', 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_03aa38c4-213d-4a6f-a695-c35bff5b7b56.jpg', 'Organic Dehydrated Garlic, Organic Dehydrated Onion, Sea Salt, Organic Cracked Black Pepper, Organic Orange Peel, Organic Cayenne, Organic Sage, Organic Parsley, Organic Dehydrated Green Bell Pepper.', NULL, 'manual', '1234567890181', '2024-11-26', 4, '2025-01-15 10:00:00'),
('The New Primal, Noble Made Steak Seasoning, 2.5 oz', 'The New Primal (Noble Made)', 'Seasoning Blends/Mixes', true, 6.99, 0, 0, 0, 0, 89, 5, 1, 'tsp', 'volume', 'https://img.thrivemarket.com/store/full/8/5/850000398412_front_1__1_1.jpg', 'Sea salt, organic cracked black pepper, organic dehydrated garlic, organic dehydrated onion, organic coriander, organic dill seed powder, organic coriander seed, organic dill seed.', NULL, 'manual', '1234567890182', '2024-11-25', 2, '2025-01-15 10:00:00'),
-- Additional items needed for recipes
('Fresh Cucumber, 1 lb', 'Member''s Mark', 'Vegetables', true, 1.99, 3.6, 0.1, 0.7, 17.9, 4, 100, 1, 'piece', 'package', NULL, 'Fresh cucumber', NULL, 'manual', '1234567890183', '2024-11-24', 3, '2025-01-15 10:00:00'),
('Fresh Lemon Juice, 32 fl oz', 'Member''s Mark', 'Condiments & Sauces', true, 4.98, 2.5, 0, 0.2, 10.8, 64, 15, 1, 'tbsp', 'volume', NULL, 'Fresh lemon juice', NULL, 'manual', '1234567890184', '2024-11-23', 2, '2025-01-15 10:00:00'),
('Fresh Dill, 1 oz', 'Member''s Mark', 'Vegetables', true, 2.49, 1.1, 0.1, 0.4, 6.8, 8, 3.5, 1, 'tbsp', 'volume', NULL, 'Fresh dill', NULL, 'manual', '1234567890185', '2024-11-22', 1, '2025-01-15 10:00:00'),
('Coconut Aminos, 16 fl oz', 'Coconut Secret', 'Condiments & Sauces', true, 8.99, 0, 0, 0, 0, 32, 15, 1, 'tbsp', 'volume', NULL, 'Coconut aminos', NULL, 'manual', '1234567890186', '2024-11-21', 2, '2025-01-15 10:00:00'),
('Red Pepper Flakes, 2 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 3.99, 0, 0, 0, 0, 100, 2, 1, 'tsp', 'volume', NULL, 'Red pepper flakes', NULL, 'manual', '1234567890187', '2024-11-20', 1, '2025-01-15 10:00:00'),
('Fresh Cauliflower, 1 head', 'Member''s Mark', 'Vegetables', true, 3.99, 5.3, 0.3, 2.0, 31.2, 6, 100, 1, 'cup', 'volume', NULL, 'Fresh cauliflower', NULL, 'manual', '1234567890188', '2024-11-19', 2, '2025-01-15 10:00:00'),
('Fresh Pineapple, 1 piece', 'Member''s Mark', 'Fruits', true, 4.99, 22.0, 0.1, 0.9, 94.9, 8, 100, 1, 'cup', 'volume', NULL, 'Fresh pineapple', NULL, 'manual', '1234567890189', '2024-11-18', 1, '2025-01-15 10:00:00'),
('Fresh Red Bell Pepper, 1 piece', 'Member''s Mark', 'Vegetables', true, 1.49, 6.0, 0.3, 1.0, 30.7, 1, 100, 1, 'piece', 'package', NULL, 'Fresh red bell pepper', NULL, 'manual', '1234567890190', '2024-11-17', 2, '2025-01-15 10:00:00'),
('Fresh Green Onions, 1 bunch', 'Member''s Mark', 'Vegetables', true, 1.99, 1.8, 0.1, 0.5, 10.2, 8, 15, 1, 'tbsp', 'volume', NULL, 'Fresh green onions', NULL, 'manual', '1234567890191', '2024-11-16', 1, '2025-01-15 10:00:00'),
('Raw Cashews, 16 oz', 'Member''s Mark', 'Snacks', true, 8.99, 8.6, 12.4, 5.2, 157.6, 16, 28, 0.25, 'cup', 'volume', NULL, 'Raw cashews', NULL, 'manual', '1234567890192', '2024-11-15', 2, '2025-01-15 10:00:00'),
('Almond Flour, 16 oz', 'Member''s Mark', 'Baking Supplies', true, 12.99, 6.0, 14.0, 6.0, 134.0, 32, 28, 0.25, 'cup', 'volume', NULL, 'Almond flour', NULL, 'manual', '1234567890193', '2024-11-14', 1, '2025-01-15 10:00:00'),
('Vanilla Protein Powder, 1 lb', 'Member''s Mark', 'Proteins', true, 24.99, 3.0, 1.5, 24.0, 121.5, 30, 30, 1, 'scoop', 'volume', NULL, 'Vanilla protein powder', NULL, 'manual', '1234567890194', '2024-11-13', 2, '2025-01-15 10:00:00'),
('Ground Cinnamon, 16 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 7.99, 1.8, 0.1, 0.2, 8.5, 200, 2, 1, 'tsp', 'volume', NULL, 'Ground cinnamon', NULL, 'manual', '1234567890195', '2024-11-12', 1, '2025-01-15 10:00:00'),
('Pure Vanilla Extract, 8 fl oz', 'Member''s Mark', 'Baking Supplies', true, 9.99, 0, 0, 0, 0, 96, 5, 1, 'tsp', 'volume', NULL, 'Pure vanilla extract', NULL, 'manual', '1234567890196', '2024-11-11', 2, '2025-01-15 10:00:00'),

-- New items for additional recipes from All-Apple Recipes.txt
('Basmati Rice, 10 lb', 'Member''s Mark', 'Grains & Starches', true, 15.98, 45, 0.5, 4, 200, 160, 50, 0.25, 'cup', 'volume', NULL, 'Long grain basmati rice', NULL, 'manual', '1234567890197', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Coconut Flour, 16 oz', 'Member''s Mark Organic', 'Baking Supplies', true, 8.99, 8, 4, 4, 120, 32, 30, 2, 'tbsp', 'volume', NULL, 'Organic coconut flour', NULL, 'manual', '1234567890198', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Tapioca Starch, 16 oz', 'Bob''s Red Mill', 'Baking Supplies', true, 6.99, 26, 0, 0, 100, 32, 30, 2, 'tbsp', 'volume', NULL, 'Pure tapioca starch', NULL, 'manual', '1234567890199', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Baking Powder, 10 oz', 'Member''s Mark', 'Baking Supplies', true, 3.99, 1, 0, 0, 2, 200, 4, 1, 'tsp', 'volume', NULL, 'Aluminum-free baking powder', NULL, 'manual', '1234567890200', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Fresh Lime Juice, 32 fl oz', 'Member''s Mark', 'Condiments & Sauces', true, 4.98, 2.8, 0, 0.1, 11.2, 64, 15, 1, 'tbsp', 'volume', NULL, 'Fresh lime juice', NULL, 'manual', '1234567890201', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Red Onions, 3 lb', 'Member''s Mark', 'Vegetables', true, 2.99, 9.3, 0.1, 1.1, 42.4, 8, 110, 1, 'piece', 'package', NULL, 'Red onions', NULL, 'manual', '1234567890202', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Fresh Cilantro, 1 bunch', 'Member''s Mark', 'Vegetables', true, 1.99, 0.9, 0.1, 0.3, 5.4, 6, 16, 2, 'tbsp', 'volume', NULL, 'Fresh cilantro', NULL, 'manual', '1234567890203', '2025-01-15', 3, '2025-01-15 10:00:00'),
('Jalapeño Peppers, 1 lb', 'Member''s Mark', 'Vegetables', true, 1.49, 1.4, 0.1, 0.2, 7.4, 6, 14, 1, 'piece', 'package', NULL, 'Fresh jalapeño peppers', NULL, 'manual', '1234567890204', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Butternut Squash, 2 lb', 'Member''s Mark', 'Vegetables', true, 3.99, 16.4, 0.2, 1.4, 67.2, 4, 140, 1, 'cup', 'volume', NULL, 'Fresh butternut squash', NULL, 'manual', '1234567890205', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Avocado Oil, 16.9 fl oz', 'Primal Kitchen', 'Oils & Fats', true, 12.99, 0, 14, 0, 124, 34, 14, 1, 'tbsp', 'volume', NULL, 'Pure avocado oil', NULL, 'manual', '1234567890206', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Beef Short Ribs, 3 lb', 'Member''s Mark', 'Proteins', true, 28.99, 0, 22, 18, 256, 6, 113, 4, 'oz', 'weight', NULL, 'Beef short ribs', NULL, 'manual', '1234567890207', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Chili Powder, 2.5 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 2.99, 1.4, 0.7, 0.6, 8.1, 50, 2, 1, 'tsp', 'volume', NULL, 'Ground chili powder', NULL, 'manual', '1234567890208', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Dried Oregano, 1 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 2.49, 1.0, 0.2, 0.4, 5.2, 30, 1, 1, 'tsp', 'volume', NULL, 'Dried oregano leaves', NULL, 'manual', '1234567890209', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Paprika, 2.4 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 2.99, 1.2, 0.3, 0.5, 6.0, 60, 2, 1, 'tsp', 'volume', NULL, 'Ground paprika', NULL, 'manual', '1234567890210', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Dried Thyme, 0.75 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 2.99, 1.4, 0.2, 0.3, 7.6, 22, 1, 1, 'tsp', 'volume', NULL, 'Dried thyme leaves', NULL, 'manual', '1234567890211', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Cayenne Pepper, 2.6 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 3.49, 1.0, 0.3, 0.2, 6.0, 75, 1, 1, 'tsp', 'volume', NULL, 'Ground cayenne pepper', NULL, 'manual', '1234567890212', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Whole Milk, 1 gallon', 'Member''s Mark', 'Dairy & Eggs', true, 3.99, 12, 8, 8, 150, 16, 240, 1, 'cup', 'volume', NULL, 'Whole milk', NULL, 'manual', '1234567890213', '2025-01-15', 3, '2025-01-15 10:00:00'),
('Heavy Cream, 32 fl oz', 'Member''s Mark', 'Dairy & Eggs', true, 4.99, 1, 11, 1, 103, 32, 30, 2, 'tbsp', 'volume', NULL, 'Heavy whipping cream', NULL, 'manual', '1234567890214', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Unsweetened Almond Milk, 64 fl oz', 'Member''s Mark', 'Beverages', true, 2.99, 1, 2.5, 1, 37.5, 8, 240, 1, 'cup', 'volume', NULL, 'Unsweetened almond milk', NULL, 'manual', '1234567890215', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Tomato Paste, 6 oz', 'Member''s Mark', 'Condiments & Sauces', true, 1.49, 4.6, 0.2, 1.6, 13.5, 12, 30, 2, 'tbsp', 'volume', NULL, 'Concentrated tomato paste', NULL, 'manual', '1234567890216', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Dijon Mustard, 8 oz', 'Member''s Mark', 'Condiments & Sauces', true, 2.99, 1, 0, 1, 5, 16, 15, 1, 'tsp', 'volume', NULL, 'Dijon mustard', NULL, 'manual', '1234567890217', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Dark Chocolate Chips, 12 oz', 'Member''s Mark', 'Snacks', true, 4.99, 8, 8, 2, 70, 24, 15, 1, 'tbsp', 'volume', NULL, 'Dark chocolate chips (70% cocoa)', NULL, 'manual', '1234567890218', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Coconut Milk, Full Fat, 13.5 fl oz', 'Member''s Mark Organic', 'Beverages', true, 1.99, 3, 20, 2, 185, 6, 60, 0.25, 'cup', 'volume', NULL, 'Organic coconut milk', NULL, 'manual', '1234567890219', '2025-01-15', 3, '2025-01-15 10:00:00'),
('Organic Ketchup, 32 oz', 'Member''s Mark Organic', 'Condiments & Sauces', true, 3.99, 4, 0, 0, 15, 32, 17, 1, 'tbsp', 'volume', NULL, 'Organic tomato ketchup', NULL, 'manual', '1234567890220', '2025-01-15', 2, '2025-01-15 10:00:00'),
('Dried Basil, 0.62 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 2.99, 0.6, 0.2, 0.8, 5.5, 18, 1, 1, 'tsp', 'volume', NULL, 'Dried basil leaves', NULL, 'manual', '1234567890221', '2025-01-15', 1, '2025-01-15 10:00:00'),
('Smoked Paprika, 2.3 oz', 'Member''s Mark', 'Single-Ingredient Spices/Herbs', true, 3.99, 1.2, 0.3, 0.5, 6.0, 65, 2, 1, 'tsp', 'volume', NULL, 'Smoked paprika', NULL, 'manual', '1234567890222', '2025-01-15', 1, '2025-01-15 10:00:00');

-- Insert initial tags
INSERT INTO tags (name, color, description, created_at, updated_at) VALUES
('paleo', '#8b5cf6', 'Paleo diet friendly', NOW(), NOW()),
('paleo - allowing rice', '#8b5cf6', 'Paleo diet friendly, allowing rice', NOW(), NOW()),
('gluten-free', '#f59e0b', 'Contains no gluten', NOW(), NOW()),
('dairy-free', '#10b981', 'Contains no dairy products', NOW(), NOW()),
('vegetarian', '#22c55e', 'Suitable for vegetarians', NOW(), NOW()),
('vegan', '#059669', 'Suitable for vegans', NOW(), NOW()),
('keto-friendly', '#dc2626', 'Suitable for ketogenic diet', NOW(), NOW()),
('high-protein', '#3b82f6', 'High in protein content', NOW(), NOW()),
('low-carb', '#f97316', 'Low in carbohydrates', NOW(), NOW()),
('meal-prep', '#6366f1', 'Great for meal preparation', NOW(), NOW()),
('quick-meals', '#ec4899', 'Can be prepared quickly', NOW(), NOW()),
('breakfast', '#eab308', 'Breakfast dishes', NOW(), NOW()),
('lunch', '#14b8a6', 'Lunch dishes', NOW(), NOW()),
('dinner', '#8b5cf6', 'Dinner dishes', NOW(), NOW()),
('snack', '#f59e0b', 'Snack foods', NOW(), NOW()),
('dessert', '#ec4899', 'Dessert dishes', NOW(), NOW()),
('sauce', '#6b7280', 'Sauces and condiments', NOW(), NOW()),
('side-dish', '#84cc16', 'Side dishes', NOW(), NOW()),
('main-dish', '#dc2626', 'Main course dishes', NOW(), NOW()),
('protein-rich', '#3b82f6', 'Rich in protein', NOW(), NOW()),
('stir-fry', '#f97316', 'Stir-fry dishes', NOW(), NOW());

-- Insert recipes from Recipes.md
INSERT INTO recipes (name, total_time, servings, instructions, notes, nutrition_per_serving, is_favorite, created_at, updated_at) VALUES
('Tzatziki', 15, 8, '1. Prepare the cucumber: Peel the cucumber (optional, based on your preference). Cut it into chunks and place it in the food processor. Pulse briefly until finely chopped (but not pureed). Transfer the chopped cucumber to a fine-mesh sieve or cheesecloth. Press or squeeze out excess water thoroughly.

2. Combine ingredients: Return the drained cucumber to the food processor. Add the Greek yogurt, minced garlic, olive oil, lemon juice, dill, and a pinch of salt and black pepper.

3. Blend: Pulse the mixture until you reach your desired consistency: For chunky tzatziki: Pulse briefly. For smooth tzatziki: Blend longer.

4. Taste and adjust: Taste the mixture and adjust seasoning as needed. Add more lemon juice, dill, or salt to suit your preferences.

5. Chill: Transfer the tzatziki to a serving bowl. Cover and refrigerate for at least 30 minutes to allow the flavors to meld.', 'Perfect as a dip for fresh vegetables, crackers, or pita bread. Excellent alongside grilled meats, fish, or roasted vegetables. Great as a sauce for wraps, bowls, or salads. Can be made dairy-free by using coconut yogurt. Best when chilled for at least 30 minutes before serving.', '{"calories": 45, "protein": 2, "carbs": 3, "fat": 3}', false, NOW(), NOW()),
('Coconut Aminos Sauce', 8, 4, '1. Combine ingredients: In a small saucepan, whisk together the coconut aminos, water, apple cider vinegar, honey or maple syrup (if using), red pepper flakes (if using), powdered ginger, and granulated garlic.

2. Heat and simmer: Bring the mixture to a simmer over medium heat. Let it simmer for 2-3 minutes, or until the flavors have combined and the sauce has thickened slightly.

3. Cool and use: Remove from heat and let cool slightly before using.', 'Versatile sauce perfect for drizzling over grilled or roasted meats. Excellent tossed with stir-fries or salads. Works great as a marinade for chicken or tofu. Perfect dipping sauce for spring rolls or dumplings. Store in refrigerator for up to a week. Can be made sweeter with honey or spicier with extra red pepper flakes.', '{"calories": 25, "protein": 0, "carbs": 5, "fat": 0}', false, NOW(), NOW()),
('Paleo Pineapple Fried Rice with Chicken Breast', 35, 4, '1. Prepare the cauliflower rice: In a large skillet or wok, heat the avocado oil over medium heat. Add the riced cauliflower and salt. Cook, stirring occasionally, for 5-7 minutes, or until the cauliflower rice is softened slightly. Remove from the pan and set aside.

2. Cook the chicken: Heat the remaining avocado oil in the same skillet over medium-high heat. Add the diced chicken and cook for 5-7 minutes, or until golden brown and cooked through. Remove the chicken from the pan and set aside.

3. Sauté the aromatics: Add the garlic and ginger to the pan and cook for 30 seconds, or until fragrant.

4. Incorporate vegetables and pineapple: Add the chopped red bell pepper and white parts of the green onion to the pan. Cook for 2-3 minutes, or until softened slightly. Then, add the chopped pineapple and cook for another minute.

5. Scramble the eggs: Push the vegetables to one side of the pan and pour in the beaten eggs. Scramble the eggs until cooked through, then stir them together with the vegetables.

6. Combine everything: Add the cooked cauliflower rice, chicken, coconut aminos, and cashews (if using) back to the pan. Stir-fry for 2-3 minutes, or until everything is heated through.

7. Season and serve: Season with salt and black pepper to taste. Garnish with the green parts of the green onion and serve immediately.', 'Great meal prep option - stores well for up to 3 days in refrigerator. Add extra vegetables like broccoli, carrots, or snap peas for more nutrition. Can substitute soy sauce for coconut aminos if not following paleo diet. Cashews are optional but add great crunch. Best served immediately while hot, but reheats well in skillet or microwave.', '{"calories": 285, "protein": 24, "carbs": 18, "fat": 12}', false, NOW(), NOW()),
('Bacon Brussels Sprouts', 40, 4, '1. Preheat oven to 400°F (200°C).

2. Prepare sprouts: Trim the stem end of each Brussels sprout. Remove loose or yellow leaves. Cut each sprout in half lengthwise (through the stem). Quarter large ones.

3. Combine: In a bowl, toss Brussels sprouts with chopped raw bacon, oil, salt, and pepper.

4. Roast: Spread on a parchment-lined baking sheet in a single layer, cut side down. Roast for 25–30 minutes, flipping halfway, until Brussels are golden and bacon is crisp.

5. Optional Glaze: Drizzle with balsamic vinegar or raw honey. Roast for an additional 2 minutes to lightly caramelize.', 'Perfect side dish for any protein. Add sliced garlic or red pepper flakes for extra flavor. Use two baking sheets if needed to avoid overcrowding for maximum crispiness. Optional balsamic glaze adds sweet-tangy finish. Great for meal prep - can be made ahead and reheated. Pairs excellently with roasted meats or as part of a hearty salad.', '{"calories": 165, "protein": 8, "carbs": 12, "fat": 11}', false, NOW(), NOW()),
('Paleo Banana Almond Flour Protein Waffles', 35, 12, '1. Preheat your waffle iron and lightly grease with coconut oil or spray.

2. In a large bowl, mash the bananas or blend them until smooth.

3. Whisk in the eggs, melted oil, and vanilla.

4. In another bowl, mix almond flour, protein powder, baking soda, cinnamon, and salt.

5. Combine wet and dry until just mixed (don''t over-stir).

6. Pour ~1/3–1/2 cup of batter per waffle and cook for 3–5 min or until golden brown.

7. Serve hot or store for later!', 'Excellent meal prep breakfast - makes 12 waffles that freeze beautifully for up to a month. Let cool completely before storing to maintain crispiness. Reheat in toaster or waffle iron for best texture (avoid microwave). Great topped with almond butter, berries, or maple syrup. High protein content makes them very filling. Can be made ahead for busy mornings.', '{"calories": 195, "protein": 12, "carbs": 14, "fat": 9}', false, NOW(), NOW()),

-- Additional recipes from All-Apple Recipes.txt
('Reverse Sear Steak', 40, 1, '1. Preheat oven to 275°F (135°C). Place a wire rack on a baking sheet.

2. Season the steak generously with salt and pepper on both sides.

3. Place steak on the wire rack and insert a meat thermometer probe into the thickest part.

4. Cook in the oven until internal temperature reaches 120°F (49°C) for medium-rare, about 25-30 minutes depending on thickness.

5. Remove from oven and let rest for 5 minutes to reach 125°F (52°C).

6. Heat a cast iron skillet or heavy pan over high heat until smoking.

7. Sear the steak for 1 minute on each side, or until desired crust forms.

8. Serve immediately.', 'Perfect method for thick steaks (1.5+ inches). Results in even cooking throughout with a beautiful crust. Rest time is crucial for even temperature. Can finish with butter, garlic, and herbs in the pan for extra flavor.', '{"calories": 280, "protein": 26, "carbs": 0, "fat": 18}', false, NOW(), NOW()),

('Jasmine Rice', 17, 4, '1. In a 4-quart saucepan over high heat, bring 1½ cups room temperature water to a boil.

2. Add 1 cup jasmine rice, 1 tablespoon oil, and ½ teaspoon kosher salt. Stir once.

3. Bring to a second boil, then cover with a tight-fitting lid.

4. Reduce heat to low/simmer and cook for 15 minutes or until all water has been absorbed.

5. Remove from heat and let stand 5 minutes before fluffing with a fork.', 'Perfect ratio for fluffy jasmine rice. Do not lift lid during cooking. Can substitute coconut oil for olive oil. Doubles easily for 8 servings using 2 cups rice and 3 cups water.', '{"calories": 180, "protein": 3, "carbs": 42, "fat": 3.5}', false, NOW(), NOW()),

('Basmati Rice', 22, 4, '1. In a 4-quart saucepan over high heat, bring 2 cups room temperature water to a boil.

2. Add 1 cup basmati rice, 1 tablespoon oil, and ½ teaspoon kosher salt. Stir once.

3. Bring to a second boil and let it boil until the water and rice are at the same level.

4. Cover with a tight-fitting lid and reduce heat to low/simmer.

5. Cook for 15 minutes or until all water has been absorbed.

6. Remove from heat and let stand 5 minutes before fluffing with a fork.', 'Key is to boil uncovered until water level matches rice level, then cover. This prevents mushy rice. Basmati needs more water than jasmine rice due to longer grains.', '{"calories": 200, "protein": 4, "carbs": 45, "fat": 3.5}', false, NOW(), NOW()),

('Coconut Almond Flour Waffles', 30, 4, '1. Preheat waffle iron according to manufacturer''s instructions.

2. In a large bowl, mash 1 medium banana until almost smooth. Whisk in 3 eggs (at room temperature), 1 teaspoon vanilla extract, and 1 tablespoon melted coconut oil.

3. In a separate bowl, whisk together ½ cup almond flour, 2-3 tablespoons coconut flour, ½ teaspoon baking powder, and ¼ teaspoon salt.

4. Add dry ingredients to wet ingredients and stir until just combined. Let batter rest for 10 minutes (coconut flour needs time to absorb moisture).

5. If batter seems too loose after resting, stir in an extra teaspoon of coconut flour.

6. Generously grease waffle iron with coconut oil or non-stick spray.

7. Pour about ¼ cup batter per waffle. Cook for 3-5 minutes until golden brown and firm.

8. Serve warm with favorite toppings.', 'Start with 2 tbsp coconut flour and add more if needed - it absorbs liquid differently than regular flour. Resting the batter is crucial for proper texture. Waffles should be fully set before removing to prevent crumbling.', '{"calories": 165, "protein": 8, "carbs": 8, "fat": 12}', false, NOW(), NOW()),

('Paleo Vanilla Loaf', 60, 8, '1. Preheat oven to 350°F (175°C). Grease an 8x4-inch loaf pan with coconut oil or line with parchment paper.

2. In a large bowl, whisk together 2 cups almond flour, ½ cup tapioca starch, ½ teaspoon baking soda, ¼ teaspoon sea salt, 2 tablespoons coconut sugar (optional), and ½ teaspoon vanilla powder.

3. In a separate bowl, whisk together 3 large eggs, ¼ cup melted coconut oil, ¼ cup almond milk, 1 teaspoon apple cider vinegar, and 1 teaspoon vanilla extract (if not using vanilla powder).

4. Pour wet ingredients into dry ingredients and mix until just combined. Do not overmix.

5. Pour batter into prepared loaf pan and smooth top with spatula.

6. Bake for 40-50 minutes, until top is golden brown and toothpick inserted in center comes out clean.

7. Cool in pan for 10 minutes, then transfer to wire rack to cool completely.', 'Check at 40 minutes as ovens vary. Cover with foil if top browns too quickly. Extra egg adds structure for loaf format. Can add nuts, chocolate chips, or berries. Store covered for up to 3 days.', '{"calories": 195, "protein": 7, "carbs": 12, "fat": 14}', false, NOW(), NOW()),

('Paleo Fried Chicken', 35, 8, '1. Pat 3.48 lbs boneless, skinless chicken thighs dry with paper towels. Optional: pound slightly for even thickness.

2. In a large bowl, whisk together 2 cups almond flour, 1 tablespoon garlic powder, 1 tablespoon onion powder, 1 teaspoon smoked paprika, 1 teaspoon dried thyme, ½ teaspoon cayenne pepper, 1 teaspoon kosher salt, and ½ teaspoon black pepper.

3. In another bowl, whisk together 2 large eggs and ¼ cup unsweetened almond milk.

4. Heat coconut oil in a large Dutch oven to 350°F (175°C), about ½ inch deep.

5. Working in batches, dip each chicken piece in egg mixture, letting excess drip off. Then coat thoroughly in almond flour mixture, pressing to ensure good adhesion.

6. Carefully add breaded chicken to hot oil. Don''t overcrowd. Cook 5-7 minutes per side until golden brown and internal temperature reaches 165°F (74°C).

7. Transfer to paper towel-lined plate to drain. Let rest few minutes before serving.', 'Without tapioca flour, press almond flour coating firmly for better adhesion. Double dredging (egg-flour-egg-flour) creates extra crispy coating. Monitor oil temperature carefully. May take slightly longer to cook through than traditional breaded chicken.', '{"calories": 285, "protein": 28, "carbs": 6, "fat": 16}', false, NOW(), NOW()),

('Paleo Meatloaf', 70, 8, '1. Preheat oven to 375°F (190°C).

2. In a large mixing bowl, combine 3 pounds 80/20 ground beef, ¾ cup almond flour, 1½ tablespoons Dijon mustard, 3 tablespoons ketchup, 3 tablespoons coconut aminos, 1 cooked and cooled diced medium onion, 3 minced garlic cloves, 3 beaten large eggs, salt, and black pepper.

3. Mix thoroughly with hands until evenly distributed.

4. Cook a small portion in a pan to taste test and adjust seasoning as needed.

5. Transfer mixture to a baking dish or shape into a loaf on greased parchment-lined baking sheet.

6. Spread ¼ cup ketchup on top with back of spoon.

7. Bake for 45-50 minutes or until internal temperature reaches 160°F (71°C).

8. Let rest 15-20 minutes before slicing. Garnish with minced parsley.', 'Cooking the onion first prevents raw onion taste and excess moisture. Taste testing ensures proper seasoning. Resting time allows juices to redistribute for better slicing. Can make ahead and refrigerate before baking.', '{"calories": 295, "protein": 25, "carbs": 4, "fat": 19}', false, NOW(), NOW()),

('Simple Paleo Waffles', 25, 6, '1. Preheat waffle iron and lightly grease with coconut oil.

2. In a large bowl, mash 2 ripe bananas until smooth.

3. Whisk 2 eggs in a separate bowl, then add to mashed bananas.

4. Whisk in ¼ cup canned coconut milk, 1 tablespoon melted coconut oil, and 1 tablespoon honey or maple syrup (optional).

5. In another bowl, whisk together 1½ cups almond flour, ½ teaspoon baking soda, ½ teaspoon cinnamon, and ¼ teaspoon salt.

6. Gradually add dry ingredients to wet ingredients, mixing until just combined. Don''t overmix.

7. Pour ⅓-½ cup batter per waffle and cook for 3-5 minutes until golden brown and crispy.

8. Serve immediately with paleo-friendly toppings.', 'For fluffier waffles, separate eggs and beat whites to stiff peaks before folding in. Leftover waffles freeze well - reheat in toaster. Full-fat coconut milk gives richest texture. Can add vanilla extract or spices for variation.', '{"calories": 175, "protein": 7, "carbs": 12, "fat": 12}', false, NOW(), NOW()),

('Baked BBQ Beef Ribs', 225, 6, '1. Preheat oven to 250°F (120°C).

2. In a bowl, combine 2 tablespoons chili powder, 1 tablespoon garlic powder, 1 tablespoon onion powder, 1 teaspoon paprika, ½ teaspoon dried oregano, salt, and black pepper.

3. Season 3 pounds beef ribs generously with spice rub on all sides. Optional: marinate 4 hours to overnight.

4. Place seasoned ribs in roasting pan. Pour ½ cup water in bottom of pan. Cover tightly with foil.

5. Bake for 3-4 hours until meat is tender and pulls away from bone.

6. Meanwhile, prepare BBQ sauce: Combine ¼ cup coconut aminos, 2 tablespoons tomato paste, 1 tablespoon apple cider vinegar, 1 teaspoon Worcestershire (optional), pinch of smoked paprika, and black pepper.

7. Increase oven to 400°F (200°C). Remove foil and brush ribs with BBQ sauce.

8. Broil 4-5 minutes per side until sauce caramelizes.

9. Serve with additional sauce on side.', 'Low and slow cooking ensures tender ribs. Water prevents drying out. Can make more complex sauce by sautéing onions, adding tomatoes and apple. Sauce should be thick enough to coat ribs. Great with roasted vegetables or salad.', '{"calories": 385, "protein": 24, "carbs": 6, "fat": 28}', false, NOW(), NOW()),

('Cinnamon Roasted Butternut Squash', 45, 8, '1. Preheat oven to 400°F (200°C). Line baking sheet with parchment paper.

2. Peel and cube 2 pounds butternut squash into 1-inch pieces.

3. In a large bowl, toss cubed squash with 2 tablespoons avocado oil, 1½ teaspoons ground cinnamon, ½ teaspoon sea salt, and ¼ teaspoon black pepper until evenly coated.

4. Spread in single layer on prepared baking sheet. Avoid overcrowding.

5. Roast for 25-35 minutes until tender and golden brown on edges. Check doneness by piercing with fork.

6. Optional: Garnish with fresh rosemary sprigs.

7. Serve immediately.', 'Don''t overcrowd pan for even browning. Can drizzle with maple syrup after roasting for extra sweetness (not strictly paleo). Try different spice blends like Italian seasoning. Stores well in fridge for 4 days - great for meal prep or adding to salads.', '{"calories": 65, "protein": 1, "carbs": 16, "fat": 3.5}', false, NOW(), NOW()),

('Fried Boneless Chicken Thighs', 23, 4, '1. Pat 4 boneless, skinless chicken thighs dry and season lightly with salt.

2. In a shallow bowl, whisk 2 large eggs. In another bowl, combine 1 cup almond flour, ½ teaspoon garlic powder, ½ teaspoon onion powder, 1 teaspoon paprika, ½ teaspoon dried thyme, ¼ teaspoon black pepper, and salt to taste.

3. Heat avocado oil in large skillet over medium heat to ¼ inch depth.

4. Dredge each thigh in egg mixture, letting excess drip off. Then coat thoroughly in almond flour mixture.

5. Carefully place in hot oil. Cook 3-4 minutes per side until golden brown and internal temperature reaches 165°F (74°C).

6. Transfer to paper towel-lined plate to drain. Season with additional salt if desired.', 'Thighs stay juicier than breasts. For thicker coating, double dredge (egg-flour-egg-flour). Can bake at 400°F for 20-25 minutes per side instead of frying. Use high smoke point oil for frying. Don''t use olive oil due to low smoke point.', '{"calories": 245, "protein": 26, "carbs": 5, "fat": 13}', false, NOW(), NOW()),

('Classic Guacamole', 10, 6, '1. Cut 2-3 ripe avocados in half, remove pits, and scoop flesh into bowl.

2. Mash avocado with fork to desired consistency (chunky or smooth).

3. Add juice of ½ lime, ¼ cup diced red onion, ¼ cup chopped fresh cilantro, 1 small seeded and diced jalapeño (optional), ½ teaspoon salt, and pinch of black pepper.

4. Stir everything together until well combined.

5. Taste and adjust seasonings - add more lime juice, salt, or pepper as needed.

6. Serve immediately with tortilla chips.', 'To prevent browning, press plastic wrap directly onto surface if not serving immediately. Adding avocado pits to guacamole is a myth. Can add diced tomato for extra flavor. Ground coriander can substitute for fresh cilantro (¼ tsp). Best served fresh.', '{"calories": 95, "protein": 2, "carbs": 6, "fat": 8}', false, NOW(), NOW()),

('Banana Coconut Flour Cookies', 28, 18, '1. Preheat oven to 350°F (175°C). Line baking sheet with parchment paper.

2. In large bowl, whisk together ⅓ cup + 3 tablespoons coconut flour, 2 tablespoons tapioca flour (optional), 1 teaspoon ground cinnamon, ½ teaspoon baking soda, and ¼ teaspoon sea salt.

3. In separate bowl, mash 1 large ripe banana until smooth. Whisk in 2 eggs and ¼ cup melted coconut oil until combined.

4. Pour wet ingredients into dry ingredients and stir until just combined.

5. Fold in 5 tablespoons chocolate chips.

6. Scoop rounded tablespoons of dough onto prepared baking sheet, leaving space for spreading.

7. Bake 11-13 minutes until edges and bottoms are golden brown.

8. Let cool completely on baking sheet before serving.', 'Start with 2 tbsp coconut flour and add more if batter is too loose. Omit tapioca flour for keto version. Cookies will be fragile when warm - cooling completely is essential. Can substitute any chocolate chips or omit entirely.', '{"calories": 55, "protein": 2, "carbs": 5, "fat": 3}', false, NOW(), NOW()),

('Banana Chocolate Chip Cookies', 34, 24, '1. Preheat oven to 350°F (175°C). Line baking sheet with parchment paper.

2. In a bowl, mash 2 ripe bananas until creamy (about ⅔ cup).

3. Add 1 egg and 3 tablespoons pure maple syrup. Whisk well to combine.

4. Stir in 1½ cups almond flour, ½ teaspoon ground cinnamon, pinch of sea salt until just incorporated. Dough will be thick and sticky.

5. Fold in ¼ cup chocolate chips if using.

6. Drop tablespoons of dough onto prepared baking sheet, leaving space between for spreading.

7. Bake 20-28 minutes until edges are golden brown and centers are set.

8. Let cool on baking sheet for few minutes before transferring to wire rack.', 'Simple 5-ingredient base recipe. Dough will be stickier than traditional cookie dough - this is normal. Don''t overbake or cookies will be dry. Can add vanilla extract, nuts, or different spices for variation.', '{"calories": 65, "protein": 2, "carbs": 8, "fat": 3}', false, NOW(), NOW()),

('Simple Paleo Meatballs', 25, 4, '1. Preheat oven to 400°F (200°C). Line baking sheet with parchment paper.

2. In a bowl, combine 1 pound ground beef, 1 beaten egg, ½ cup almond flour, and any desired paleo seasonings (salt, pepper, garlic powder, onion powder, Italian herbs).

3. Mix gently with hands until just combined - don''t overmix.

4. Roll mixture into 1.5-inch meatballs and place on prepared baking sheet.

5. Bake for 12-15 minutes until browned and cooked through (internal temperature 160°F/71°C).

6. Serve with your favorite paleo-friendly sauce or over vegetables.', 'Simple base recipe that can be customized with any paleo seasonings. Can pan-fry in olive oil instead of baking. Great for meal prep - freeze cooked meatballs for quick meals. Don''t overmix or meatballs will be tough.', '{"calories": 185, "protein": 18, "carbs": 2, "fat": 11}', false, NOW(), NOW()),

('Perfect Chicken Breast', 17, 1, '1. Tenderize chicken breast with meat mallet to even thickness (about ¾ inch).

2. Season both sides with salt and pepper.

3. Heat olive oil in skillet over medium-high heat until shimmering.

4. Add chicken breast and cook for 4 minutes on first side without moving.

5. Flip and cook for 3 minutes on second side.

6. Remove from heat and let rest for 5 minutes before slicing.

7. Internal temperature should reach 165°F (74°C).', 'Tenderizing ensures even cooking. Don''t move chicken during cooking to get good sear. Resting allows juices to redistribute. Can finish with butter, garlic, and herbs in pan. Adjust timing based on thickness of chicken.', '{"calories": 185, "protein": 31, "carbs": 0, "fat": 6}', false, NOW(), NOW());

-- Insert recipe_tags relationships
INSERT INTO recipe_tags (recipe_id, tag_id, created_at) VALUES
-- Tzatziki (Recipe 1)
(1, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(1, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(1, (SELECT id FROM tags WHERE name = 'vegetarian'), NOW()),
(1, (SELECT id FROM tags WHERE name = 'sauce'), NOW()),
-- Coconut Aminos Sauce (Recipe 2)
(2, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(2, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(2, (SELECT id FROM tags WHERE name = 'vegan'), NOW()),
(2, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(2, (SELECT id FROM tags WHERE name = 'sauce'), NOW()),
-- Paleo Pineapple Fried Rice with Chicken Breast (Recipe 3)
(3, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(3, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(3, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(3, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(3, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),
(3, (SELECT id FROM tags WHERE name = 'stir-fry'), NOW()),
-- Bacon Brussels Sprouts (Recipe 4)
(4, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(4, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(4, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(4, (SELECT id FROM tags WHERE name = 'keto-friendly'), NOW()),
(4, (SELECT id FROM tags WHERE name = 'side-dish'), NOW()),
-- Paleo Banana Almond Flour Protein Waffles (Recipe 5)
(5, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(5, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(5, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(5, (SELECT id FROM tags WHERE name = 'protein-rich'), NOW()),
(5, (SELECT id FROM tags WHERE name = 'meal-prep'), NOW()),
(5, (SELECT id FROM tags WHERE name = 'breakfast'), NOW()),

-- Recipe tags for new recipes from All-Apple Recipes.txt
-- Reverse Sear Steak
(6, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(6, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(6, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(6, (SELECT id FROM tags WHERE name = 'keto-friendly'), NOW()),
(6, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(6, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),

-- Jasmine Rice
(7, (SELECT id FROM tags WHERE name = 'paleo - allowing rice'), NOW()),
(7, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(7, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(7, (SELECT id FROM tags WHERE name = 'vegan'), NOW()),
(7, (SELECT id FROM tags WHERE name = 'side-dish'), NOW()),

-- Basmati Rice  
(8, (SELECT id FROM tags WHERE name = 'paleo - allowing rice'), NOW()),
(8, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(8, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(8, (SELECT id FROM tags WHERE name = 'vegan'), NOW()),
(8, (SELECT id FROM tags WHERE name = 'side-dish'), NOW()),

-- Coconut Almond Flour Waffles
(9, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(9, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(9, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(9, (SELECT id FROM tags WHERE name = 'breakfast'), NOW()),

-- Paleo Vanilla Loaf
(10, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(10, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(10, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(10, (SELECT id FROM tags WHERE name = 'dessert'), NOW()),

-- Paleo Fried Chicken
(11, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(11, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(11, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(11, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(11, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),

-- Paleo Meatloaf
(12, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(12, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(12, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(12, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(12, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),
(12, (SELECT id FROM tags WHERE name = 'meal-prep'), NOW()),

-- Simple Paleo Waffles
(13, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(13, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(13, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(13, (SELECT id FROM tags WHERE name = 'breakfast'), NOW()),

-- Baked BBQ Beef Ribs
(14, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(14, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(14, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(14, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),

-- Cinnamon Roasted Butternut Squash
(15, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(15, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(15, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(15, (SELECT id FROM tags WHERE name = 'vegan'), NOW()),
(15, (SELECT id FROM tags WHERE name = 'side-dish'), NOW()),

-- Fried Boneless Chicken Thighs
(16, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(16, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(16, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(16, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(16, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),

-- Classic Guacamole
(17, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(17, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(17, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(17, (SELECT id FROM tags WHERE name = 'vegan'), NOW()),
(17, (SELECT id FROM tags WHERE name = 'sauce'), NOW()),
(17, (SELECT id FROM tags WHERE name = 'snack'), NOW()),

-- Banana Coconut Flour Cookies
(18, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(18, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(18, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(18, (SELECT id FROM tags WHERE name = 'dessert'), NOW()),
(18, (SELECT id FROM tags WHERE name = 'snack'), NOW()),

-- Banana Chocolate Chip Cookies
(19, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(19, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(19, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(19, (SELECT id FROM tags WHERE name = 'dessert'), NOW()),
(19, (SELECT id FROM tags WHERE name = 'snack'), NOW()),

-- Simple Paleo Meatballs
(20, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(20, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(20, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(20, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(20, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),
(20, (SELECT id FROM tags WHERE name = 'meal-prep'), NOW()),

-- Perfect Chicken Breast
(21, (SELECT id FROM tags WHERE name = 'paleo'), NOW()),
(21, (SELECT id FROM tags WHERE name = 'gluten-free'), NOW()),
(21, (SELECT id FROM tags WHERE name = 'dairy-free'), NOW()),
(21, (SELECT id FROM tags WHERE name = 'high-protein'), NOW()),
(21, (SELECT id FROM tags WHERE name = 'main-dish'), NOW()),
(21, (SELECT id FROM tags WHERE name = 'quick-meals'), NOW());

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
(5, 74, 1.5, 'tsp', 0.10, 0.15, NOW()),        -- Pure Vanilla Extract (1.5 tsp)

-- Recipe ingredients for new recipes from All-Apple Recipes.txt
-- Reverse Sear Steak (Recipe 6)
(6, (SELECT id FROM items WHERE name LIKE '%Strip Steak%' LIMIT 1), 1, 'piece', 12.00, 12.00, NOW()),
(6, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 1, 'tsp', 0.04, 0.04, NOW()),
(6, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.5, 'tsp', 0.04, 0.02, NOW()),

-- Jasmine Rice (Recipe 7)
(7, (SELECT id FROM items WHERE name LIKE '%Thai Jasmine Rice%'), 1, 'cup', 0.38, 0.38, NOW()),
(7, (SELECT id FROM items WHERE name LIKE '%100% Pure Olive Oil%'), 1, 'tbsp', 0.20, 0.20, NOW()),
(7, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.5, 'tsp', 0.04, 0.02, NOW()),

-- Basmati Rice (Recipe 8)
(8, (SELECT id FROM items WHERE name = 'Basmati Rice, 10 lb'), 1, 'cup', 0.40, 0.40, NOW()),
(8, (SELECT id FROM items WHERE name LIKE '%100% Pure Olive Oil%'), 1, 'tbsp', 0.20, 0.20, NOW()),
(8, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.5, 'tsp', 0.04, 0.02, NOW()),

-- Classic Guacamole (Recipe 17)
(17, (SELECT id FROM items WHERE name LIKE '%Avocados%'), 2.5, 'piece', 0.90, 2.25, NOW()),
(17, (SELECT id FROM items WHERE name = 'Fresh Lime Juice, 32 fl oz'), 1, 'tbsp', 0.31, 0.31, NOW()),
(17, (SELECT id FROM items WHERE name = 'Red Onions, 3 lb'), 0.25, 'cup', 0.37, 0.09, NOW()),
(17, (SELECT id FROM items WHERE name = 'Fresh Cilantro, 1 bunch'), 0.25, 'cup', 0.33, 0.08, NOW()),
(17, (SELECT id FROM items WHERE name = 'Jalapeño Peppers, 1 lb'), 0.5, 'piece', 0.25, 0.13, NOW()),
(17, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(17, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.25, 'tsp', 0.04, 0.01, NOW()),

-- Simple Paleo Meatballs (Recipe 20)
(20, (SELECT id FROM items WHERE name LIKE '%85/15 Organic Grass Fed Ground Beef%'), 1, 'lb', 8.97, 8.97, NOW()),
(20, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 1, 'piece', 0.58, 0.58, NOW()),
(20, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 0.5, 'cup', 0.81, 0.41, NOW()),
(20, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 1, 'tsp', 0.04, 0.04, NOW()),
(20, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(20, (SELECT id FROM items WHERE name LIKE '%Garlic Powder%'), 1, 'tsp', 0.04, 0.04, NOW()),

-- Perfect Chicken Breast (Recipe 21)  
(21, (SELECT id FROM items WHERE name LIKE '%Boneless and Skinless Chicken Breasts%'), 1, 'piece', 2.64, 2.64, NOW()),
(21, (SELECT id FROM items WHERE name LIKE '%100% Pure Olive Oil%'), 1, 'tbsp', 0.20, 0.20, NOW()),
(21, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(21, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.25, 'tsp', 0.04, 0.01, NOW()),

-- Additional recipe ingredients for complex recipes
-- Coconut Almond Flour Waffles (Recipe 9) - Additional ingredients
(9, (SELECT id FROM items WHERE name LIKE '%Bananas%'), 1, 'piece', 0.16, 0.16, NOW()),
(9, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 3, 'piece', 0.58, 1.74, NOW()),
(9, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 0.5, 'cup', 0.81, 0.41, NOW()),
(9, (SELECT id FROM items WHERE name = 'Coconut Flour, 16 oz'), 2.5, 'tbsp', 0.28, 0.70, NOW()),
(9, (SELECT id FROM items WHERE name = 'Baking Powder, 10 oz'), 0.5, 'tsp', 0.02, 0.01, NOW()),
(9, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.25, 'tsp', 0.04, 0.01, NOW()),
(9, (SELECT id FROM items WHERE name LIKE '%Pure Vanilla Extract%'), 1, 'tsp', 0.10, 0.10, NOW()),
(9, (SELECT id FROM items WHERE name LIKE '%Organic Virgin Coconut Oil%'), 1, 'tbsp', 0.16, 0.16, NOW()),

-- Paleo Vanilla Loaf (Recipe 10)
(10, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 2, 'cup', 0.81, 1.62, NOW()),
(10, (SELECT id FROM items WHERE name = 'Tapioca Starch, 16 oz'), 0.5, 'cup', 0.22, 0.11, NOW()),
(10, (SELECT id FROM items WHERE name LIKE '%Arm & Hammer Baking Soda%'), 0.5, 'tsp', 0.03, 0.02, NOW()),
(10, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.25, 'tsp', 0.04, 0.01, NOW()),
(10, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 3, 'piece', 0.58, 1.74, NOW()),
(10, (SELECT id FROM items WHERE name LIKE '%Organic Virgin Coconut Oil%'), 0.25, 'cup', 0.16, 0.04, NOW()),
(10, (SELECT id FROM items WHERE name = 'Unsweetened Almond Milk, 64 fl oz'), 0.25, 'cup', 0.37, 0.09, NOW()),
(10, (SELECT id FROM items WHERE name LIKE '%Organic Raw Unfiltered Apple Cider Vinegar%'), 1, 'tsp', 0.26, 0.26, NOW()),
(10, (SELECT id FROM items WHERE name LIKE '%Pure Vanilla Extract%'), 1, 'tsp', 0.10, 0.10, NOW()),

-- Paleo Fried Chicken (Recipe 11)
(11, (SELECT id FROM items WHERE name LIKE '%Bone-In Chicken Thighs%'), 3.48, 'lb', 8.13, 28.29, NOW()),
(11, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 2, 'cup', 0.81, 1.62, NOW()),
(11, (SELECT id FROM items WHERE name LIKE '%Garlic Powder%'), 1, 'tbsp', 0.04, 0.04, NOW()),
(11, (SELECT id FROM items WHERE name LIKE '%Onion Powder%'), 1, 'tbsp', 0.04, 0.04, NOW()),
(11, (SELECT id FROM items WHERE name = 'Smoked Paprika, 2.3 oz'), 1, 'tsp', 0.06, 0.06, NOW()),
(11, (SELECT id FROM items WHERE name = 'Dried Thyme, 0.75 oz'), 1, 'tsp', 0.14, 0.14, NOW()),
(11, (SELECT id FROM items WHERE name = 'Cayenne Pepper, 2.6 oz'), 0.5, 'tsp', 0.05, 0.03, NOW()),
(11, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 1, 'tsp', 0.04, 0.04, NOW()),
(11, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(11, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 2, 'piece', 0.58, 1.16, NOW()),
(11, (SELECT id FROM items WHERE name = 'Unsweetened Almond Milk, 64 fl oz'), 0.25, 'cup', 0.37, 0.09, NOW()),
(11, (SELECT id FROM items WHERE name LIKE '%Organic Virgin Coconut Oil%'), 2, 'cup', 0.16, 0.32, NOW()),

-- Paleo Meatloaf (Recipe 12)
(12, (SELECT id FROM items WHERE name LIKE '%85/15 Organic Grass Fed Ground Beef%'), 3, 'lb', 8.97, 26.91, NOW()),
(12, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 0.75, 'cup', 0.81, 0.61, NOW()),
(12, (SELECT id FROM items WHERE name = 'Dijon Mustard, 8 oz'), 1.5, 'tbsp', 0.19, 0.29, NOW()),
(12, (SELECT id FROM items WHERE name = 'Organic Ketchup, 32 oz'), 3.25, 'tbsp', 0.12, 0.39, NOW()),
(12, (SELECT id FROM items WHERE name LIKE '%Coconut Aminos%'), 3, 'tbsp', 8.99, 1.69, NOW()),
(12, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 3, 'piece', 0.58, 1.74, NOW()),
(12, (SELECT id FROM items WHERE name LIKE '%Garlic Powder%'), 3, 'tsp', 0.04, 0.12, NOW()),
(12, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 1, 'tsp', 0.04, 0.04, NOW()),
(12, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 1, 'tsp', 0.04, 0.04, NOW()),

-- Simple Paleo Waffles (Recipe 13)
(13, (SELECT id FROM items WHERE name LIKE '%Bananas%'), 2, 'piece', 0.16, 0.32, NOW()),
(13, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 2, 'piece', 0.58, 1.16, NOW()),
(13, (SELECT id FROM items WHERE name = 'Coconut Milk, Full Fat, 13.5 fl oz'), 0.25, 'cup', 0.33, 0.08, NOW()),
(13, (SELECT id FROM items WHERE name LIKE '%Organic Virgin Coconut Oil%'), 1, 'tbsp', 0.16, 0.16, NOW()),
(13, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 1.5, 'cup', 0.81, 1.22, NOW()),
(13, (SELECT id FROM items WHERE name LIKE '%Arm & Hammer Baking Soda%'), 0.5, 'tsp', 0.03, 0.02, NOW()),
(13, (SELECT id FROM items WHERE name LIKE '%Ground Cinnamon%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(13, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.25, 'tsp', 0.04, 0.01, NOW()),

-- Baked BBQ Beef Ribs (Recipe 14)
(14, (SELECT id FROM items WHERE name = 'Beef Short Ribs, 3 lb'), 3, 'lb', 28.99, 86.97, NOW()),
(14, (SELECT id FROM items WHERE name = 'Chili Powder, 2.5 oz'), 2, 'tbsp', 0.06, 0.12, NOW()),
(14, (SELECT id FROM items WHERE name LIKE '%Garlic Powder%'), 1, 'tbsp', 0.04, 0.04, NOW()),
(14, (SELECT id FROM items WHERE name LIKE '%Onion Powder%'), 1, 'tbsp', 0.04, 0.04, NOW()),
(14, (SELECT id FROM items WHERE name = 'Paprika, 2.4 oz'), 1, 'tsp', 0.05, 0.05, NOW()),
(14, (SELECT id FROM items WHERE name = 'Dried Oregano, 1 oz'), 0.5, 'tsp', 0.08, 0.04, NOW()),
(14, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 1, 'tsp', 0.04, 0.04, NOW()),
(14, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 1, 'tsp', 0.04, 0.04, NOW()),
(14, (SELECT id FROM items WHERE name LIKE '%Coconut Aminos%'), 0.25, 'cup', 8.99, 2.25, NOW()),
(14, (SELECT id FROM items WHERE name = 'Tomato Paste, 6 oz'), 2, 'tbsp', 0.12, 0.24, NOW()),
(14, (SELECT id FROM items WHERE name LIKE '%Organic Raw Unfiltered Apple Cider Vinegar%'), 1, 'tbsp', 0.26, 0.26, NOW()),

-- Cinnamon Roasted Butternut Squash (Recipe 15)
(15, (SELECT id FROM items WHERE name = 'Butternut Squash, 2 lb'), 2, 'lb', 3.99, 7.98, NOW()),
(15, (SELECT id FROM items WHERE name = 'Avocado Oil, 16.9 fl oz'), 2, 'tbsp', 0.38, 0.76, NOW()),
(15, (SELECT id FROM items WHERE name LIKE '%Ground Cinnamon%'), 1.5, 'tsp', 0.04, 0.06, NOW()),
(15, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(15, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.25, 'tsp', 0.04, 0.01, NOW()),

-- Fried Boneless Chicken Thighs (Recipe 16)
(16, (SELECT id FROM items WHERE name LIKE '%Bone-In Chicken Thighs%'), 4, 'piece', 8.13, 4.07, NOW()),
(16, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 2, 'piece', 0.58, 1.16, NOW()),
(16, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 1, 'cup', 0.81, 0.81, NOW()),
(16, (SELECT id FROM items WHERE name LIKE '%Garlic Powder%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(16, (SELECT id FROM items WHERE name LIKE '%Onion Powder%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(16, (SELECT id FROM items WHERE name = 'Paprika, 2.4 oz'), 1, 'tsp', 0.05, 0.05, NOW()),
(16, (SELECT id FROM items WHERE name = 'Dried Thyme, 0.75 oz'), 0.5, 'tsp', 0.14, 0.07, NOW()),
(16, (SELECT id FROM items WHERE name LIKE '%Black Pepper%'), 0.25, 'tsp', 0.04, 0.01, NOW()),
(16, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 1, 'tsp', 0.04, 0.04, NOW()),
(16, (SELECT id FROM items WHERE name = 'Avocado Oil, 16.9 fl oz'), 4, 'tbsp', 0.38, 1.52, NOW()),

-- Banana Coconut Flour Cookies (Recipe 18)
(18, (SELECT id FROM items WHERE name = 'Coconut Flour, 16 oz'), 0.5, 'cup', 0.28, 0.14, NOW()),
(18, (SELECT id FROM items WHERE name = 'Tapioca Starch, 16 oz'), 2, 'tbsp', 0.22, 0.44, NOW()),
(18, (SELECT id FROM items WHERE name LIKE '%Ground Cinnamon%'), 1, 'tsp', 0.04, 0.04, NOW()),
(18, (SELECT id FROM items WHERE name LIKE '%Arm & Hammer Baking Soda%'), 0.5, 'tsp', 0.03, 0.02, NOW()),
(18, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.25, 'tsp', 0.04, 0.01, NOW()),
(18, (SELECT id FROM items WHERE name LIKE '%Bananas%'), 1, 'piece', 0.16, 0.16, NOW()),
(18, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 2, 'piece', 0.58, 1.16, NOW()),
(18, (SELECT id FROM items WHERE name LIKE '%Organic Virgin Coconut Oil%'), 0.25, 'cup', 0.16, 0.04, NOW()),
(18, (SELECT id FROM items WHERE name = 'Dark Chocolate Chips, 12 oz'), 5, 'tbsp', 0.21, 1.05, NOW()),

-- Banana Chocolate Chip Cookies (Recipe 19)
(19, (SELECT id FROM items WHERE name LIKE '%Bananas%'), 2, 'piece', 0.16, 0.32, NOW()),
(19, (SELECT id FROM items WHERE name LIKE '%Organic Pasture Raised Eggs%'), 1, 'piece', 0.58, 0.58, NOW()),
(19, (SELECT id FROM items WHERE name LIKE '%Organic 100% Pure Maple Syrup%'), 3, 'tbsp', 0.19, 0.57, NOW()),
(19, (SELECT id FROM items WHERE name = 'Almond Flour, 16 oz'), 1.5, 'cup', 0.81, 1.22, NOW()),
(19, (SELECT id FROM items WHERE name LIKE '%Ground Cinnamon%'), 0.5, 'tsp', 0.04, 0.02, NOW()),
(19, (SELECT id FROM items WHERE name LIKE '%Himalayan Pink Salt%'), 0.25, 'tsp', 0.04, 0.01, NOW()),
(19, (SELECT id FROM items WHERE name = 'Dark Chocolate Chips, 12 oz'), 0.25, 'cup', 0.21, 0.05, NOW());