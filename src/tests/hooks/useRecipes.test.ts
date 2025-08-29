import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useRecipes } from '../../hooks/useRecipes';
import { mockRecipes } from '../../data/mockData';
import * as supabase from '../../lib/supabase';
import * as typeMappers from '../../lib/type-mappers';
import * as searchLib from '../../lib/search';

// Mock dependencies
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    rpc: vi.fn().mockReturnThis(),
  }
}));
vi.mock('../../lib/type-mappers');
vi.mock('../../lib/search');
vi.mock('../../data/mockData');

// Get the mocked supabase client
const mockSupabaseClient = vi.mocked(supabase.supabase);

// Mock recipe data
const mockDbRecipe = {
  id: 1,
  name: 'Test Recipe',
  instructions: 'Test instructions',
  servings: 4,
  total_time: 30,
  nutrition_per_serving: { calories: 200, protein: 10, carbs: 30, fat: 5 },
  is_favorite: false,
  notes: 'Test notes',
  cost_per_serving: 2.50,
  total_cost: 10.00,
  recipe_items: [
    { item_id: 1, quantity: 2, unit: 'cups' }
  ],
  recipe_tags: [
    { tag_id: 1, tags: { id: 1, name: 'Test Tag', color: '#000000' } }
  ]
};

const mockRecipe = {
  id: 1,
  name: 'Test Recipe',
  instructions: 'Test instructions',
  servings: 4,
  total_time_minutes: 30,
  nutrition: { calories_per_serving: 200, protein_per_serving: 10, carbs_per_serving: 30, fat_per_serving: 5 },
  is_favorite: false,
  notes: 'Test notes',
  cost_per_serving: 2.50,
  total_cost: 10.00,
  ingredients: [{ item_id: 1, quantity: 2, unit: 'cups' }],
  tags: [{ id: 1, name: 'Test Tag', color: '#000000' }]
};

