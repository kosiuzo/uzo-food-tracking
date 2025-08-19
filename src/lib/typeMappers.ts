import { FoodItem, DbItem, Recipe, DbRecipe, MealLog, DbMealLog, RecipeIngredient } from '../types';

// Convert database item to FoodItem format
export function dbItemToFoodItem(dbItem: DbItem): FoodItem {
  return {
    id: dbItem.id.toString(),
    name: dbItem.name,
    brand: dbItem.brand || undefined,
    category: dbItem.category || 'Other',
    in_stock: dbItem.in_stock ?? true,
    price: dbItem.price !== null ? Number(dbItem.price) : undefined,
    serving_size: dbItem.serving_size_grams || 100,
    serving_quantity: dbItem.serving_quantity || undefined,
    serving_unit: dbItem.serving_unit || undefined,
    serving_unit_type: dbItem.serving_unit_type || undefined,
    image_url: dbItem.image_url || undefined,
    ingredients: dbItem.ingredients || undefined,
    nutrition: {
      calories_per_serving: (dbItem.protein_per_serving || 0) * 4 + 
                           (dbItem.carbs_per_serving || 0) * 4 + 
                           (dbItem.fat_per_serving || 0) * 9,
      protein_per_serving: dbItem.protein_per_serving || 0,
      carbs_per_serving: dbItem.carbs_per_serving || 0,
      fat_per_serving: dbItem.fat_per_serving || 0,
      fiber_per_serving: 0, // Not in database schema
    },
    last_purchased: dbItem.last_purchased || undefined,
    rating: dbItem.rating || undefined,
    last_edited: dbItem.last_edited || new Date().toISOString(),
  };
}

// Convert FoodItem to database insert format
export function foodItemToDbInsert(item: Omit<FoodItem, 'id'>): Omit<DbItem, 'id' | 'normalized_name'> {
  const servingSizeGrams = item.serving_size || 100;
  return {
    name: item.name,
    brand: item.brand || null,
    category: item.category,
    in_stock: item.in_stock,
    price: item.price || null,
    carbs_per_serving: item.nutrition.carbs_per_serving,
    fat_per_serving: item.nutrition.fat_per_serving,
    protein_per_serving: item.nutrition.protein_per_serving,
    servings_per_container: 1,
    serving_size_grams: servingSizeGrams,
    serving_quantity: item.serving_quantity || null,
    serving_unit: item.serving_unit || null,
    serving_unit_type: item.serving_unit_type || null,
    image_url: item.image_url || null,
    ingredients: item.ingredients || null,
    nutrition_source: 'manual',
    barcode: null,
    rating: item.rating || null,
    last_edited: item.last_edited,
  };
}

// Convert database recipe to Recipe format
export function dbRecipeToRecipe(dbRecipe: DbRecipe, ingredients: RecipeIngredient[] = []): Recipe {
  const nutrition = dbRecipe.nutrition_per_serving || {};
  
  return {
    id: dbRecipe.id.toString(),
    name: dbRecipe.name,
    instructions: dbRecipe.instructions || '',
    servings: dbRecipe.servings || 1,
    prep_time_minutes: dbRecipe.prep_time || undefined,
    ingredients,
    nutrition: {
      calories_per_serving: nutrition.calories || 0,
      protein_per_serving: nutrition.protein || 0,
      carbs_per_serving: nutrition.carbs || 0,
      fat_per_serving: nutrition.fat || 0,
    },
    cost_per_serving: dbRecipe.cost_per_serving || undefined,
    total_cost: dbRecipe.total_cost || undefined,
    cost_last_calculated: dbRecipe.cost_last_calculated || undefined,
    is_favorite: dbRecipe.average_rating ? dbRecipe.average_rating >= 4 : false,
  };
}

// Convert Recipe to database insert format
export function recipeToDbInsert(recipe: Omit<Recipe, 'id'>): Omit<DbRecipe, 'id' | 'created_at' | 'updated_at' | 'times_cooked' | 'average_rating' | 'last_cooked'> {
  return {
    name: recipe.name,
    cuisine_type: null,
    meal_type: null,
    difficulty: null,
    prep_time: recipe.prep_time_minutes || null,
    cook_time: null,
    total_time: recipe.prep_time_minutes || null,
    servings: recipe.servings,
    instructions: recipe.instructions,
    nutrition_per_serving: recipe.nutrition,
    tags: null,
    rating: recipe.is_favorite ? 5 : null,
    source_link: null,
    cost_per_serving: null,
    notes: null,
  };
}

// Convert database meal log to MealLog format
export function dbMealLogToMealLog(dbMealLog: DbMealLog): MealLog | null {
  // Skip meal logs without recipe_id as they are now mandatory
  if (!dbMealLog.recipe_id) {
    return null;
  }
  
  const macros = dbMealLog.macros || {};
  
  return {
    id: dbMealLog.id.toString(),
    recipe_ids: [dbMealLog.recipe_id.toString()], // Convert single recipe_id to array
    date: dbMealLog.cooked_at || new Date().toISOString().split('T')[0],
    meal_name: 'Meal', // Default name since it's not in the database
    notes: dbMealLog.notes || undefined,
    nutrition: {
      calories: macros.calories || 0,
      protein: macros.protein || 0,
      carbs: macros.carbs || 0,
      fat: macros.fat || 0,
    },
    estimated_cost: dbMealLog.cost || 0,
  };
}

// Convert MealLog to database insert format
export function mealLogToDbInsert(mealLog: Omit<MealLog, 'id'>): Omit<DbMealLog, 'id' | 'created_at'> {
  // For now, we'll use the first recipe_id for database compatibility
  // In the future, we might want to create a separate table for multiple recipes per meal
  const firstRecipeId = mealLog.recipe_ids.length > 0 ? parseInt(mealLog.recipe_ids[0]) : null;
  
  return {
    recipe_id: firstRecipeId,
    cooked_at: mealLog.date,
    notes: mealLog.notes || null,
    rating: null,
    macros: mealLog.nutrition,
    cost: mealLog.estimated_cost,
  };
}

