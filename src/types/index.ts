export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  in_stock: boolean;
  price?: number;
  serving_size?: number;
  serving_quantity?: number;
  serving_unit?: string;
  serving_unit_type?: 'volume' | 'weight' | 'package';
  image_url?: string;
  ingredients?: string;
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
}

// Database row type for items table
export interface DbItem {
  id: number;
  name: string;
  brand?: string | null;
  category?: string | null;
  in_stock?: boolean | null;
  price?: number | null;
  calories_per_serving?: number | null;
  carbs_per_serving?: number | null;
  fat_per_serving?: number | null;
  protein_per_serving?: number | null;
  servings_per_container?: number | null;
  serving_size_grams?: number | null;
  serving_quantity?: number | null;
  serving_unit?: string | null;
  serving_unit_type?: 'volume' | 'weight' | 'package' | null;
  image_url?: string | null;
  ingredients?: string | null;
  nutrition_source?: string | null;
  barcode?: string | null;
  last_purchased?: string | null;
  purchase_count?: number | null;
  rating?: number | null;
  last_edited?: string | null;
  normalized_name?: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  instructions: string;
  servings: number;
  total_time_minutes?: number;
  ingredients: RecipeIngredient[];
  nutrition: {
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
  };
  cost_per_serving?: number;
  total_cost?: number;
  cost_last_calculated?: string;
  is_favorite?: boolean;
  notes?: string;
  tags?: Tag[]; // Normalized tags
}

// Database row type for recipes table
export interface DbRecipe {
  id: number;
  name: string;
  cuisine_type?: string | null;
  difficulty?: string | null;
  prep_time?: number | null;
  cook_time?: number | null;
  total_time?: number | null;
  servings?: number | null;
  instructions?: string | null;
  nutrition_per_serving?: Record<string, unknown> | null;
  is_favorite?: boolean | null;
  source_link?: string | null;
  cost_per_serving?: number | null;
  total_cost?: number | null;
  cost_last_calculated?: string | null;
  notes?: string | null;
  times_cooked?: number | null;
  last_cooked?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RecipeIngredient {
  item_id: string;
  quantity: number;
  unit: string;
  cost_per_unit?: number;
  total_cost?: number;
  cost_calculated_at?: string;
}

export interface MealLog {
  id: string;
  recipe_ids: string[]; // Now supports multiple recipes
  date: string;
  meal_name: string;
  notes?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  estimated_cost: number; // Now mandatory, derived from recipes
}

// New types for the reimagined meal planner
export interface RecipeRotation {
  id: string;
  name: string;
  recipes: string[]; // Array of recipe IDs
  notes?: string;
}

export interface MealPlanBlock {
  id: string;
  name: string;
  startDay: number; // 0 = Monday, 1 = Tuesday, etc.
  endDay: number;
  rotations: RecipeRotation[];
  snacks?: string[]; // Array of snack recipe IDs
}

export interface WeeklyMealPlan {
  id: string;
  weekStart: string; // YYYY-MM-DD
  blocks: MealPlanBlock[];
}

// Database row type for meal_logs table
export interface DbMealLog {
  id: number;
  recipe_ids: number[];
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
  id: string;
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