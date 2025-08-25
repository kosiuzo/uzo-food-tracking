import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import MealPrepGenerator from '../../pages/MealPrepGenerator';
import { renderWithProviders } from '../setup';
import * as inventoryHook from '../../hooks/useFoodInventory';
import * as recipesHook from '../../hooks/useRecipes';
import * as tagsHook from '../../hooks/useTags';

vi.mock('../../hooks/useFoodInventory');
vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useTags');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('@/components/ui/multi-select', () => ({
  MultiSelect: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@/components/ui/grouped-multi-select', () => ({
  GroupedMultiSelect: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('MealPrepGenerator Page', () => {
  it('renders heading', () => {
    vi.mocked(inventoryHook.useFoodInventory).mockReturnValue({ allItems: [] } as any);
    vi.mocked(recipesHook.useRecipes).mockReturnValue({ addRecipe: vi.fn() } as any);
    vi.mocked(tagsHook.useTags).mockReturnValue({ allTags: [] } as any);

    renderWithProviders(<MealPrepGenerator />);
    expect(screen.getByText('Meal Prep Generator')).toBeInTheDocument();
  });
});
