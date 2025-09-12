import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  getAllRecipes, 
  getRecipeByName, 
  searchRecipesByName,
  createRecipe, 
  updateRecipeById, 
  updateRecipeByName,
  deleteRecipeById,
  type CreateRecipeRequest,
  type UpdateRecipeRequest,
  type RecipeResponse 
} from '@/lib/recipes-api';

// Mock Supabase
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockIlike = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
  },
}));

// Chain mock methods
const chainMethods = () => {
  mockSelect.mockReturnValue({
    order: mockOrder,
    eq: mockEq,
    ilike: mockIlike,
    single: mockSingle,
  });
  
  mockInsert.mockReturnValue({
    select: mockSelect,
  });
  
  mockUpdate.mockReturnValue({
    eq: mockEq,
  });
  
  mockDelete.mockReturnValue({
    eq: mockEq,
  });
  
  mockOrder.mockReturnValue({
    eq: mockEq,
    ilike: mockIlike,
  });
  
  mockEq.mockReturnValue({
    single: mockSingle,
    select: mockSelect,
  });
  
  mockIlike.mockReturnValue({
    order: mockOrder,
  });
};

// Mock recipe data
const mockRecipe: RecipeResponse = {
  id: 1,
  name: 'Test Recipe',
  instructions: 'Mix ingredients and cook',
  servings: 4,
  total_time: 30,
  ingredient_list: ['ingredient 1', 'ingredient 2'],
  nutrition_per_serving: {
    calories: 250,
    protein: 15,
    carbs: 30,
    fat: 8,
  },
  notes: 'This is a test recipe',
  nutrition_source: 'ai_generated',
  is_favorite: false,
  source_link: null,
  times_cooked: 0,
  last_cooked: null,
  created_at: '2024-01-01T12:00:00Z',
  updated_at: '2024-01-01T12:00:00Z',
};

const mockRecipes: RecipeResponse[] = [
  mockRecipe,
  {
    ...mockRecipe,
    id: 2,
    name: 'Another Recipe',
  },
];

