import { FoodItem, Recipe, MealLog } from '../types';
import { MealPlanEntry } from '../hooks/useMealPlan';

export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    brand: 'Whole Foods',
    category: 'Fruits',
    in_stock: true,
    price: 2.99,
    image_url: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 89,
      protein_per_100g: 1.1,
      carbs_per_100g: 22.8,
      fat_per_100g: 0.3,
      fiber_per_100g: 2.6,
    },
    last_purchased: '2024-01-14',
    last_edited: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Chicken Breast',
    brand: 'Perdue',
    category: 'Meat',
    in_stock: false,
    price: 8.99,
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 165,
      protein_per_100g: 31,
      carbs_per_100g: 0,
      fat_per_100g: 3.6,
      fiber_per_100g: 0,
    },
    last_purchased: '2024-01-10',
    last_edited: '2024-01-14T15:20:00Z',
  },
  {
    id: '3',
    name: 'Brown Rice',
    brand: 'Uncle Ben\'s',
    category: 'Grains',
    in_stock: true,
    price: 3.49,
    image_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 112,
      protein_per_100g: 2.6,
      carbs_per_100g: 23,
      fat_per_100g: 0.9,
      fiber_per_100g: 1.8,
    },
    last_purchased: '2023-12-28',
    last_edited: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    brand: 'Fage',
    category: 'Dairy',
    in_stock: true,
    price: 5.99,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 59,
      protein_per_100g: 10,
      carbs_per_100g: 3.6,
      fat_per_100g: 0.4,
      fiber_per_100g: 0,
    },
    last_purchased: '2024-01-15',
    last_edited: '2024-01-16T08:45:00Z',
  },
  {
    id: '5',
    name: 'Olive Oil',
    brand: 'Bertolli',
    category: 'Oils',
    in_stock: false,
    price: 7.99,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 884,
      protein_per_100g: 0,
      carbs_per_100g: 0,
      fat_per_100g: 100,
      fiber_per_100g: 0,
    },
    last_purchased: '2023-12-15',
    last_edited: '2024-01-12T14:30:00Z',
  },
  {
    id: '6',
    name: 'Broccoli',
    brand: 'Fresh Market',
    category: 'Vegetables',
    in_stock: true,
    price: 3.49,
    image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 34,
      protein_per_100g: 2.8,
      carbs_per_100g: 7,
      fat_per_100g: 0.4,
      fiber_per_100g: 2.6,
    },
    last_purchased: '2024-01-16',
    last_edited: '2024-01-16T09:20:00Z',
  },
  {
    id: '7',
    name: 'Salmon',
    brand: 'Wild Alaskan',
    category: 'Meat',
    in_stock: true,
    price: 18.99,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 208,
      protein_per_100g: 25,
      carbs_per_100g: 0,
      fat_per_100g: 12,
      fiber_per_100g: 0,
    },
    last_purchased: '2024-01-15',
    last_edited: '2024-01-15T16:45:00Z',
  },
  {
    id: '8',
    name: 'Avocado',
    brand: 'Organic',
    category: 'Fruits',
    in_stock: false,
    price: 1.99,
    image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop&crop=center',
    nutrition: {
      calories_per_100g: 160,
      protein_per_100g: 2,
      carbs_per_100g: 9,
      fat_per_100g: 15,
      fiber_per_100g: 7,
    },
    last_purchased: '2024-01-10',
    last_edited: '2024-01-10T11:30:00Z',
  },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Banana Protein Smoothie',
    instructions: '1. Add 1 banana, 1 cup yogurt, and 1 cup water to blender\n2. Blend until smooth\n3. Serve immediately',
    servings: 1,
    total_time_minutes: 5,
    is_favorite: true,
    ingredients: [
      { item_id: '1', quantity: 120, unit: 'g' },
      { item_id: '4', quantity: 150, unit: 'g' },
    ],
    nutrition: {
      calories_per_serving: 200,
      protein_per_serving: 15,
      carbs_per_serving: 30,
      fat_per_serving: 2,
    },
    cost_per_serving: 2.50,
  },
  {
    id: '2',
    name: 'Grilled Salmon with Broccoli',
    instructions: '1. Season salmon with salt and pepper\n2. Grill salmon for 4-5 minutes per side\n3. Steam broccoli until tender\n4. Serve together with lemon wedges',
    servings: 2,
    total_time_minutes: 25,
    is_favorite: false,
    ingredients: [
      { item_id: '7', quantity: 300, unit: 'g' },
      { item_id: '6', quantity: 200, unit: 'g' },
    ],
    nutrition: {
      calories_per_serving: 350,
      protein_per_serving: 42,
      carbs_per_serving: 8,
      fat_per_serving: 18,
    },
    cost_per_serving: 12.50,
  },
  {
    id: '3',
    name: 'Avocado Toast with Eggs',
    instructions: '1. Toast bread until golden\n2. Mash avocado and spread on toast\n3. Fry eggs to desired doneness\n4. Top with salt, pepper, and red pepper flakes',
    servings: 2,
    total_time_minutes: 15,
    is_favorite: true,
    ingredients: [
      { item_id: '8', quantity: 150, unit: 'g' },
      { item_id: '2', quantity: 200, unit: 'g' },
    ],
    nutrition: {
      calories_per_serving: 280,
      protein_per_serving: 18,
      carbs_per_serving: 22,
      fat_per_serving: 16,
    },
    cost_per_serving: 3.75,
  },
  {
    id: '4',
    name: 'Greek Yogurt Parfait',
    instructions: '1. Layer yogurt in a glass\n2. Add granola and honey\n3. Top with fresh berries\n4. Repeat layers and serve',
    servings: 1,
    total_time_minutes: 8,
    is_favorite: false,
    ingredients: [
      { item_id: '4', quantity: 200, unit: 'g' },
      { item_id: '3', quantity: 100, unit: 'g' },
    ],
    nutrition: {
      calories_per_serving: 320,
      protein_per_serving: 22,
      carbs_per_serving: 45,
      fat_per_serving: 8,
    },
    cost_per_serving: 4.20,
  },
  {
    id: '5',
    name: 'Chicken and Rice Bowl',
    instructions: '1. Cook rice according to package directions\n2. Season and grill chicken breast\n3. Steam vegetables\n4. Assemble bowl with rice, chicken, and vegetables',
    servings: 4,
    total_time_minutes: 35,
    is_favorite: true,
    ingredients: [
      { item_id: '5', quantity: 400, unit: 'g' },
      { item_id: '3', quantity: 300, unit: 'g' },
      { item_id: '6', quantity: 250, unit: 'g' },
    ],
    nutrition: {
      calories_per_serving: 420,
      protein_per_serving: 35,
      carbs_per_serving: 55,
      fat_per_serving: 12,
    },
    cost_per_serving: 6.80,
  },
];