describe('useRecipes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(typeMappers.dbRecipeToRecipe).mockReturnValue(mockRecipe);
    vi.mocked(typeMappers.recipeToDbInsert).mockReturnValue(mockDbRecipe);
    vi.mocked(typeMappers.dbTagToTag).mockReturnValue({ id: 1, name: 'Test Tag', color: '#000000' });
    vi.mocked(mockRecipes).mockReturnValue([mockRecipe]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('loadRecipes', () => {
    it('should load recipes from Supabase successfully', async () => {
      vi.mocked(mockSupabaseClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        })
      } as any);

      const { result } = renderHook(() => useRecipes());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.recipes).toHaveLength(1);
      expect(result.current.usingMockData).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fall back to mock data when Supabase fails', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection failed' }
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.usingMockData).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should use mock data when database is empty', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.usingMockData).toBe(true);
    });

    it('should handle database exceptions gracefully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockRejectedValue(new Error('Database connection error'))
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.usingMockData).toBe(true);
      expect(result.current.error).toContain('mock data');
    });
  });

  describe('addRecipe', () => {
    it('should add a recipe successfully', async () => {
      const insertMock = vi.fn().mockResolvedValue({
        data: mockDbRecipe,
        error: null
      });
      
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: insertMock
          })
        })
      });

      mockSupabaseClient.rpc = vi.fn().mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newRecipe = {
        name: 'New Recipe',
        instructions: 'New instructions',
        servings: 2,
        total_time_minutes: 20,
        ingredients: [],
        nutrition: { calories_per_serving: 100, protein_per_serving: 5, carbs_per_serving: 15, fat_per_serving: 3 }
      };

      await act(async () => {
        await result.current.addRecipe(newRecipe);
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes');
      expect(insertMock).toHaveBeenCalled();
    });

    it('should add recipe with ingredients', async () => {
      const insertRecipeMock = vi.fn().mockResolvedValue({
        data: mockDbRecipe,
        error: null
      });
      const insertIngredientsMock = vi.fn().mockResolvedValue({
        data: null,
        error: null
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'recipes') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: insertRecipeMock
              })
            })
          };
        }
        if (table === 'recipe_items') {
          return {
            insert: insertIngredientsMock
          };
        }
        return mockSupabaseClient;
      });

      mockSupabaseClient.rpc = vi.fn().mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newRecipe = {
        name: 'Recipe with ingredients',
        instructions: 'Instructions',
        servings: 2,
        total_time_minutes: 30,
        ingredients: [{ item_id: 1, quantity: 2, unit: 'cups' }],
        nutrition: { calories_per_serving: 100, protein_per_serving: 5, carbs_per_serving: 15, fat_per_serving: 3 }
      };

      await act(async () => {
        await result.current.addRecipe(newRecipe);
      });

      expect(insertIngredientsMock).toHaveBeenCalled();
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('calculate_recipe_cost', { p_recipe_id: 1 });
    });

    it('should add recipe with tags', async () => {
      const insertRecipeMock = vi.fn().mockResolvedValue({
        data: mockDbRecipe,
        error: null
      });
      const insertTagsMock = vi.fn().mockResolvedValue({
        data: null,
        error: null
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'recipes') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: insertRecipeMock
              })
            })
          };
        }
        if (table === 'recipe_tags') {
          return {
            insert: insertTagsMock
          };
        }
        return mockSupabaseClient;
      });

      mockSupabaseClient.rpc = vi.fn().mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newRecipe = {
        name: 'Recipe with tags',
        instructions: 'Instructions',
        servings: 2,
        total_time_minutes: 30,
        ingredients: [],
        nutrition: { calories_per_serving: 100, protein_per_serving: 5, carbs_per_serving: 15, fat_per_serving: 3 },
        selectedTagIds: ['1', '2']
      };

      await act(async () => {
        await result.current.addRecipe(newRecipe);
      });

      expect(insertTagsMock).toHaveBeenCalled();
    });

    it('should handle add recipe errors', async () => {
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Insert failed' }
            })
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newRecipe = {
        name: 'Failed Recipe',
        instructions: 'Instructions',
        servings: 2,
        total_time_minutes: 30,
        ingredients: [],
        nutrition: { calories_per_serving: 100, protein_per_serving: 5, carbs_per_serving: 15, fat_per_serving: 3 }
      };

      await expect(
        act(async () => {
          await result.current.addRecipe(newRecipe);
        })
      ).rejects.toThrow();
    });
  });

  describe('updateRecipe', () => {
    it('should update a recipe successfully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = {
        name: 'Updated Recipe Name',
        is_favorite: true
      };

      await act(async () => {
        await result.current.updateRecipe(1, updates);
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes');
    });

    it('should update recipe ingredients', async () => {
      const deleteIngredientsMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const insertIngredientsMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const updateRecipeMock = vi.fn().mockResolvedValue({ data: null, error: null });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'recipes') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbRecipe],
                error: null
              }),
              eq: vi.fn().mockResolvedValue({
                data: mockDbRecipe,
                error: null
              }),
              single: vi.fn().mockResolvedValue({
                data: mockDbRecipe,
                error: null
              })
            }),
            update: vi.fn().mockReturnValue({
              eq: updateRecipeMock
            })
          };
        }
        if (table === 'recipe_items') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: deleteIngredientsMock
            }),
            insert: insertIngredientsMock
          };
        }
        return mockSupabaseClient;
      });

      mockSupabaseClient.rpc = vi.fn().mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updates = {
        name: 'Updated Recipe',
        ingredients: [{ item_id: 2, quantity: 3, unit: 'tbsp' }]
      };

      await act(async () => {
        await result.current.updateRecipe(1, updates);
      });

      expect(deleteIngredientsMock).toHaveBeenCalled();
      expect(insertIngredientsMock).toHaveBeenCalled();
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('calculate_recipe_cost', { p_recipe_id: 1 });
    });

    it('should handle update recipe errors', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Update failed' }
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.updateRecipe(1, { name: 'Failed Update' });
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe successfully', async () => {
      const deleteMock = vi.fn().mockResolvedValue({ data: null, error: null });
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'recipes') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbRecipe],
                error: null
              })
            }),
            delete: vi.fn().mockReturnValue({
              eq: deleteMock
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteRecipe(1);
      });

      expect(deleteMock).toHaveBeenCalled();
    });

    it('should handle delete recipe errors', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Delete failed' }
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.deleteRecipe(1);
        })
      ).rejects.toThrow();
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle recipe favorite status', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'recipes') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbRecipe],
                error: null
              })
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: null
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite(1);
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes');
    });
  });

  describe('performSearch', () => {
    it('should perform search with Supabase when not using mock data', async () => {
      vi.mocked(searchLib.searchRecipes).mockResolvedValue({
        items: [mockRecipe],
        totalCount: 1
      });

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.performSearch('test query', [1]);
      });

      expect(searchLib.searchRecipes).toHaveBeenCalledWith('test query', {
        tags: [1],
        sortBy: 'relevance'
      });
    });

    it('should perform local search with mock data', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection failed' }
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.usingMockData).toBe(true);
      });

      await act(async () => {
        await result.current.performSearch('test');
      });

      expect(result.current.searchQuery).toBe('test');
    });

    it('should handle search errors gracefully', async () => {
      vi.mocked(searchLib.searchRecipes).mockRejectedValue(new Error('Search failed'));

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.performSearch('test query');
      });

      expect(result.current.error).toContain('search failed');
    });
  });

  describe('filtering', () => {
    it('should filter recipes correctly', async () => {
      const recipes = [
        { ...mockRecipe, id: 1, name: 'Apple Pie', is_favorite: false },
        { ...mockRecipe, id: 2, name: 'Banana Bread', is_favorite: true },
        { ...mockRecipe, id: 3, name: 'Cherry Tart', is_favorite: false }
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: recipes.map(r => ({ ...mockDbRecipe, ...r })),
            error: null
          })
        })
      });

      vi.mocked(typeMappers.dbRecipeToRecipe).mockImplementation((dbRecipe: any) => 
        recipes.find(r => r.id === dbRecipe.id) || mockRecipe
      );

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.recipes).toHaveLength(3);
      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].name).toBe('Banana Bread');
    });
  });

  describe('getRecipeById', () => {
    it('should return recipe by ID', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const recipe = result.current.getRecipeById(1);
      expect(recipe).toBeDefined();
      expect(recipe?.id).toBe(1);
    });

    it('should return undefined for non-existent recipe', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbRecipe],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useRecipes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const recipe = result.current.getRecipeById(999);
      expect(recipe).toBeUndefined();
    });
  });
});