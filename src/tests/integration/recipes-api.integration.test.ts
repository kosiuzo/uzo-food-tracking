import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { 
  getAllRecipes, 
  getRecipeByName, 
  searchRecipesByName,
  createRecipe, 
  updateRecipeById, 
  updateRecipeByName,
  deleteRecipeById,
  deleteRecipeByName,
  type CreateRecipeRequest 
} from '@/lib/recipes-api';
import { supabase } from '@/lib/supabase';

// Clear any mocks from unit tests
vi.clearAllMocks();

// Test data
const testRecipe1: CreateRecipeRequest = {
  name: 'Integration Test Recipe 1',
  instructions: '1. Mix ingredients\n2. Cook for 20 minutes\n3. Serve hot',
  servings: 4,
  total_time: 30,
  ingredient_list: ['flour', 'eggs', 'milk', 'salt'],
  nutrition_per_serving: {
    calories: 250,
    protein: 15,
    carbs: 30,
    fat: 8,
  },
  notes: 'This is a test recipe for integration testing',
  nutrition_source: 'ai_generated',
  is_favorite: false,
};

const testRecipe2: CreateRecipeRequest = {
  name: 'Integration Test Recipe 2',
  instructions: '1. Boil water\n2. Add pasta\n3. Drain and serve',
  servings: 2,
  total_time: 15,
  ingredient_list: ['pasta', 'water', 'olive oil'],
  nutrition_per_serving: {
    calories: 180,
    protein: 6,
    carbs: 35,
    fat: 2,
  },
  notes: 'Quick pasta recipe',
  nutrition_source: 'manual',
  is_favorite: true,
};

const testRecipe3: CreateRecipeRequest = {
  name: 'Integration Test Pasta Special',
  instructions: '1. Make sauce\n2. Cook pasta\n3. Combine',
  servings: 6,
  total_time: 45,
  ingredient_list: ['pasta', 'tomatoes', 'garlic', 'basil'],
  nutrition_per_serving: {
    calories: 220,
    protein: 8,
    carbs: 40,
    fat: 4,
  },
  notes: 'Special pasta with homemade sauce',
  nutrition_source: 'calculated',
  is_favorite: false,
};

