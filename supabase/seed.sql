-- Seed data for the food tracking app

-- Insert food items from CSV with embedded image links
INSERT INTO items (name, brand, category, in_stock, price, carbs_per_serving, fat_per_serving, protein_per_serving, servings_per_container, image_url, ingredients, rating, nutrition_source, last_edited) VALUES
('Beef Fajita Seasoning, 1 Oz', 'Siete', 'Seasonings & Spices', false, 2.99, 0, 0, 0, 8, 'https://img.thrivemarket.com/store/full/c/o/copy-of-810091781128_siete-1oz-beef-fajita-seasoning_front_1_1.jpg?w=1227&jpg_quality=90', 'Smoked Sea Salt, Garlic, Black Pepper, Onions, Paprika, Sea Salt, Hatch Red Chiles, Ground Dates.', 3, 'manual', NOW()),
('Chicken Fajita Seasoning, 1 Oz', 'Siete', 'Seasonings & Spices', false, 2.99, 0, 0, 0, 8, 'https://www.instacart.com/assets/domains/product-image/file/large_509357c6-e962-4854-b779-0cd33a935350.png', 'Smoked sea salt, garlic, ground dates, onions, sea salt, black pepper, paprika, cumin, red bell peppers, chile flakes, green bell peppers, lime oil.', NULL, 'manual', NOW()),
('Cilantro Lime Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', false, 3.79, 4, 7, 1, 7, 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-cilantro-lime-sauce-1126626285_279x.jpg?v=1738777602', 'Water, High Oleic Sunflower Oil, Roasted Poblano Chilies, Cilantro, Parsley, Dehydrated Garlic, Lime Juice Concentrate, Jalapeño, Sea Salt, Lemon Juice Concentrate, Dehydrated Roasted Garlic, Tapioca Starch, Spices, Black Pepper, Xanthan Gum, Sunflower Lecithin, Monkfruit Extract, Citric Acid.', NULL, 'manual', NOW()),
('Classic Taco Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', false, 3.79, 17, 1.5, 0, 3.5, 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-classic-taco-sauce-1126626287_1800x1800.jpg?v=1738777608', 'Water, Fire Roasted Tomatoes (Fire Roasted Tomatoes, Tomato Juice, Salt, Citric Acid, Calcium Chloride), Chicken Stock (Chicken Stock, Salt), Roasted Poblano Chilies, Chicken Fat, Cilantro, Spices, Tapioca Starch, Tamarind Puree (Tamarind Pulp, Water), Lime Juice Concentrate, Smoked Granulated Onion, Sea Salt, Yeast Extract, Smoked Paprika, Dehydrated Garlic, Xanthan Gum, Citric Acid, Monk Fruit Extract.', 3, 'manual', NOW()),
('Honey Garlic Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', false, 3.79, 16, 0, 1, 3.5, 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-honey-garlic-sauce-1126626289_1800x1800.jpg?v=1738777800', 'Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Distilled Vinegar, Roasted Garlic, Honey, Orange Juice Concentrate, Yeast Extract, Tapioca Starch, Dehydrated Garlic, Xanthan Gum, Spices, Granulated Onion, Citric Acid, Monk Fruit Extract, Orange Oil.', NULL, 'manual', NOW()),
('Lemongrass Basil Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', false, 3.79, 6, 6, 1, 3.5, 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-lemongrass-basil-sauce-1126626297_279x.jpg?v=1738777080', 'Coconut Milk (Coconut Cream, Water), Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Coconut Sugar, Lemongrass Puree (Lemongrass, Water), Basil, Lime Juice Concentrate, Tapioca Starch, Dehydrated Onion, Dehydrated Garlic, Sea Salt, Jalapeño, Spices, Apple Cider Vinegar, Shiitake Mushroom, Paprika, Yeast Extract, Ground Ginger, Xanthan Gum, Citric Acid, Monkfruit Extract.', 3, 'manual', NOW()),
('Orange Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', false, 3.79, 13, 0, 0, 3.5, 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-orange-sauce-1126626298_279x.jpg?v=1738777081', 'Water, Coconut Aminos (Coconut Nectar, Water, Sea Salt), Orange Juice Concentrate, Coconut Sugar, Distilled Vinegar, Sherry Wine, Tapioca Starch, Yeast Extract, Xanthan Gum, Sea Salt, Spices, Granulated Onion, Granulated Garlic, Citric Acid, Monk Fruit Extract, Orange Oil.', 3, 'manual', NOW()),
('Organic Adobo Seasoning, 2.9 Oz', 'Loisa', 'Seasonings & Spices', false, 7.79, 0, 0, 0, 82, 'https://www.instacart.com/image-server/466x466/filters:fill(FFF,true):format(webp)/www.instacart.com/assets/domains/product-image/file/large_0b9bbfc0-eb6f-4f56-967c-bfca1f5491fd.png', 'Sea salt, organic garlic, organic turmeric, organic oregano, organic black pepper.', NULL, 'manual', NOW()),
('Organic Sazón Seasoning, 2.3 Oz', 'Loisa', 'Seasonings & Spices', false, 7.79, 0, 0, 0, 65, 'https://img.thrivemarket.com/store/full/8/5/856633007073_front_1_1.jpg?w=1227&jpg_quality=90', 'Sea salt, organic achiote, organic cumin, organic coriander, organic garlic, organic oregano, organic black pepper.', 4, 'manual', NOW()),
('Sea Salt Flakes, 8.5 Oz', 'Maldon', 'Seasonings & Spices', false, 6.99, 0, 0, 0, 160, 'https://img.thrivemarket.com/store/full/8/4/847972000009_1_1.jpg?w=1167&jpg_quality=90', 'Sea Salt Flakes.', 5, 'manual', NOW()),
('Seasoning Mix, Garden Ranch, 0.81 Oz Pouch', 'Primal Palate', 'Seasonings & Spices', false, 1.79, 0, 0, 0, 23, 'https://shop.primalpalate.com/cdn/shop/products/GardenRanchPacket.jpg?v=1604055766&width=1158', 'Onion, Garlic, Himalayan Pink Salt, Dillweed, Parsley, Chives, Black Pepper.', 3, 'manual', NOW()),
('Seasoning, Barbecue Rub, 3.1 Oz', 'Primal Palate', 'Seasonings & Spices', false, 8.99, 0, 0, 0, 88, 'https://shop.primalpalate.com/cdn/shop/products/BarbecueRub.jpg?v=1603741835&width=1200', 'Pink Himalayan Salt, Onion, Garlic, Paprika, Oregano, Turmeric, Black Pepper, Ginger, Cumin, Cayenne, Coriander.', 4, 'manual', NOW()),
('Seasoning, Seafood, 2.1 Oz', 'Primal Palate', 'Seasonings & Spices', false, 8.99, 0, 0, 0, 60, 'https://shop.primalpalate.com/cdn/shop/products/SeafoodSeasoning.jpg?v=1603737594&width=1200', 'Pink Himalayan Salt, Onion, Black Pepper, Lemon Peel, Garlic, Bay Leaves, Parsley, Chives.', 3, 'manual', NOW()),
('Taco Seasoning, Mild, 1.3 Oz', 'Siete', 'Seasonings & Spices', false, 2.99, 0, 0, 0, 7, 'https://www.instacart.com/assets/domains/product-image/file/large_6482e1c5-1a88-4037-a345-9958061765af.png', 'Chile powder, sea salt, ground dates, tomato powder, garlic powder, nutritional yeast, cumin, onion flakes, cassava flour, cream of tartar, black pepper, and paprika.', 3, 'manual', NOW()),
('Thai Coconut Sauce, 7 Oz', 'Kevin''s Natural Foods', 'Condiments & Sauces', false, 3.79, 7, 7, 1, 3.5, 'https://www.kevinsnaturalfoods.com/cdn/shop/files/kevin-s-natural-foods-sauce-thai-coconut-sauce-1126626302_279x.jpg?v=1738776726', 'Coconut Milk (Coconut Cream, Water), Water, Coconut Sugar, Lime Juice Concentrate, Spices, Tapioca Starch, Basil, Yeast Extract, Dehydrated Onion, Basil, Dehydrated Garlic, Sea Salt, Lemongrass Puree (Lemongrass, Water), Turmeric, Xanthan Gum, Dehydrated Ginger, Citric Acid, Black Pepper, Monkfruit Extract.', 4, 'manual', NOW()),
('The New Primal, Noble Made Organic All-Purpose Seasoning, 2 oz', 'The New Primal (Noble Made)', 'Seasonings & Spices', false, 6.99, 0, 0, 0, 81, 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_724cd215-3482-4ba7-9d67-65c893a7e642.jpg', 'Organic Dehydrated Garlic, Sea Salt, Organic Ground Mustard Seed, Organic Black Pepper, Organic Lemon Peel, Organic Apple Cider Vinegar Powder (Organic Apple Cider Vinegar, Organic Acacia Gum), Organic Rosemary, Organic Basil, Citric Acid, Organic Lemon Juice Powder.', 3, 'manual', NOW()),
('The New Primal, Noble Made Poultry Seasoning, 2.6 oz', 'The New Primal (Noble Made)', 'Seasonings & Spices', false, 6.99, 0, 0, 0, 82, 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_03aa38c4-213d-4a6f-a695-c35bff5b7b56.jpg', 'Organic Dehydrated Garlic, Organic Dehydrated Onion, Sea Salt, Organic Cracked Black Pepper, Organic Orange Peel, Organic Cayenne, Organic Sage, Organic Parsley, Organic Dehydrated Green Bell Pepper.', 3, 'manual', NOW()),
('The New Primal, Noble Made Steak Seasoning, 2.5 oz', 'The New Primal (Noble Made)', 'Seasonings & Spices', false, 6.99, 0, 0, 0, 89, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Sea salt, organic cracked black pepper, organic dehydrated garlic, organic dehydrated onion, organic coriander, organic dill seed powder, organic coriander seed, organic dill seed.', NULL, 'manual', NOW()),

-- Additional items from additional-inventory-database-fill.csv
('Ithaca Mild Salsa, 14 oz', 'Ithaca', 'Condiments & Sauces', false, 2.24, 4, 0, 1, 8, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Tomatoes, onions, jalapeños, cilantro, lime juice, salt, spices', 4, 'manual', NOW()),
('Organic Dijon Mustard', 'Simple Truth', 'Condiments & Sauces', true, 1.99, 0.47, 0.19, 0.24, 50, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic mustard seeds, vinegar, salt, spices', 5, 'manual', NOW()),
('Organic Ketchup', 'Simple Truth', 'Condiments & Sauces', true, 2.29, 4.1, 0.02, 0.2, 32, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Tomato concentrate, sugar, vinegar, salt, spices', 4, 'manual', NOW()),
('Organic Yellow Mustard', 'Simple Truth', 'Condiments & Sauces', true, 1.99, 0.7, 0.3, 0.4, 50, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic mustard seeds, vinegar, turmeric, spices', 4, 'manual', NOW()),
('Grated Parmigiano Reggiano', 'Kroger', 'Dairy & Eggs', true, 4.99, 0.2, 1.43, 1.92, 50, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Parmigiano Reggiano cheese', 5, 'manual', NOW()),
('Murray''s Grated Parmigiano Reggiano, 5 oz', 'Kroger', 'Dairy & Eggs', false, 9.49, 0.2, 1.43, 1.92, 50, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Parmigiano Reggiano cheese', 5, 'manual', NOW()),
('Fresh Plantain, Single', 'Kroger', 'Fruits', false, 2.00, 47, 0.6, 2, 1, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Plantain', 4, 'manual', NOW()),
('Fresh Cut Diced Pepper Tri-Blend, 8 oz', 'Kroger', 'Seasonings & Spices', false, 3.99, 9, 0.5, 1.5, 1, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Red bell peppers, yellow bell peppers, orange bell peppers', 4, 'manual', NOW()),
('Diced Red Onions', 'Kroger', 'Vegetables', true, 2.99, 14.9, 0.16, 1.8, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Red onions', 4, 'manual', NOW()),
('Diced Yellow Onions', 'Kroger', 'Vegetables', true, 2.99, 14.9, 0.16, 1.8, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Yellow onions', 4, 'manual', NOW()),
('Kroger Coleslaw, 16 oz', 'Kroger', 'Vegetables', false, 1.50, 8, 9, 2, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Cabbage, carrots, mayonnaise, vinegar, sugar, salt', 4, 'manual', NOW()),
('Kroger Iceberg Shredded Lettuce Bagged Salad, 8 oz', 'Kroger', 'Vegetables', false, 2.49, 1.5, 0.1, 0.5, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Iceberg lettuce', 4, 'manual', NOW()),
('Kroger Sliced White Mushrooms, 8 oz', 'Kroger', 'Vegetables', false, 1.20, 2.3, 0.2, 2.2, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'White mushrooms', 4, 'manual', NOW()),
('Kroger Tri-Color Coleslaw Mix, 14 oz', 'Kroger', 'Vegetables', false, 1.50, 5, 0.2, 1.5, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Red cabbage, green cabbage, carrots', 4, 'manual', NOW()),
('Simple Truth Organic Shredded Romaine Lettuce Bagged Salad, 8 oz', 'Simple Truth', 'Vegetables', false, 2.79, 1.5, 0.1, 0.5, 4, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Organic romaine lettuce', 4, 'manual', NOW()),
('Arm & Hammer Baking Soda', 'Arm & Hammer', 'Baking Supplies', true, 27.89, 0, 0, 0, 1000, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Sodium bicarbonate', 5, 'manual', NOW()),
('Coconut Water', 'Vita Coco', 'Beverages', true, 19.98, 10.4, 0, 0.5, 12, 'https://images.pexels.com/photos/1546173/pexels-photo-1546173.jpeg?w=400', 'Coconut water', 4, 'manual', NOW()),
('Member''s Mark Purified Water, 16.9 fl. oz., 40 pk.', 'Member''s Mark', 'Beverages', true, 3.98, 0, 0, 0, 40, 'https://images.pexels.com/photos/1546173/pexels-photo-1546173.jpeg?w=400', 'Purified water', 4, 'manual', NOW()),
('Georgia''s Raw and Unfiltered Honey', 'Nature''s Nate Honey Co.', 'Condiments & Sauces', true, 13.98, 17, 0, 0.1, 50, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Raw unfiltered honey', 5, 'manual', NOW()),
('Member''s Mark Organic 100% Pure Maple Syrup, 32 oz.', 'Member''s Mark Organic', 'Condiments & Sauces', true, 11.98, 13, 0, 0, 64, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic maple syrup', 4, 'manual', NOW()),
('Organic Raw Unfiltered Apple Cider Vinegar', 'Bragg''s', 'Condiments & Sauces', true, 26.00, 0, 0, 0, 100, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic apple cider vinegar', 5, 'manual', NOW()),
('Daisy Brand Pure and Natural Sour Cream, 14 oz., 2 pk.', 'Daisy Brand', 'Dairy & Eggs', true, 4.88, 1, 5, 1, 28, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Cultured cream', 4, 'manual', NOW()),
('Member''s Mark Organic Pasture Raised Eggs', 'Member''s Mark Organic', 'Dairy & Eggs', true, 7.00, 0.6, 5.4, 7.5, 12, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Pasture-raised eggs', 5, 'manual', NOW()),
('Member''s Mark Pasture Raised Grade A Large Brown Eggs, 1.5 dozen', 'Member''s Mark', 'Dairy & Eggs', true, 5.92, 0.6, 5.4, 7.5, 18, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Large brown eggs', 5, 'manual', NOW()),
('Member''s Mark Plain Nonfat Greek Yogurt, 40 oz.', 'Member''s Mark', 'Dairy & Eggs', true, 4.28, 6.1, 0.66, 17.3, 1, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Nonfat Greek yogurt', 4, 'manual', NOW()),
('Pure Irish Butter, Salted, Grass‑Fed', 'Kerrygold', 'Dairy & Eggs', true, 8.99, 0, 12, 0, 32, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=400', 'Pasteurized cream, salt', 5, 'manual', NOW()),
('Anjou Pear, 5 lbs.', 'Member''s Mark', 'Fruits', true, 8.44, 27, 0.3, 0.6, 10, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Pears', 4, 'manual', NOW()),
('Avocados, 5 ct.', 'Member''s Mark', 'Fruits', true, 4.48, 4, 7, 1, 5, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Avocados', 5, 'manual', NOW()),
('Bananas, 3 lbs. (Chiquita & Member''s Mark Organic)', 'Chiquita / Member''s Mark Organic', 'Fruits', true, 1.97, 27, 0, 1, 12, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Bananas', 4, 'manual', NOW()),
('Clementine Mandarins, 5 lbs.', 'Member''s Mark', 'Fruits', true, 7.62, 9, 0, 1, 15, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Clementines', 4, 'manual', NOW()),
('Gold Kiwi, 2 lbs.', 'Member''s Mark', 'Fruits', true, 7.97, 10.1, 0.4, 0.8, 8, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Kiwifruit', 5, 'manual', NOW()),
('Green Kiwi, 3 lbs.', 'Member''s Mark', 'Fruits', true, 8.47, 10.1, 0.4, 0.8, 12, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Kiwifruit', 4, 'manual', NOW()),
('Green Seedless Grapes, 3 lbs.', 'Member''s Mark', 'Fruits', true, 5.97, 16, 0.3, 0.6, 6, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Green seedless grapes', 4, 'manual', NOW()),
('Mangos, 8.8 lbs.', 'Member''s Mark', 'Fruits', true, 8.18, 25, 0.6, 1.4, 8, 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?w=400', 'Mangoes', 5, 'manual', NOW()),
('Member''s Mark Thai Jasmine Rice, 25 lb.', 'Member''s Mark', 'Grains & Starches', true, 18.98, 35, 0, 3, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Jasmine rice', 4, 'manual', NOW()),
('100% Pure Olive Oil', 'Member''s Mark', 'Oils & Fats', true, 18.98, 0, 14, 0, 101, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Olive oil', 4, 'manual', NOW()),
('Member''s Mark Organic Virgin Coconut Oil, 56 oz.', 'Member''s Mark Organic', 'Oils & Fats', true, 10.98, 0, 14, 0, 112, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic pure virgin unrefined coconut oil', 5, 'manual', NOW()),
('Member''s Mark 85/15 Organic Grass Fed Ground Beef', 'Member''s Mark', 'Proteins', true, 17.94, 0, 17, 21, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Ground beef (85% lean, 15% fat)', 5, 'manual', NOW()),
('Member''s Mark Bone-In Chicken Drumsticks', 'Member''s Mark', 'Proteins', true, 5.75, 0, 5.7, 24.2, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Chicken drumsticks (skinless, boneless)', 4, 'manual', NOW()),
('Member''s Mark Bone-In Chicken Thighs', 'Member''s Mark', 'Proteins', true, 8.13, 0, 8.2, 24.8, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Chicken thighs (skinless, boneless)', 5, 'manual', NOW()),
('Member''s Mark Boneless and Skinless Chicken Breasts', 'Member''s Mark', 'Proteins', true, 21.11, 0, 3.6, 31, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Boneless skinless chicken breasts', 5, 'manual', NOW()),
('Member''s Mark Boneless and Skinless Chicken Thighs', 'Member''s Mark', 'Proteins', true, 22.72, 0, 8.2, 24.8, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Boneless skinless chicken thighs', 5, 'manual', NOW()),
('Member''s Mark Grass Fed Beef Ribeye Steak', 'Member''s Mark', 'Proteins', true, 19.17, 0, 10.8, 23.8, 4, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Ribeye steak', 5, 'manual', NOW()),
('Member''s Mark Grass Fed Beef Top Sirloin Steak', 'Member''s Mark', 'Proteins', true, 16.03, 0, 10.8, 17.3, 4, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Top sirloin steak', 5, 'manual', NOW()),
('Member''s Mark Prime Beef Strip Steak', 'Member''s Mark', 'Proteins', true, 24.67, 0, 7.6, 26, 4, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Prime beef strip steak', 5, 'manual', NOW()),
('Member''s Mark Skinless and Boneless Atlantic Salmon Fillet Portions, Frozen, 2.5 lbs.', 'Member''s Mark', 'Proteins', true, 23.94, 0, 5.4, 17, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Atlantic salmon fillet', 5, 'manual', NOW()),
('Member''s Mark USDA Choice Angus Beef Boneless NY Strip Steak', 'Member''s Mark', 'Proteins', true, 49.38, 0, 7.6, 26, 4, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'USDA Choice Angus beef NY strip', 5, 'manual', NOW()),
('Member''s Mark USDA Choice Angus Beef Inside Skirt Steak', 'Member''s Mark', 'Proteins', true, 30.03, 0, 11, 17, 4, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Inside skirt steak', 5, 'manual', NOW()),
('Member''s Whole Mark Bone-In Chicken Wings', 'Member''s Mark', 'Proteins', true, 18.34, 0, 8.1, 30.5, 8, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Chicken wings (skinless, boneless)', 4, 'manual', NOW()),
('Vital Proteins Collagen Peptides Powder, Unflavored, 1.5 lbs.', 'Vital Proteins', 'Proteins', true, 29.98, 0, 0, 18, 30, 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?w=400', 'Hydrolyzed bovine collagen peptides', 5, 'manual', NOW()),
('Black Pepper, Fine', 'Member''s Mark', 'Seasonings & Spices', true, 8.50, 1, 0, 0, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Ground black pepper', 4, 'manual', NOW()),
('Cumin, Ground', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0.93, 0.47, 0.37, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Ground cumin seeds', 4, 'manual', NOW()),
('Garlic Powder, Fine', 'Member''s Mark', 'Seasonings & Spices', true, 8.00, 2.3, 0.02, 0.51, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Ground garlic', 4, 'manual', NOW()),
('Himalayan Pink Salt, Fine Ground', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0, 0, 0, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Pink Himalayan salt', 5, 'manual', NOW()),
('Member''s Mark Organic Ground Ginger', 'Member''s Mark Organic', 'Seasonings & Spices', true, 8.50, 1.3, 0.1, 0.2, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic ground ginger', 4, 'manual', NOW()),
('Member''s Mark Organic Ground Turmeric', 'Member''s Mark Organic', 'Seasonings & Spices', true, 8.50, 1.43, 0.22, 0.17, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Organic ground turmeric', 4, 'manual', NOW()),
('Onion Powder, Ground', 'Member''s Mark', 'Seasonings & Spices', true, 8.00, 1.9, 0.02, 0.25, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Ground onion', 4, 'manual', NOW()),
('Parsley Flakes', 'Member''s Mark', 'Seasonings & Spices', true, 7.00, 0.25, 0.03, 0.13, 200, 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?w=400', 'Dried parsley', 4, 'manual', NOW()),
('Multi Bell Sweet Peppers, 6 ct.', 'Member''s Mark', 'Vegetables', true, 6.72, 9, 0.5, 1.5, 6, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Bell peppers', 4, 'manual', NOW()),
('Taylor Farms Brussels Sprouts, 2 lbs.', 'Taylor Farms', 'Vegetables', true, 4.18, 11, 0.8, 4, 8, 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?w=400', 'Brussels sprouts', 4, 'manual', NOW());

-- Insert sample recipes
INSERT INTO recipes (name, cuisine_type, meal_type, difficulty, prep_time, cook_time, total_time, servings, instructions, nutrition_per_serving, tags, rating, cost_per_serving, total_cost, cost_last_calculated, notes, created_at, updated_at) VALUES
('Grilled Chicken Salad', 'American', ARRAY['lunch', 'dinner'], 'Easy', 15, 20, 35, 2, '1. Season chicken breast with salt and pepper
2. Grill for 8-10 minutes per side
3. Let rest for 5 minutes
4. Slice and serve over mixed greens
5. Add your favorite vegetables and dressing', '{"calories": 350, "protein": 35, "carbs": 8, "fat": 12}', ARRAY['healthy', 'quick'], 4.5, 13.86, 27.72, NOW(), 'Great for meal prep', NOW(), NOW()),
('Quinoa Buddha Bowl', 'Mediterranean', ARRAY['lunch', 'dinner'], 'Medium', 20, 25, 45, 2, '1. Cook quinoa according to package instructions
2. Roast sweet potatoes and broccoli
3. Prepare tahini dressing
4. Assemble bowl with quinoa, vegetables, and dressing
5. Top with seeds and herbs', '{"calories": 420, "protein": 12, "carbs": 65, "fat": 15}', ARRAY['vegetarian', 'healthy'], 4.8, 1.69, 3.37, NOW(), 'Perfect for vegetarian meals', NOW(), NOW()),
('Greek Yogurt Parfait', 'Mediterranean', ARRAY['breakfast'], 'Easy', 5, 0, 5, 1, '1. Layer Greek yogurt in a glass
2. Add fresh berries
3. Sprinkle with granola
4. Drizzle with honey
5. Serve immediately', '{"calories": 280, "protein": 18, "carbs": 35, "fat": 8}', ARRAY['breakfast', 'quick'], 4.2, 1.00, 1.00, NOW(), 'Quick and nutritious breakfast', NOW(), NOW()),
('Salmon with Roasted Vegetables', 'Mediterranean', ARRAY['dinner'], 'Medium', 15, 25, 40, 2, '1. Preheat oven to 400F
2. Season salmon with herbs and lemon
3. Arrange vegetables on baking sheet
4. Roast salmon and vegetables for 20-25 minutes
5. Serve with lemon wedges', '{"calories": 380, "protein": 28, "carbs": 15, "fat": 18}', ARRAY['healthy', 'omega-3'], 4.6, 10.75, 21.49, NOW(), 'Rich in omega-3 fatty acids', NOW(), NOW()),
('Spinach and Egg Breakfast', 'American', ARRAY['breakfast'], 'Easy', 10, 8, 18, 1, '1. Saute spinach in olive oil
2. Crack eggs over spinach
3. Cook until whites are set
4. Season with salt and pepper
5. Serve with whole grain toast', '{"calories": 220, "protein": 14, "carbs": 6, "fat": 12}', ARRAY['breakfast', 'protein'], 4.0, 2.08, 2.08, NOW(), 'High protein breakfast option', NOW(), NOW());

-- Insert recipe ingredients (linking recipes to items)
INSERT INTO recipe_items (recipe_id, item_id, quantity, unit, cost_per_unit, total_cost, cost_calculated_at) VALUES
-- Grilled Chicken Salad
(1, 1, 2, 'piece', 12.99, 25.98, NOW()), -- Chicken Breast
(1, 3, 2, 'cup', 0.87, 1.74, NOW()),   -- Broccoli
-- Quinoa Buddha Bowl
(2, 7, 1, 'cup', 1.75, 1.75, NOW()),   -- Quinoa
(2, 5, 1, 'piece', 0.75, 0.75, NOW()), -- Sweet Potato
(2, 3, 1, 'cup', 0.87, 0.87, NOW()),   -- Broccoli
-- Greek Yogurt Parfait
(3, 6, 1, 'cup', 1.00, 1.00, NOW()),   -- Greek Yogurt
-- Salmon with Roasted Vegetables
(4, 4, 2, 'piece', 9.50, 19.00, NOW()), -- Salmon
(4, 3, 2, 'cup', 0.87, 1.74, NOW()),   -- Broccoli
(4, 5, 1, 'piece', 0.75, 0.75, NOW()), -- Sweet Potato
-- Spinach and Egg Breakfast
(5, 8, 2, 'cup', 0.62, 1.24, NOW()),   -- Spinach
(5, 9, 2, 'piece', 0.42, 0.84, NOW()); -- Eggs

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