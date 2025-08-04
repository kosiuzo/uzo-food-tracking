import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Recipe, RecipeIngredient } from '../types';
import { mockRecipes } from '../data/mockData';

export function useRecipes() {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('recipes', mockRecipes);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
    };
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    searchQuery,
    setSearchQuery,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };
}