// Helper function to get recent dates for meal logs
const getRecentDateString = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const mockMealLogs: MealLog[] = [
  {
    id: '1',
    recipe_ids: ['1'],
    date: getRecentDateString(0), // Today
    meal_name: 'Breakfast Smoothie',
    notes: 'Added extra banana for sweetness',
    nutrition: {
      calories: 200,
      protein: 15,
      carbs: 30,
      fat: 2,
    },
    estimated_cost: 2.50,
  },
  {
    id: '2',
    recipe_ids: ['2'],
    date: getRecentDateString(0), // Today
    meal_name: 'Lunch - Grilled Salmon',
    notes: 'Salmon was perfectly cooked, broccoli slightly overcooked',
    nutrition: {
      calories: 350,
      protein: 42,
      carbs: 8,
      fat: 18,
    },
    estimated_cost: 12.50,
  },
  {
    id: '3',
    recipe_ids: ['3'],
    date: getRecentDateString(0), // Today
    meal_name: 'Dinner - Avocado Toast',
    notes: 'Used whole grain bread, eggs were runny',
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 22,
      fat: 16,
    },
    estimated_cost: 3.75,
  },
  {
    id: '4',
    recipe_ids: ['4'],
    date: getRecentDateString(1), // Yesterday
    meal_name: 'Snack - Greek Yogurt Parfait',
    notes: 'Added fresh strawberries and honey',
    nutrition: {
      calories: 320,
      protein: 22,
      carbs: 45,
      fat: 8,
    },
    estimated_cost: 4.20,
  },
  {
    id: '5',
    recipe_ids: ['5'],
    date: getRecentDateString(1), // Yesterday
    meal_name: 'Dinner - Chicken Rice Bowl',
    notes: 'Made extra for tomorrow\'s lunch',
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 55,
      fat: 12,
    },
    estimated_cost: 6.80,
  },
  {
    id: '6',
    recipe_ids: ['1'],
    date: getRecentDateString(1), // Yesterday
    meal_name: 'Post-Workout Smoothie',
    notes: 'Added protein powder for extra protein',
    nutrition: {
      calories: 250,
      protein: 25,
      carbs: 30,
      fat: 2,
    },
    estimated_cost: 3.00,
  },
  {
    id: '7',
    recipe_ids: ['2'],
    date: getRecentDateString(2), // 2 days ago
    meal_name: 'Lunch - Salmon Bowl',
    notes: 'Served with quinoa instead of rice',
    nutrition: {
      calories: 380,
      protein: 45,
      carbs: 12,
      fat: 18,
    },
    estimated_cost: 13.50,
  },
  {
    id: '8',
    recipe_ids: ['3'],
    date: getRecentDateString(2), // 2 days ago
    meal_name: 'Breakfast - Avocado Toast',
    notes: 'Added microgreens and everything bagel seasoning',
    nutrition: {
      calories: 300,
      protein: 18,
      carbs: 25,
      fat: 18,
    },
    estimated_cost: 4.25,
  },
  {
    id: '9',
    recipe_ids: ['4'],
    date: getRecentDateString(3), // 3 days ago
    meal_name: 'Snack - Yogurt Bowl',
    notes: 'Used vanilla yogurt and added granola',
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 50,
      fat: 8,
    },
    estimated_cost: 4.50,
  },
  {
    id: '10',
    recipe_ids: ['5'],
    date: getRecentDateString(3), // 3 days ago
    meal_name: 'Dinner - Chicken Bowl',
    notes: 'Added hot sauce and extra vegetables',
    nutrition: {
      calories: 450,
      protein: 38,
      carbs: 58,
      fat: 14,
    },
    estimated_cost: 7.20,
  },
  // Add some multi-recipe meal examples
  {
    id: '11',
    recipe_ids: ['1', '4'],
    date: getRecentDateString(4), // 4 days ago
    meal_name: 'Breakfast Combo - Smoothie & Yogurt',
    notes: 'Perfect post-workout breakfast combination',
    nutrition: {
      calories: 520,
      protein: 37,
      carbs: 75,
      fat: 10,
    },
    estimated_cost: 6.70,
  },
  {
    id: '12',
    recipe_ids: ['2', '3'],
    date: getRecentDateString(5), // 5 days ago
    meal_name: 'Luxury Dinner - Salmon & Toast',
    notes: 'Elegant dinner for two with premium ingredients',
    nutrition: {
      calories: 630,
      protein: 60,
      carbs: 30,
      fat: 34,
    },
    estimated_cost: 16.25,
  },
];

