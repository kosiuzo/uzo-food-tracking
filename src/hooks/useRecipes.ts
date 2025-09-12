import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Recipe, RecipeIngredient, Tag, DbTag } from '../types';
import type { Database } from '../types/database';

type DbRecipeWithRelations = Database['public']['Tables']['recipes']['Row'] & {
  recipe_items: { quantity: number | null; unit: string | null; item_id: number }[];
  recipe_tags: { tag_id: number; tags: DbTag }[];
};
import { dbRecipeToRecipe, recipeToDbInsert, dbTagToTag } from '../lib/type-mappers';
import { searchRecipes } from '../lib/search';
import { mockRecipes } from '../data/mockData';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Attempting to load recipes from Supabase...');
      
      // Try to connect to Supabase first
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_items (
            quantity,
            unit,
            item_id
          ),
          recipe_tags (
            tag_id,
            tags (*)
          )
        `)
        .order('name');
      
      if (recipesError) {
        console.warn('⚠️ Supabase connection failed, falling back to mock data:', recipesError.message);
        // Fall back to mock data
        setRecipes(mockRecipes);
        setUsingMockData(true);
        console.log('✅ Loaded mock data:', mockRecipes.length, 'recipes');
        return;
      }
      
      if (recipesData && recipesData.length > 0) {
        console.log('✅ Loaded data from Supabase:', recipesData.length, 'recipes');
        const mappedRecipes = recipesData.map((dbRecipe: DbRecipeWithRelations) => {
          const ingredients: RecipeIngredient[] = dbRecipe.recipe_items?.map((ri) => ({
            item_id: ri.item_id, // Now using number directly
            quantity: Number(ri.quantity) || 0,
            unit: ri.unit || '',
          })) || [];
          
          const tags: Tag[] = dbRecipe.recipe_tags?.map((rt) => 
            dbTagToTag(rt.tags)
          ) || [];
          
          return dbRecipeToRecipe(dbRecipe, ingredients, tags);
        });
        setRecipes(mappedRecipes);
        setUsingMockData(false);
      } else {
        // Database is empty, use mock data
        console.log('ℹ️ Database is empty, using mock data');
        setRecipes(mockRecipes);
        setUsingMockData(true);
        console.log('✅ Loaded mock data:', mockRecipes.length, 'recipes');
      }
    } catch (err) {
      console.warn('❌ Failed to load from Supabase, using mock data:', err);
      // Fall back to mock data on any error
      setRecipes(mockRecipes);
      setUsingMockData(true);
      setError('Using mock data - database connection unavailable');
      console.log('✅ Loaded mock data:', mockRecipes.length, 'recipes');
    } finally {
      setLoading(false);
    }
  };

// Enhanced filtering with search capabilities
  const filteredRecipes = recipes.filter(recipe => {
    let matchesSearch = true;
    
    // If we have a search query, use it for filtering (fallback for mock data)
    if (searchQuery && usingMockData) {
      matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     recipe.instructions?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     recipe.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return matchesSearch;
  });

  const favoriteRecipes = filteredRecipes.filter(r => r.is_favorite);

  // Enhanced search function for real-time search
  const performSearch = async (query: string, tagIds: number[] = []) => {
    if (usingMockData) {
      // For mock data, use the existing filter approach
      setSearchQuery(query);
      return;
    }

    try {
      setLoading(true);
      const searchOptions = {
        tags: tagIds,
        sortBy: 'relevance' as const,
      };

      const result = await searchRecipes(query, searchOptions);
      setRecipes(result.items);
      setSearchQuery(query);
    } catch (err) {
      console.error('Recipe search failed:', err);
      setError('Recipe search failed');
    } finally {
      setLoading(false);
    }
  };

const addRecipe = async (recipe: Omit<Recipe, 'id' | 'is_favorite'> & { selectedTagIds?: string[] }) => {
    try {
      const { selectedTagIds, ...recipeWithoutTags } = recipe;
      const dbRecipe = recipeToDbInsert(recipeWithoutTags);
      
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([dbRecipe])
        .select()
        .single();
      
      if (recipeError) throw recipeError;
      
      // Insert recipe ingredients
      if (recipeWithoutTags.ingredients.length > 0) {
        const recipeIngredients = recipeWithoutTags.ingredients.map(ingredient => ({
          recipe_id: recipeData.id,
          item_id: ingredient.item_id, // Already a number
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }));
        
        const { error: ingredientsError } = await supabase
          .from('recipe_items')
          .insert(recipeIngredients);
        
        if (ingredientsError) throw ingredientsError;
      }
      
      // Insert recipe tags
      if (selectedTagIds && selectedTagIds.length > 0) {
        const recipeTags = selectedTagIds.map(tagId => ({
          recipe_id: recipeData.id,
          tag_id: typeof tagId === 'string' ? parseInt(tagId) : tagId, // Handle both string and number IDs during transition
        }));
        
        const { error: tagsError } = await supabase
          .from('recipe_tags')
          .insert(recipeTags);
        
        if (tagsError) throw tagsError;
      }
      
      // Calculate recipe cost after ingredients are inserted
      try {
        await supabase.rpc('calculate_recipe_cost', { p_recipe_id: recipeData.id });
        // Refetch all recipes to get the updated cost values
        await loadRecipes();
        // Find and return the newly created recipe with correct costs
        const updatedRecipe = recipes.find(r => r.id === recipeData.id);
        return updatedRecipe || dbRecipeToRecipe(recipeData, recipe.ingredients);
      } catch (costError) {
        console.warn('Failed to calculate recipe cost:', costError);
        // Fall back to adding without cost calculation
        const newRecipe = dbRecipeToRecipe(recipeData, recipe.ingredients);
        setRecipes(prev => [...prev, newRecipe]);
        return newRecipe;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add recipe');
      throw err;
    }
  };

const updateRecipe = async (id: number, updates: Partial<Recipe> & { selectedTagIds?: string[] }) => {
    console.log('🎯 updateRecipe called for ID:', id, 'Updates:', updates);
    try {
      const { selectedTagIds, ...updatesWithoutTags } = updates;
      console.log('📝 Updates includes ingredients?', !!updatesWithoutTags.ingredients, 'Ingredient count:', updatesWithoutTags.ingredients?.length);
      
      // Use the nutrition provided in updates (calculated by AddRecipeDialog)
      const nutritionToSave = updatesWithoutTags.nutrition;
      
      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          name: updatesWithoutTags.name,
          instructions: updatesWithoutTags.instructions,
          servings: updatesWithoutTags.servings,
          total_time: updatesWithoutTags.total_time_minutes,
          nutrition_per_serving: nutritionToSave,
          ingredient_list: updatesWithoutTags.ingredient_list || null,
          nutrition_source: updatesWithoutTags.nutrition_source || 'calculated',
          is_favorite: updatesWithoutTags.is_favorite || false,
          notes: updatesWithoutTags.notes || null,
        })
        .eq('id', id);
      
      if (recipeError) throw recipeError;
      
      // Update tags if provided
      if (selectedTagIds !== undefined) {
        // Delete existing tags
        await supabase
          .from('recipe_tags')
          .delete()
          .eq('recipe_id', id);
        
        // Insert new tags
        if (selectedTagIds.length > 0) {
          const recipeTags = selectedTagIds.map(tagId => ({
            recipe_id: id,
            tag_id: typeof tagId === 'string' ? parseInt(tagId) : tagId, // Handle both string and number IDs during transition
          }));
          
          const { error: tagsError } = await supabase
            .from('recipe_tags')
            .insert(recipeTags);
          
          if (tagsError) throw tagsError;
        }
      }
      
      // Update ingredients if provided
      if (updatesWithoutTags.ingredients) {
        // Delete existing ingredients
        await supabase
          .from('recipe_items')
          .delete()
          .eq('recipe_id', id);
        
        // Insert new ingredients
        if (updatesWithoutTags.ingredients.length > 0) {
          const recipeIngredients = updatesWithoutTags.ingredients.map(ingredient => ({
            recipe_id: id,
            item_id: ingredient.item_id, // Already a number
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          }));
          
          const { error: ingredientsError } = await supabase
            .from('recipe_items')
            .insert(recipeIngredients);
          
          if (ingredientsError) throw ingredientsError;
        }
      }
      
      // Reload recipes to get the updated data including tags
      await loadRecipes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
      throw err;
    }
  };

  const toggleFavorite = async (id: number) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      await updateRecipe(id, { is_favorite: !recipe.is_favorite });
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      throw err;
    }
  };

  const getRecipeById = (id: number) => {
    return recipes.find(recipe => recipe.id === id);
  };

  return {
    recipes: filteredRecipes,
    favorites: favoriteRecipes,
    allRecipes: recipes,
    loading,
    error,
    usingMockData,
    searchQuery,
    setSearchQuery,
    performSearch,
    addRecipe,
    updateRecipe,
    toggleFavorite,
    deleteRecipe,
    getRecipeById,
    refetch: loadRecipes,
  };
}