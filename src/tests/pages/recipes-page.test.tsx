import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Recipes from '../../pages/Recipes';
import { renderWithProviders } from '../setup';
import * as recipesHook from '../../hooks/useRecipes';
import * as inventoryHook from '../../hooks/useInventorySearch';
import * as tagsHook from '../../hooks/useTags';

vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useInventorySearch');
vi.mock('../../hooks/useTags');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('../../components/AddRecipeDialog', () => ({ AddRecipeDialog: () => null }));
vi.mock('../../components/RecipeGeneratorDialog', () => ({ RecipeGeneratorDialog: () => null }));
vi.mock('../../components/ConfirmDialog', () => ({ ConfirmDialog: () => null }));
vi.mock('@/components/ui/multi-select', () => ({
  MultiSelect: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

describe('Recipes Page', () => {
  beforeEach(() => {
    vi.mocked(recipesHook.useRecipes).mockReturnValue({
      recipes: [{ id: '1', name: 'Cake', servings: 1, total_time_minutes: 30, instructions: '', ingredients: [], notes: '', is_favorite: false, tags: [], nutrition: { calories_per_serving: 0, protein_per_serving: 0, carbs_per_serving: 0, fat_per_serving: 0 } }],
      searchQuery: '',
      setSearchQuery: vi.fn(),
      performSearch: vi.fn(),
      addRecipe: vi.fn(),
      updateRecipe: vi.fn(),
      toggleFavorite: vi.fn(),
      deleteRecipe: vi.fn(),
      usingMockData: true,
      error: null,
    } as ReturnType<typeof recipesHook.useRecipes>);

    vi.mocked(inventoryHook.useInventorySearch).mockReturnValue({ allItems: [] } as ReturnType<typeof inventoryHook.useInventorySearch>);
    vi.mocked(tagsHook.useTags).mockReturnValue({ allTags: [] } as ReturnType<typeof tagsHook.useTags>);
  });

  it('renders recipes list', () => {
    renderWithProviders(<Recipes />);
    expect(screen.getByText('Total Recipes')).toBeInTheDocument();
    expect(screen.getByText('Cake')).toBeInTheDocument();
  });
});
