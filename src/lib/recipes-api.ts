// REST API service for recipes using Supabase
// Designed for AI-generated recipes and ChatGPT integration

import { supabase } from './supabase';
import type { Database } from '@/types/database';

// Types for API operations
export interface CreateRecipeRequest {
  name: string;
  instructions: string;
  servings?: number;
  total_time?: number;
  ingredient_list?: string[];
  nutrition_per_serving?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  notes?: string;
  nutrition_source?: 'ai_generated' | 'manual' | 'calculated';
  is_favorite?: boolean;
}

export interface UpdateRecipeRequest {
  name?: string;
  instructions?: string;
  servings?: number;
  total_time?: number;
  ingredient_list?: string[];
  nutrition_per_serving?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  notes?: string;
  nutrition_source?: 'ai_generated' | 'manual' | 'calculated';
  is_favorite?: boolean;
}

export interface RecipeResponse {
  id: number;
  name: string;
  instructions: string | null;
  servings: number | null;
  total_time: number | null;
  ingredient_list: string[] | null;
  nutrition_per_serving: Record<string, unknown> | null;
  notes: string | null;
  nutrition_source: string | null;
  is_favorite: boolean | null;
  source_link: string | null;
  times_cooked: number | null;
  last_cooked: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Get all recipes
 */
export async function getAllRecipes(): Promise<ApiResponse<RecipeResponse[]>> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as RecipeResponse[],
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error fetching recipes:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Get recipe by exact name match
 */
export async function getRecipeByName(name: string): Promise<ApiResponse<RecipeResponse>> {
  try {
    if (!name || name.trim().length === 0) {
      return {
        data: null,
        error: 'Recipe name is required',
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: `Recipe with name "${name}" not found`,
          success: false,
        };
      }
      
      console.error('Error fetching recipe by name:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as RecipeResponse,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error fetching recipe by name:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Search recipes by name (partial match)
 */
export async function searchRecipesByName(searchTerm: string): Promise<ApiResponse<RecipeResponse[]>> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        data: null,
        error: 'Search term is required',
        success: false,
      };
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('name', `%${searchTerm.trim()}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching recipes:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as RecipeResponse[],
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error searching recipes:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Create a new recipe (typically AI-generated)
 */
export async function createRecipe(recipe: CreateRecipeRequest): Promise<ApiResponse<RecipeResponse>> {
  try {
    if (!recipe.name || recipe.name.trim().length === 0) {
      return {
        data: null,
        error: 'Recipe name is required',
        success: false,
      };
    }

    if (!recipe.instructions || recipe.instructions.trim().length === 0) {
      return {
        data: null,
        error: 'Recipe instructions are required',
        success: false,
      };
    }

    // Check if recipe with same name already exists
    const existingRecipe = await getRecipeByName(recipe.name.trim());
    if (existingRecipe.success && existingRecipe.data) {
      return {
        data: null,
        error: `Recipe with name "${recipe.name}" already exists`,
        success: false,
      };
    }

    const recipeData: Database['public']['Tables']['recipes']['Insert'] = {
      name: recipe.name.trim(),
      instructions: recipe.instructions.trim(),
      servings: recipe.servings || null,
      total_time: recipe.total_time || null,
      ingredient_list: recipe.ingredient_list || null,
      nutrition_per_serving: recipe.nutrition_per_serving || null,
      notes: recipe.notes?.trim() || null,
      nutrition_source: recipe.nutrition_source || 'ai_generated',
      is_favorite: recipe.is_favorite || false,
    };

    const { data, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (error) {
      console.error('Error creating recipe:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as RecipeResponse,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error creating recipe:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Update an existing recipe by ID
 */
export async function updateRecipeById(id: number, updates: UpdateRecipeRequest): Promise<ApiResponse<RecipeResponse>> {
  try {
    if (!id || id <= 0) {
      return {
        data: null,
        error: 'Valid recipe ID is required',
        success: false,
      };
    }

    // Check if recipe exists
    const { error: fetchError } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return {
          data: null,
          error: `Recipe with ID ${id} not found`,
          success: false,
        };
      }
      return {
        data: null,
        error: fetchError.message,
        success: false,
      };
    }

    // Prepare update data
    const updateData: Database['public']['Tables']['recipes']['Update'] = {};
    
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.instructions !== undefined) updateData.instructions = updates.instructions.trim();
    if (updates.servings !== undefined) updateData.servings = updates.servings;
    if (updates.total_time !== undefined) updateData.total_time = updates.total_time;
    if (updates.ingredient_list !== undefined) updateData.ingredient_list = updates.ingredient_list;
    if (updates.nutrition_per_serving !== undefined) updateData.nutrition_per_serving = updates.nutrition_per_serving;
    if (updates.notes !== undefined) updateData.notes = updates.notes?.trim() || null;
    if (updates.nutrition_source !== undefined) updateData.nutrition_source = updates.nutrition_source;
    if (updates.is_favorite !== undefined) updateData.is_favorite = updates.is_favorite;

    const { data, error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recipe:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: data as RecipeResponse,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error updating recipe:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Update an existing recipe by name
 */
export async function updateRecipeByName(name: string, updates: UpdateRecipeRequest): Promise<ApiResponse<RecipeResponse>> {
  try {
    if (!name || name.trim().length === 0) {
      return {
        data: null,
        error: 'Recipe name is required',
        success: false,
      };
    }

    // First get the recipe to find its ID
    const existingRecipe = await getRecipeByName(name.trim());
    if (!existingRecipe.success || !existingRecipe.data) {
      return {
        data: null,
        error: existingRecipe.error || `Recipe with name "${name}" not found`,
        success: false,
      };
    }

    // Use the ID-based update
    return updateRecipeById(existingRecipe.data.id, updates);
  } catch (err) {
    console.error('Unexpected error updating recipe by name:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Delete a recipe by ID
 */
export async function deleteRecipeById(id: number): Promise<ApiResponse<{ id: number }>> {
  try {
    if (!id || id <= 0) {
      return {
        data: null,
        error: 'Valid recipe ID is required',
        success: false,
      };
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recipe:', error);
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }

    return {
      data: { id },
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error deleting recipe:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}

/**
 * Delete a recipe by name
 */
export async function deleteRecipeByName(name: string): Promise<ApiResponse<{ id: number, name: string }>> {
  try {
    if (!name || name.trim().length === 0) {
      return {
        data: null,
        error: 'Recipe name is required',
        success: false,
      };
    }

    // First get the recipe to find its ID and verify it exists
    const existingRecipe = await getRecipeByName(name.trim());
    if (!existingRecipe.success || !existingRecipe.data) {
      return {
        data: null,
        error: existingRecipe.error || `Recipe with name "${name}" not found`,
        success: false,
      };
    }

    // Use the ID-based delete
    const deleteResult = await deleteRecipeById(existingRecipe.data.id);
    if (!deleteResult.success) {
      return {
        data: null,
        error: deleteResult.error,
        success: false,
      };
    }

    return {
      data: { 
        id: existingRecipe.data.id, 
        name: existingRecipe.data.name 
      },
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected error deleting recipe by name:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      success: false,
    };
  }
}