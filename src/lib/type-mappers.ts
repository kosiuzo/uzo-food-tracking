// Type mapping utilities to convert between database and application types
// This ensures consistent data transformations and handles the ID type differences

import type { Database } from '@/types/database';
import type { FoodItem, DbItem, Recipe, DbRecipe, MealLog, DbMealLog, Tag, DbTag } from '@/types';

// Database types from Supabase
type DbItemRow = Database['public']['Tables']['items']['Row'];
type DbRecipeRow = Database['public']['Tables']['recipes']['Row'];
type DbMealLogRow = Database['public']['Tables']['meal_logs']['Row'];
type DbTagRow = Database['public']['Tables']['tags']['Row'];

/**
 * Convert database item row to application FoodItem
 */
export function dbItemToFoodItem(dbItem: DbItemRow): FoodItem {
  return {
    id: dbItem.id,
    name: dbItem.name,
    brand: dbItem.brand || undefined,
    category: dbItem.category || 'Uncategorized',
    in_stock: dbItem.in_stock ?? true,
    price: dbItem.price || undefined,
    serving_size: dbItem.serving_size_grams || undefined,
    serving_quantity: dbItem.serving_quantity || undefined,
    serving_unit: dbItem.serving_unit || undefined,
    serving_unit_type: dbItem.serving_unit_type || undefined,
    image_url: dbItem.image_url || undefined,
    ingredients: dbItem.ingredients || undefined,
    nutrition: {
      calories_per_serving: dbItem.calories_per_serving || 0,
      protein_per_serving: dbItem.protein_per_serving || 0,
      carbs_per_serving: dbItem.carbs_per_serving || 0,
      fat_per_serving: dbItem.fat_per_serving || 0,
      fiber_per_serving: 0, // Note: fiber not stored in DB yet
    },
    last_purchased: dbItem.last_purchased || undefined,
    rating: dbItem.rating || undefined,
    last_edited: dbItem.last_edited || dbItem.updated_at,
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at,
  };
}

/**
 * Convert application FoodItem to database item insert/update format
 */
export function foodItemToDbInsert(item: Partial<FoodItem>): Database['public']['Tables']['items']['Insert'] {
  return {
    name: item.name!,
    brand: item.brand || null,
    category: item.category || null,
    in_stock: item.in_stock ?? true,
    price: item.price || null,
    serving_size_grams: item.serving_size || null,
    serving_quantity: item.serving_quantity || null,
    serving_unit: item.serving_unit || null,
    serving_unit_type: item.serving_unit_type || null,
    image_url: item.image_url || null,
    ingredients: item.ingredients || null,
    calories_per_serving: item.nutrition?.calories_per_serving || null,
    protein_per_serving: item.nutrition?.protein_per_serving || null,
    carbs_per_serving: item.nutrition?.carbs_per_serving || null,
    fat_per_serving: item.nutrition?.fat_per_serving || null,
    rating: item.rating || null,
    last_purchased: item.last_purchased || null,
  };
}

/**
 * Convert database recipe row to application Recipe
 */
export function dbRecipeToRecipe(
  dbRecipe: DbRecipeRow, 
  ingredients: Array<{item_id: number, quantity: number, unit: string}> = [], 
  tags: Tag[] = []
): Recipe {
  const nutrition = (dbRecipe.nutrition_per_serving as Record<string, number>) || {};
  
  return {
    id: dbRecipe.id,
    name: dbRecipe.name,
    instructions: dbRecipe.instructions || '',
    servings: dbRecipe.servings || 1,
    total_time_minutes: dbRecipe.total_time || undefined,
    ingredients: ingredients,
    nutrition: {
      calories_per_serving: nutrition.calories_per_serving || nutrition.calories || 0,
      protein_per_serving: nutrition.protein_per_serving || nutrition.protein || 0,
      carbs_per_serving: nutrition.carbs_per_serving || nutrition.carbs || 0,
      fat_per_serving: nutrition.fat_per_serving || nutrition.fat || 0,
    },
    cost_per_serving: dbRecipe.cost_per_serving || undefined,
    total_cost: dbRecipe.total_cost || undefined,
    cost_last_calculated: dbRecipe.cost_last_calculated || undefined,
    is_favorite: dbRecipe.is_favorite || false,
    notes: dbRecipe.notes || undefined,
    tags: tags,
    created_at: dbRecipe.created_at || new Date().toISOString(),
    updated_at: dbRecipe.updated_at || new Date().toISOString(),
  };
}

