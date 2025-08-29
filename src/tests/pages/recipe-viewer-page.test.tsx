import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import RecipeViewer from '../../pages/RecipeViewer';
import { renderWithProviders } from '../setup';
import * as recipesHook from '../../hooks/useRecipes';
import * as inventoryHook from '../../hooks/useInventorySearch';

vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useInventorySearch');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

const mockRecipe = {
  id: 1,
  name: 'Pancakes',
  servings: 2,
  total_time_minutes: 10,
  instructions: 'Mix\nCook',
  ingredients: [
    { item_id: 1, quantity: 1, unit: 'cup' },
    { item_id: 2, quantity: 2, unit: 'pcs' },
  ],
  nutrition: {
    calories_per_serving: 0,
    protein_per_serving: 0,
    carbs_per_serving: 0,
    fat_per_serving: 0,
  },
  is_favorite: false,
  tags: [],
  notes: '',
  created_at: '',
  updated_at: '',
};

describe('RecipeViewer Page', () => {
  beforeEach(() => {
    vi.mocked(recipesHook.useRecipes).mockReturnValue({
      getRecipeById: () => mockRecipe,
    } as unknown as ReturnType<typeof recipesHook.useRecipes>);
    vi.mocked(inventoryHook.useInventorySearch).mockReturnValue({
      allItems: [
        { id: 1, name: 'Flour' },
        { id: 2, name: 'Eggs' },
      ],
    } as unknown as ReturnType<typeof inventoryHook.useInventorySearch>);
  });

  it('displays recipe details', () => {
    renderWithProviders(<RecipeViewer />);
    expect(screen.getByText('Pancakes')).toBeInTheDocument();
    expect(screen.getByText('Mix')).toBeInTheDocument();
  });
});

