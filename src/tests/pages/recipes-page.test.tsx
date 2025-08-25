import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Recipes from '../../pages/Recipes';
import { renderWithProviders } from '../setup';
import * as recipesHook from '../../hooks/useRecipes';
import * as inventoryHook from '../../hooks/useFoodInventory';
import * as tagsHook from '../../hooks/useTags';

vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useFoodInventory');
vi.mock('../../hooks/useTags');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('../../components/AddRecipeDialog', () => ({ AddRecipeDialog: () => null }));
vi.mock('../../components/RecipeGeneratorDialog', () => ({ RecipeGeneratorDialog: () => null }));
vi.mock('../../components/ConfirmDialog', () => ({ ConfirmDialog: () => null }));
vi.mock('@/components/ui/multi-select', () => ({
  MultiSelect: ({ children }: any) => <div>{children}</div>,
}));

describe('Recipes Page', () => {
  beforeEach(() => {
    vi.mocked(recipesHook.useRecipes).mockReturnValue({
      recipes: [{ id: '1', name: 'Cake', servings: 1, prep_time: 0, cook_time: 0, instructions: '', ingredients: [], notes: '', is_favorite: false, tags: [], nutrition: { calories_per_serving: 0, protein_per_serving: 0, carbs_per_serving: 0, fat_per_serving: 0 } }],
      searchQuery: '',
      setSearchQuery: vi.fn(),
      performSearch: vi.fn(),
      addRecipe: vi.fn(),
      updateRecipe: vi.fn(),
      toggleFavorite: vi.fn(),
      deleteRecipe: vi.fn(),
      usingMockData: true,
      error: null,
    } as any);

    vi.mocked(inventoryHook.useFoodInventory).mockReturnValue({ allItems: [] } as any);
    vi.mocked(tagsHook.useTags).mockReturnValue({ allTags: [] } as any);
  });

  it('renders recipes list', () => {
    renderWithProviders(<Recipes />);
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Cake')).toBeInTheDocument();
  });
});
