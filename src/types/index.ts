export interface ItemNote {
  text: string;
  date: string;
}

export interface FoodItem {
  id: number; // Changed from string to match database
  name: string;
  brand?: string;
  category: string;
  in_stock: boolean;
  serving_size?: number;
  serving_quantity?: number;
  serving_unit?: string;
  serving_unit_type?: 'volume' | 'weight' | 'package';
  image_url?: string;
  ingredients?: string;
  notes?: ItemNote[];
  nutrition: {
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
    fiber_per_serving: number;
  };
  last_purchased?: string;
  rating?: number;
  last_edited: string;
  created_at: string; // Added for consistency
  updated_at: string; // Added for consistency
}

// Database row type for items table
export interface DbItem {
  id: number;
  name: string;
  brand?: string | null;
  category?: string | null;
  in_stock?: boolean | null;
  calories_per_serving?: number | null;
  carbs_per_serving?: number | null;
  fat_per_serving?: number | null;
  protein_per_serving?: number | null;
  serving_size_grams?: number | null;
  serving_quantity?: number | null;
  serving_unit?: string | null;
  serving_unit_type?: 'volume' | 'weight' | 'package' | null;
  image_url?: string | null;
  ingredients?: string | null;
  notes?: ItemNote[] | null;
  nutrition_source?: string | null;
  barcode?: string | null;
  last_purchased?: string | null;
  purchase_count?: number | null;
  rating?: number | null;
  last_edited?: string | null;
  normalized_name?: string | null;
  created_at: string; // Added new audit field
  updated_at: string; // Added new audit field
}

export type NutritionSource = 'calculated' | 'ai_generated' | 'manual';

export interface Recipe {
  id: number; // Changed from string to match database
  name: string;
  instructions: string;
  servings: number;
  total_time_minutes?: number;
  ingredients: RecipeIngredient[]; // Linked ingredients (for cost calculation)
  ingredient_list?: string[]; // AI-generated ingredient strings
  nutrition_source?: NutritionSource; // How nutrition was determined
  nutrition: {
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
  };
  is_favorite?: boolean;
  notes?: string;
  tags?: Tag[]; // Normalized tags
  created_at: string; // Added for consistency
  updated_at: string; // Added for consistency
}

// Database row type for recipes table
export interface DbRecipe {
  id: number;
  name: string;
  total_time?: number | null;
  servings?: number | null;
  instructions?: string | null;
  nutrition_per_serving?: Record<string, unknown> | null;
  ingredient_list?: string[] | null; // AI-generated ingredient strings
  nutrition_source?: string | null; // How nutrition was determined
  is_favorite?: boolean | null;
  source_link?: string | null;
  notes?: string | null;
  times_cooked?: number | null;
  last_cooked?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RecipeIngredient {
  item_id: number; // Changed from string to match database
  quantity: number;
  unit: string;
  created_at?: string; // Added for consistency
  updated_at?: string; // Added for consistency
}

// Individual item entry in meal log
export interface MealItemEntry {
  item_id: number;
  quantity: number;
  unit: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  cost?: number;
}

export interface MealLog {
  id: number; // Changed from string to match database
  recipe_ids: number[]; // Changed from string[] to match database
  item_entries?: MealItemEntry[]; // New: individual items
  date: string;
  meal_name: string;
  notes?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  estimated_cost?: number; // Added for cost tracking
  created_at: string; // Added for consistency
}

// New types for the reimagined meal planner
export interface RecipeRotation {
  id: number; // Changed from string to match database
  name: string;
  recipes: number[]; // Changed from string[] to match database
  notes?: string;
  created_at: string; // Added for consistency
  updated_at: string; // Added for consistency
}

export interface MealPlanBlock {
  id: number; // Changed from string to match database
  name: string;
  startDay: number; // 0 = Monday, 1 = Tuesday, etc.
  endDay: number;
  rotations: RecipeRotation[];
  snacks?: number[]; // Changed from string[] to match database
  created_at: string; // Added for consistency
  updated_at: string; // Added for consistency
}

export interface WeeklyMealPlan {
  id: number; // Changed from string to match database
  weekStart: string; // YYYY-MM-DD
  blocks: MealPlanBlock[];
  created_at: string; // Added for consistency
  updated_at: string; // Added for consistency
}

// Database row type for meal_logs table
export interface DbMealLog {
  id: number;
  recipe_ids: number[];
  item_entries?: MealItemEntry[] | null; // New: individual items array
  meal_name?: string | null;
  cooked_at?: string | null;
  notes?: string | null;
  rating?: number | null;
  macros?: Record<string, unknown> | null;
  cost?: number | null;
  created_at?: string | null;
}

// Tag types
export interface Tag {
  id: number; // Changed from string to match database
  name: string;
  color: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Database row type for tags table
export interface DbTag {
  id: number;
  name: string;
  color?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Database row type for recipe_tags table
export interface DbRecipeTag {
  recipe_id: number;
  tag_id: number;
  created_at?: string | null;
}

// ShoppingListItem interface removed - using in_stock toggle instead of separate shopping_list table