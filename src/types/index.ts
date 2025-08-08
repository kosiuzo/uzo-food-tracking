export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  in_stock: boolean;
  unit: string;
  quantity: number;
  price?: number;
  image_url?: string;
  nutrition: {
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g: number;
  };
  last_purchased?: string;
  last_edited: string;
}

// Database row type for items table
export interface DbItem {
  id: number;
  name: string;
  brand?: string | null;
  category?: string | null;
  in_stock?: boolean | null;
  price?: number | null;
  carbs_per_serving?: number | null;
  fat_per_serving?: number | null;
  protein_per_serving?: number | null;
  servings_per_container?: number | null;
  unit_of_measure?: string | null;
  unit_quantity?: number | null;
  image_url?: string | null;
  nutrition_source?: string | null;
  barcode?: string | null;
  last_edited?: string | null;
  normalized_name?: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  instructions: string;
  servings: number;
  prep_time_minutes?: number;
  ingredients: RecipeIngredient[];
  nutrition: {
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
  };
  is_favorite?: boolean;
}

// Database row type for recipes table
export interface DbRecipe {
  id: number;
  name: string;
  cuisine_type?: string | null;
  meal_type?: string[] | null;
  difficulty?: string | null;
  prep_time?: number | null;
  cook_time?: number | null;
  total_time?: number | null;
  servings?: number | null;
  instructions?: string | null;
  nutrition_per_serving?: Record<string, unknown> | null;
  tags?: string[] | null;
  rating?: number | null;
  source_link?: string | null;
  cost_per_serving?: number | null;
  notes?: string | null;
  times_cooked?: number | null;
  average_rating?: number | null;
  last_cooked?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RecipeIngredient {
  item_id: string;
  quantity: number;
  unit: string;
}

export interface MealLog {
  id: string;
  recipe_id?: string;
  date: string;
  meal_name: string;
  notes?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  estimated_cost?: number;
}

// Database row type for meal_logs table
export interface DbMealLog {
  id: number;
  recipe_id?: number | null;
  cooked_at?: string | null;
  notes?: string | null;
  rating?: number | null;
  macros?: Record<string, unknown> | null;
  cost?: number | null;
  created_at?: string | null;
}

export interface ShoppingListItem {
  item_id: string;
  added_at: string;
}