describe('recipes-api', () => {
  beforeEach(() => {
    chainMethods();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllRecipes', () => {
    it('should return all recipes successfully', async () => {
      mockOrder.mockResolvedValue({
        data: mockRecipes,
        error: null,
      });

      const result = await getAllRecipes();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRecipes);
      expect(result.error).toBeNull();
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };
      mockOrder.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await getAllRecipes();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Database connection failed');
    });

    it('should handle unexpected errors', async () => {
      mockOrder.mockRejectedValue(new Error('Network error'));

      const result = await getAllRecipes();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Network error');
    });
  });

  describe('getRecipeByName', () => {
    it('should return recipe by exact name match', async () => {
      mockSingle.mockResolvedValue({
        data: mockRecipe,
        error: null,
      });

      const result = await getRecipeByName('Test Recipe');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRecipe);
      expect(result.error).toBeNull();
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('name', 'Test Recipe');
      expect(mockSingle).toHaveBeenCalled();
    });

    it('should handle recipe not found', async () => {
      const mockError = { code: 'PGRST116', message: 'No rows found' };
      mockSingle.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await getRecipeByName('Nonexistent Recipe');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe with name "Nonexistent Recipe" not found');
    });

    it('should validate empty recipe name', async () => {
      const result = await getRecipeByName('');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe name is required');
    });

    it('should trim whitespace from recipe name', async () => {
      mockSingle.mockResolvedValue({
        data: mockRecipe,
        error: null,
      });

      await getRecipeByName('  Test Recipe  ');

      expect(mockEq).toHaveBeenCalledWith('name', 'Test Recipe');
    });
  });

  describe('searchRecipesByName', () => {
    it('should return recipes matching search term', async () => {
      mockOrder.mockResolvedValue({
        data: mockRecipes,
        error: null,
      });

      const result = await searchRecipesByName('Test');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRecipes);
      expect(result.error).toBeNull();
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockIlike).toHaveBeenCalledWith('name', '%Test%');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should validate empty search term', async () => {
      const result = await searchRecipesByName('');

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Search term is required');
    });

    it('should trim whitespace from search term', async () => {
      mockOrder.mockResolvedValue({
        data: [],
        error: null,
      });

      await searchRecipesByName('  Test  ');

      expect(mockIlike).toHaveBeenCalledWith('name', '%Test%');
    });
  });

  describe('createRecipe', () => {
    const validCreateRequest: CreateRecipeRequest = {
      name: 'New Test Recipe',
      instructions: 'Mix and bake',
      servings: 6,
      total_time: 45,
      ingredient_list: ['flour', 'eggs', 'milk'],
      nutrition_per_serving: {
        calories: 300,
        protein: 20,
        carbs: 35,
        fat: 10,
      },
      notes: 'Delicious recipe',
      nutrition_source: 'ai_generated',
      is_favorite: true,
    };

    it('should create recipe successfully', async () => {
      // Mock the existence check (recipe doesn't exist)
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      // Mock the insert operation
      mockSingle.mockResolvedValueOnce({
        data: { ...mockRecipe, ...validCreateRequest, id: 3 },
        error: null,
      });

      const result = await createRecipe(validCreateRequest);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('New Test Recipe');
      expect(result.error).toBeNull();
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should validate required name field', async () => {
      const invalidRequest = { ...validCreateRequest, name: '' };

      const result = await createRecipe(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe name is required');
    });

    it('should validate required instructions field', async () => {
      const invalidRequest = { ...validCreateRequest, instructions: '' };

      const result = await createRecipe(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe instructions are required');
    });

    it('should prevent duplicate recipe names', async () => {
      // Mock the existence check (recipe exists)
      mockSingle.mockResolvedValue({
        data: mockRecipe,
        error: null,
      });

      const result = await createRecipe(validCreateRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe with name "New Test Recipe" already exists');
    });

    it('should handle create with minimal data', async () => {
      const minimalRequest: CreateRecipeRequest = {
        name: 'Minimal Recipe',
        instructions: 'Just cook it',
      };

      // Mock the existence check (recipe doesn't exist)
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      // Mock the insert operation
      mockSingle.mockResolvedValueOnce({
        data: { ...mockRecipe, ...minimalRequest, id: 4 },
        error: null,
      });

      const result = await createRecipe(minimalRequest);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Minimal Recipe');
      expect(result.error).toBeNull();
    });
  });

  describe('updateRecipeById', () => {
    const validUpdateRequest: UpdateRecipeRequest = {
      name: 'Updated Recipe Name',
      instructions: 'Updated instructions',
      servings: 8,
    };

    it('should update recipe by ID successfully', async () => {
      // Mock the existence check
      mockSingle.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      });

      // Mock the update operation
      mockSingle.mockResolvedValueOnce({
        data: { ...mockRecipe, ...validUpdateRequest },
        error: null,
      });

      const result = await updateRecipeById(1, validUpdateRequest);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Updated Recipe Name');
      expect(result.error).toBeNull();
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('should validate recipe ID', async () => {
      const result = await updateRecipeById(0, validUpdateRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Valid recipe ID is required');
    });

    it('should handle recipe not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      const result = await updateRecipeById(999, validUpdateRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe with ID 999 not found');
    });

    it('should handle partial updates', async () => {
      const partialUpdate: UpdateRecipeRequest = {
        servings: 12,
      };

      // Mock the existence check
      mockSingle.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      });

      // Mock the update operation
      mockSingle.mockResolvedValueOnce({
        data: { ...mockRecipe, servings: 12 },
        error: null,
      });

      const result = await updateRecipeById(1, partialUpdate);

      expect(result.success).toBe(true);
      expect(result.data?.servings).toBe(12);
      expect(result.error).toBeNull();
    });
  });

  describe('updateRecipeByName', () => {
    const validUpdateRequest: UpdateRecipeRequest = {
      servings: 10,
      notes: 'Updated via name',
    };

    it('should update recipe by name successfully', async () => {
      // Mock the name-based lookup
      mockSingle.mockResolvedValueOnce({
        data: mockRecipe,
        error: null,
      });

      // Mock the existence check for updateById
      mockSingle.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      });

      // Mock the update operation
      mockSingle.mockResolvedValueOnce({
        data: { ...mockRecipe, ...validUpdateRequest },
        error: null,
      });

      const result = await updateRecipeByName('Test Recipe', validUpdateRequest);

      expect(result.success).toBe(true);
      expect(result.data?.servings).toBe(10);
      expect(result.error).toBeNull();
    });

    it('should handle recipe not found by name', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      const result = await updateRecipeByName('Nonexistent Recipe', validUpdateRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe with name "Nonexistent Recipe" not found');
    });

    it('should validate recipe name', async () => {
      const result = await updateRecipeByName('', validUpdateRequest);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Recipe name is required');
    });
  });

  describe('deleteRecipeById', () => {
    it('should delete recipe successfully', async () => {
      mockEq.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await deleteRecipeById(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1 });
      expect(result.error).toBeNull();
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('should validate recipe ID', async () => {
      const result = await deleteRecipeById(0);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Valid recipe ID is required');
    });

    it('should handle delete errors', async () => {
      const mockError = { message: 'Foreign key constraint violation' };
      mockEq.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await deleteRecipeById(1);

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe('Foreign key constraint violation');
    });
  });
});