// Helper function to get dates for meal planning
const getDateString = (daysFromToday: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
};

export const mockMealPlan: MealPlanEntry[] = [
  // This week's plan (Monday to Sunday)
  { id: '1', date: getDateString(-6), mealType: 'breakfast', recipeId: '1' }, // Banana Smoothie
  { id: '2', date: getDateString(-6), mealType: 'lunch', recipeId: '2' }, // Grilled Salmon
  { id: '3', date: getDateString(-6), mealType: 'dinner', recipeId: '5' }, // Chicken Rice Bowl
  
  { id: '4', date: getDateString(-5), mealType: 'breakfast', recipeId: '4' }, // Greek Yogurt Parfait
  { id: '5', date: getDateString(-5), mealType: 'lunch', recipeId: '3' }, // Avocado Toast
  { id: '6', date: getDateString(-5), mealType: 'dinner', recipeId: '2' }, // Grilled Salmon
  
  { id: '7', date: getDateString(-4), mealType: 'breakfast', recipeId: '1' }, // Banana Smoothie
  { id: '8', date: getDateString(-4), mealType: 'lunch', recipeId: '5' }, // Chicken Rice Bowl
  { id: '9', date: getDateString(-4), mealType: 'dinner', recipeId: '3' }, // Avocado Toast
  
  { id: '10', date: getDateString(-3), mealType: 'breakfast', recipeId: '4' }, // Greek Yogurt Parfait
  { id: '11', date: getDateString(-3), mealType: 'lunch', recipeId: '2' }, // Grilled Salmon
  { id: '12', date: getDateString(-3), mealType: 'dinner', recipeId: '5' }, // Chicken Rice Bowl
  
  { id: '13', date: getDateString(-2), mealType: 'breakfast', recipeId: '1' }, // Banana Smoothie
  { id: '14', date: getDateString(-2), mealType: 'lunch', recipeId: '3' }, // Avocado Toast
  { id: '15', date: getDateString(-2), mealType: 'dinner', recipeId: '2' }, // Grilled Salmon
  
  { id: '16', date: getDateString(-1), mealType: 'breakfast', recipeId: '4' }, // Greek Yogurt Parfait
  { id: '17', date: getDateString(-1), mealType: 'lunch', recipeId: '5' }, // Chicken Rice Bowl
  { id: '18', date: getDateString(-1), mealType: 'dinner', recipeId: '3' }, // Avocado Toast
  
  { id: '19', date: getDateString(0), mealType: 'breakfast', recipeId: '1' }, // Today - Banana Smoothie
  { id: '20', date: getDateString(0), mealType: 'lunch', recipeId: '2' }, // Today - Grilled Salmon
  { id: '21', date: getDateString(0), mealType: 'dinner', recipeId: '5' }, // Today - Chicken Rice Bowl
  
  // Next week's plan
  { id: '22', date: getDateString(1), mealType: 'breakfast', recipeId: '4' }, // Greek Yogurt Parfait
  { id: '23', date: getDateString(1), mealType: 'lunch', recipeId: '3' }, // Avocado Toast
  { id: '24', date: getDateString(1), mealType: 'dinner', recipeId: '2' }, // Grilled Salmon
  
  { id: '25', date: getDateString(2), mealType: 'breakfast', recipeId: '1' }, // Banana Smoothie
  { id: '26', date: getDateString(2), mealType: 'lunch', recipeId: '5' }, // Chicken Rice Bowl
  
  { id: '27', date: getDateString(3), mealType: 'breakfast', recipeId: '4' }, // Greek Yogurt Parfait
  { id: '28', date: getDateString(3), mealType: 'dinner', recipeId: '3' }, // Avocado Toast
  
  { id: '29', date: getDateString(4), mealType: 'breakfast', recipeId: '1' }, // Banana Smoothie
  { id: '30', date: getDateString(4), mealType: 'lunch', recipeId: '2' }, // Grilled Salmon
  { id: '31', date: getDateString(4), mealType: 'dinner', recipeId: '5' }, // Chicken Rice Bowl
  
  { id: '32', date: getDateString(5), mealType: 'breakfast', recipeId: '4' }, // Greek Yogurt Parfait
  { id: '33', date: getDateString(5), mealType: 'lunch', recipeId: '3' }, // Avocado Toast
  
  { id: '34', date: getDateString(6), mealType: 'breakfast', recipeId: '1' }, // Banana Smoothie
  { id: '35', date: getDateString(6), mealType: 'lunch', recipeId: '5' }, // Chicken Rice Bowl
  { id: '36', date: getDateString(6), mealType: 'dinner', recipeId: '2' }, // Grilled Salmon
];