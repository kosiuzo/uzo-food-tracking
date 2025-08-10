import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Recipe, RecipeIngredient, DbRecipe } from '../types';
import { dbRecipeToRecipe, recipeToDbInsert } from '../lib/typeMappers';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      
      // Load recipes with their ingredients
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_items (
            quantity,
            unit,
            item_id
          )
        `)
        .order('name');
      
      if (recipesError) throw recipesError;
      
      const mappedRecipes = recipesData.map((dbRecipe: Record<string, unknown>) => {
        const ingredients: RecipeIngredient[] = (dbRecipe.recipe_items as Record<string, unknown>[]).map((ri: Record<string, unknown>) => ({
          item_id: ri.item_id.toString(),
          quantity: ri.quantity,
          unit: ri.unit,
        }));
        
        return dbRecipeToRecipe(dbRecipe, ingredients);
      });
      
      setRecipes(mappedRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteRecipes = filteredRecipes.filter(r => r.is_favorite);

const addRecipe = async (recipe: Omit<Recipe, 'id' | 'is_favorite'>) => {
    try {
      const dbRecipe = recipeToDbInsert(recipe);
      
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([dbRecipe])
        .select()
        .single();
      
      if (recipeError) throw recipeError;
      
      // Insert recipe ingredients
      if (recipe.ingredients.length > 0) {
        const recipeIngredients = recipe.ingredients.map(ingredient => ({
          recipe_id: recipeData.id,
          item_id: parseInt(ingredient.item_id),
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }));
        
        const { error: ingredientsError } = await supabase
          .from('recipe_items')
          .insert(recipeIngredients);
        
        if (ingredientsError) throw ingredientsError;
      }
      
      // Calculate recipe cost after ingredients are inserted
      try {
        await supabase.rpc('calculate_recipe_cost', { p_recipe_id: recipeData.id });
      } catch (costError) {
        console.warn('Failed to calculate recipe cost:', costError);
      }
      
      const newRecipe = dbRecipeToRecipe(recipeData, recipe.ingredients);
      setRecipes(prev => [...prev, newRecipe]);
      return newRecipe;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add recipe');
      throw err;
    }
  };

const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      const numericId = parseInt(id);
      
      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          name: updates.name,
          instructions: updates.instructions,
          servings: updates.servings,
          prep_time: updates.prep_time_minutes,
          nutrition_per_serving: updates.nutrition,
          rating: updates.is_favorite ? 5 : null,
        })
        .eq('id', numericId);
      
      if (recipeError) throw recipeError;
      
      // Update ingredients if provided
      if (updates.ingredients) {
        // Delete existing ingredients
        await supabase
          .from('recipe_items')
          .delete()
          .eq('recipe_id', numericId);
        
        // Insert new ingredients
        if (updates.ingredients.length > 0) {
          const recipeIngredients = updates.ingredients.map(ingredient => ({
            recipe_id: numericId,
            item_id: parseInt(ingredient.item_id),
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          }));
          
          const { error: ingredientsError } = await supabase
            .from('recipe_items')
            .insert(recipeIngredients);
          
          if (ingredientsError) throw ingredientsError;
        }
      }
      
      // Recalculate recipe cost if ingredients were updated
      if (updates.ingredients) {
        try {
          await supabase.rpc('calculate_recipe_cost', { p_recipe_id: numericId });
        } catch (costError) {
          console.warn('Failed to calculate recipe cost:', costError);
        }
      }
      
      setRecipes(prev =>
        prev.map(recipe => (recipe.id === id ? { ...recipe, ...updates } : recipe))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      await updateRecipe(id, { is_favorite: !recipe.is_favorite });
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const numericId = parseInt(id);
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', numericId);
      
      if (error) throw error;
      
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      throw err;
    }
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

return {
    recipes: filteredRecipes,
    favorites: favoriteRecipes,
    allRecipes: recipes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addRecipe,
    updateRecipe,
    toggleFavorite,
    deleteRecipe,
    getRecipeById,
    refetch: loadRecipes,
  };
}