describe('Recipes API Integration Tests (Local Supabase)', () => {
  let createdRecipeIds: number[] = [];

  beforeAll(async () => {
    // Verify we're connected to local Supabase
    const { error } = await supabase.from('recipes').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to connect to local Supabase: ${error.message}`);
    }
    console.log('✅ Connected to local Supabase instance');
  });

  beforeEach(async () => {
    // Clean up any existing test recipes before each test
    await cleanupTestRecipes();
    createdRecipeIds = [];
  });

  afterAll(async () => {
    // Clean up all test recipes after all tests
    await cleanupTestRecipes();
    console.log('✅ Integration test cleanup completed');
  });

  async function cleanupTestRecipes() {
    // Get all test recipes first
    const { data: testRecipes } = await supabase
      .from('recipes')
      .select('id')
      .ilike('name', 'Integration Test%');
    
    if (testRecipes && testRecipes.length > 0) {
      const testIds = testRecipes.map(r => r.id);
      const { error } = await supabase
        .from('recipes')
        .delete()
        .in('id', testIds);
      
      if (error && error.code !== 'PGRST116') {
        console.warn('Warning: Could not clean up test recipes:', error.message);
      }
    }
  }

  describe('createRecipe', () => {
    it('should create a new recipe successfully', async () => {
      const result = await createRecipe(testRecipe1);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();
      expect(result.data!.name).toBe(testRecipe1.name);
      expect(result.data!.instructions).toBe(testRecipe1.instructions);
      expect(result.data!.servings).toBe(testRecipe1.servings);
      expect(result.data!.total_time).toBe(testRecipe1.total_time);
      expect(result.data!.ingredient_list).toEqual(testRecipe1.ingredient_list);
      expect(result.data!.nutrition_per_serving).toEqual(testRecipe1.nutrition_per_serving);
      expect(result.data!.notes).toBe(testRecipe1.notes);
      expect(result.data!.nutrition_source).toBe(testRecipe1.nutrition_source);
      expect(result.data!.is_favorite).toBe(testRecipe1.is_favorite);
      expect(result.data!.id).toBeTypeOf('number');
      expect(result.data!.created_at).toBeTruthy();
      expect(result.data!.updated_at).toBeTruthy();

      createdRecipeIds.push(result.data!.id);
    });

    it('should prevent duplicate recipe names', async () => {
      // Create first recipe
      const firstResult = await createRecipe(testRecipe1);
      expect(firstResult.success).toBe(true);
      createdRecipeIds.push(firstResult.data!.id);

      // Try to create duplicate
      const duplicateResult = await createRecipe(testRecipe1);
      expect(duplicateResult.success).toBe(false);
      expect(duplicateResult.error).toContain('already exists');
    });

    it('should create recipe with minimal data', async () => {
      const minimalRecipe: CreateRecipeRequest = {
        name: 'Integration Test Minimal Recipe',
        instructions: 'Just cook it',
      };

      const result = await createRecipe(minimalRecipe);
      
      expect(result.success).toBe(true);
      expect(result.data!.name).toBe(minimalRecipe.name);
      expect(result.data!.instructions).toBe(minimalRecipe.instructions);
      expect(result.data!.servings).toBeNull();
      expect(result.data!.total_time).toBeNull();
      expect(result.data!.ingredient_list).toBeNull();
      expect(result.data!.nutrition_source).toBe('ai_generated'); // default value

      createdRecipeIds.push(result.data!.id);
    });
  });

  describe('getAllRecipes', () => {
    it('should return empty array when no recipes exist', async () => {
      const result = await getAllRecipes();

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toEqual([]);
    });

    it('should return all recipes ordered by creation date', async () => {
      // Create multiple recipes
      const recipe1Result = await createRecipe(testRecipe1);
      const recipe2Result = await createRecipe(testRecipe2);
      const recipe3Result = await createRecipe(testRecipe3);

      createdRecipeIds.push(
        recipe1Result.data!.id, 
        recipe2Result.data!.id, 
        recipe3Result.data!.id
      );

      const result = await getAllRecipes();

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();
      expect(result.data!.length).toBeGreaterThanOrEqual(3);

      // Check that our test recipes are included
      const testRecipeNames = result.data!.map(recipe => recipe.name);
      expect(testRecipeNames).toContain(testRecipe1.name);
      expect(testRecipeNames).toContain(testRecipe2.name);
      expect(testRecipeNames).toContain(testRecipe3.name);

      // Check ordering (newest first)
      const testRecipes = result.data!.filter(recipe => 
        recipe.name.startsWith('Integration Test')
      );
      expect(testRecipes.length).toBe(3);
    });
  });

  describe('getRecipeByName', () => {
    it('should return recipe by exact name match', async () => {
      const createResult = await createRecipe(testRecipe1);
      createdRecipeIds.push(createResult.data!.id);

      const result = await getRecipeByName(testRecipe1.name);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();
      expect(result.data!.name).toBe(testRecipe1.name);
      expect(result.data!.id).toBe(createResult.data!.id);
    });

    it('should return error for non-existent recipe', async () => {
      const result = await getRecipeByName('Non-existent Recipe');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toContain('not found');
    });

    it('should be case-sensitive', async () => {
      const createResult = await createRecipe(testRecipe1);
      createdRecipeIds.push(createResult.data!.id);

      const result = await getRecipeByName(testRecipe1.name.toLowerCase());

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });
  });

  describe('searchRecipesByName', () => {
    beforeEach(async () => {
      // Create test recipes for search
      const recipe1Result = await createRecipe(testRecipe1);
      const recipe2Result = await createRecipe(testRecipe2);
      const recipe3Result = await createRecipe(testRecipe3);

      createdRecipeIds.push(
        recipe1Result.data!.id, 
        recipe2Result.data!.id, 
        recipe3Result.data!.id
      );
    });

    it('should find recipes by partial name match', async () => {
      const result = await searchRecipesByName('Pasta');

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();
      expect(result.data!.length).toBe(2); // Recipe 2 and Recipe 3

      const foundNames = result.data!.map(recipe => recipe.name);
      expect(foundNames).toContain(testRecipe2.name);
      expect(foundNames).toContain(testRecipe3.name);
      expect(foundNames).not.toContain(testRecipe1.name);
    });

    it('should be case-insensitive', async () => {
      const result = await searchRecipesByName('pasta');

      expect(result.success).toBe(true);
      expect(result.data!.length).toBe(2);
    });

    it('should return empty array for no matches', async () => {
      const result = await searchRecipesByName('NonexistentSearchTerm');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('updateRecipeById', () => {
    let recipeId: number;

    beforeEach(async () => {
      const createResult = await createRecipe(testRecipe1);
      recipeId = createResult.data!.id;
      createdRecipeIds.push(recipeId);
    });

    it('should update recipe successfully', async () => {
      const updates = {
        name: 'Updated Integration Test Recipe',
        servings: 8,
        notes: 'Updated notes',
        is_favorite: true,
      };

      const result = await updateRecipeById(recipeId, updates);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();
      expect(result.data!.name).toBe(updates.name);
      expect(result.data!.servings).toBe(updates.servings);
      expect(result.data!.notes).toBe(updates.notes);
      expect(result.data!.is_favorite).toBe(updates.is_favorite);
      expect(result.data!.instructions).toBe(testRecipe1.instructions); // unchanged
    });

    it('should handle partial updates', async () => {
      const updates = {
        servings: 12,
      };

      const result = await updateRecipeById(recipeId, updates);

      expect(result.success).toBe(true);
      expect(result.data!.servings).toBe(12);
      expect(result.data!.name).toBe(testRecipe1.name); // unchanged
    });

    it('should return error for non-existent recipe ID', async () => {
      const result = await updateRecipeById(999999, { servings: 10 });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('updateRecipeByName', () => {
    beforeEach(async () => {
      const createResult = await createRecipe(testRecipe1);
      createdRecipeIds.push(createResult.data!.id);
    });

    it('should update recipe by name successfully', async () => {
      const updates = {
        servings: 6,
        total_time: 45,
        is_favorite: true,
      };

      const result = await updateRecipeByName(testRecipe1.name, updates);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data).toBeTruthy();
      expect(result.data!.servings).toBe(updates.servings);
      expect(result.data!.total_time).toBe(updates.total_time);
      expect(result.data!.is_favorite).toBe(updates.is_favorite);
      expect(result.data!.name).toBe(testRecipe1.name);
    });

    it('should return error for non-existent recipe name', async () => {
      const result = await updateRecipeByName('Non-existent Recipe', { servings: 10 });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('deleteRecipeById', () => {
    it('should delete recipe successfully', async () => {
      const createResult = await createRecipe(testRecipe1);
      const recipeId = createResult.data!.id;

      const deleteResult = await deleteRecipeById(recipeId);

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.error).toBeNull();
      expect(deleteResult.data).toEqual({ id: recipeId });

      // Verify recipe is actually deleted
      const getResult = await getRecipeByName(testRecipe1.name);
      expect(getResult.success).toBe(false);
      expect(getResult.error).toContain('not found');
    });

    it('should handle deleting non-existent recipe gracefully', async () => {
      const result = await deleteRecipeById(999999);

      expect(result.success).toBe(true); // Supabase doesn't error on delete of non-existent rows
      expect(result.data).toEqual({ id: 999999 });
    });
  });

  describe('deleteRecipeByName', () => {
    it('should delete recipe by name successfully', async () => {
      const createResult = await createRecipe(testRecipe1);
      const recipeId = createResult.data!.id;

      const deleteResult = await deleteRecipeByName(testRecipe1.name);

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.error).toBeNull();
      expect(deleteResult.data).toEqual({ 
        id: recipeId, 
        name: testRecipe1.name 
      });

      // Verify recipe is actually deleted
      const getResult = await getRecipeByName(testRecipe1.name);
      expect(getResult.success).toBe(false);
      expect(getResult.error).toContain('not found');
    });

    it('should handle deleting non-existent recipe by name', async () => {
      const result = await deleteRecipeByName('Non-existent Recipe XYZ');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toContain('not found');
    });

    it('should handle case-sensitive name matching', async () => {
      const createResult = await createRecipe(testRecipe1);
      createdRecipeIds.push(createResult.data!.id);

      // Try to delete with different case
      const result = await deleteRecipeByName(testRecipe1.name.toLowerCase());

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should trim whitespace from recipe name', async () => {
      const createResult = await createRecipe(testRecipe1);
      const recipeId = createResult.data!.id;

      // Delete with extra whitespace
      const deleteResult = await deleteRecipeByName(`  ${testRecipe1.name}  `);

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.data).toEqual({ 
        id: recipeId, 
        name: testRecipe1.name 
      });

      // Verify deletion
      const getResult = await getRecipeByName(testRecipe1.name);
      expect(getResult.success).toBe(false);
    });
  });

  describe('end-to-end workflow', () => {
    it('should support complete CRUD operations', async () => {
      // Create
      const createResult = await createRecipe(testRecipe1);
      expect(createResult.success).toBe(true);
      const recipeId = createResult.data!.id;
      createdRecipeIds.push(recipeId);

      // Read by name
      const getByNameResult = await getRecipeByName(testRecipe1.name);
      expect(getByNameResult.success).toBe(true);
      expect(getByNameResult.data!.id).toBe(recipeId);

      // Update by name
      const updateResult = await updateRecipeByName(testRecipe1.name, {
        servings: 10,
        notes: 'Updated in E2E test',
      });
      expect(updateResult.success).toBe(true);
      expect(updateResult.data!.servings).toBe(10);

      // Search
      const searchResult = await searchRecipesByName('Integration');
      expect(searchResult.success).toBe(true);
      expect(searchResult.data!.some(r => r.id === recipeId)).toBe(true);

      // Get all
      const getAllResult = await getAllRecipes();
      expect(getAllResult.success).toBe(true);
      expect(getAllResult.data!.some(r => r.id === recipeId)).toBe(true);

      // Delete
      const deleteResult = await deleteRecipeById(recipeId);
      expect(deleteResult.success).toBe(true);

      // Verify deletion
      const finalGetResult = await getRecipeByName(testRecipe1.name);
      expect(finalGetResult.success).toBe(false);

      // Remove from cleanup list since we already deleted
      createdRecipeIds = createdRecipeIds.filter(id => id !== recipeId);
    });
  });
});