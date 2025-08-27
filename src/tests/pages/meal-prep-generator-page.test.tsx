import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import MealPrepGenerator from '../../pages/MealPrepGenerator';
import { renderWithProviders } from '../setup';
import * as inventoryHook from '../../hooks/useInventorySearch';
import * as recipesHook from '../../hooks/useRecipes';
import * as tagsHook from '../../hooks/useTags';

vi.mock('../../hooks/useInventorySearch');
vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useTags');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('@/components/ui/multi-select', () => ({
  MultiSelect: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/ui/grouped-multi-select', () => ({
  GroupedMultiSelect: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
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
    vi.mocked(inventoryHook.useInventorySearch).mockReturnValue({ allItems: [] } as ReturnType<typeof inventoryHook.useInventorySearch>);
    vi.mocked(recipesHook.useRecipes).mockReturnValue({ addRecipe: vi.fn() } as ReturnType<typeof recipesHook.useRecipes>);
    vi.mocked(tagsHook.useTags).mockReturnValue({ allTags: [] } as ReturnType<typeof tagsHook.useTags>);

    renderWithProviders(<MealPrepGenerator />);
    expect(screen.getByText('Meal Prep Generator')).toBeInTheDocument();
  });
});