/**
 * Convert application Recipe to database recipe insert/update format
 */
export function recipeToDbInsert(recipe: Partial<Recipe>): Database['public']['Tables']['recipes']['Insert'] {
  return {
    name: recipe.name!,
    instructions: recipe.instructions || null,
    servings: recipe.servings || null,
    total_time: recipe.total_time_minutes || null,
    nutrition_per_serving: recipe.nutrition ? {
      calories: recipe.nutrition.calories_per_serving,
      protein: recipe.nutrition.protein_per_serving,
      carbs: recipe.nutrition.carbs_per_serving,
      fat: recipe.nutrition.fat_per_serving,
    } : null,
    is_favorite: recipe.is_favorite || false,
    notes: recipe.notes || null,
  };
}

/**
 * Convert database meal log row to application MealLog
 */
export function dbMealLogToMealLog(dbMealLog: DbMealLogRow): MealLog {
  const macros = (dbMealLog.macros as Record<string, number>) || {};
  
  return {
    id: dbMealLog.id,
    recipe_ids: dbMealLog.recipe_ids,
    date: dbMealLog.cooked_at || new Date().toISOString().split('T')[0],
    meal_name: dbMealLog.meal_name || '',
    notes: dbMealLog.notes || undefined,
    nutrition: {
      calories: macros.calories || 0,
      protein: macros.protein || 0,
      carbs: macros.carbs || 0,
      fat: macros.fat || 0,
    },
    estimated_cost: dbMealLog.cost || 0,
    created_at: dbMealLog.created_at || new Date().toISOString(),
  };
}

/**
 * Convert application MealLog to database meal log insert/update format
 */
export function mealLogToDbInsert(mealLog: Partial<MealLog>): Database['public']['Tables']['meal_logs']['Insert'] {
  return {
    recipe_ids: mealLog.recipe_ids!,
    meal_name: mealLog.meal_name || null,
    cooked_at: mealLog.date || null,
    notes: mealLog.notes || null,
    macros: mealLog.nutrition ? {
      calories: mealLog.nutrition.calories,
      protein: mealLog.nutrition.protein,
      carbs: mealLog.nutrition.carbs,
      fat: mealLog.nutrition.fat,
    } : null,
    cost: mealLog.estimated_cost || null,
  };
}

/**
 * Convert database tag row to application Tag
 */
export function dbTagToTag(dbTag: DbTagRow): Tag {
  return {
    id: dbTag.id,
    name: dbTag.name,
    color: dbTag.color || '#3b82f6',
    description: dbTag.description || undefined,
    created_at: dbTag.created_at || new Date().toISOString(),
    updated_at: dbTag.updated_at || new Date().toISOString(),
  };
}

/**
 * Convert application Tag to database tag insert/update format
 */
export function tagToDbInsert(tag: Partial<Tag>): Database['public']['Tables']['tags']['Insert'] {
  return {
    name: tag.name!,
    color: tag.color || '#3b82f6',
    description: tag.description || null,
  };
}

/**
 * Utility to safely convert string ID to number (for backward compatibility)
 * @deprecated Use number IDs directly
 */
export function stringIdToNumber(id: string | number): number {
  if (typeof id === 'number') return id;
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid ID format: ${id}`);
  }
  return parsed;
}

/**
 * Utility to safely convert number ID to string (for backward compatibility)
 * @deprecated Use number IDs directly
 */
export function numberIdToString(id: number | string): string {
  return id.toString();
}