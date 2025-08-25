import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Index from '../../pages/Index';
import { renderWithProviders } from '../setup';
import * as inventoryHook from '../../hooks/useFoodInventory';

vi.mock('../../hooks/useFoodInventory');
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('../../components/FoodItemCard', () => ({
  FoodItemCard: ({ item }: { item: { name: string } }) => <div>{item.name}</div>,
}));

describe('Index Page', () => {
  beforeEach(() => {
    vi.mocked(inventoryHook.useFoodInventory).mockReturnValue({
      items: [{ id: '1', name: 'Apple', category: 'Fruit', in_stock: true, rating: 0 }],
      searchQuery: '',
      setSearchQuery: vi.fn(),
      performSearch: vi.fn(),
      categoryFilter: 'all',
      setCategoryFilter: vi.fn(),
      stockFilter: 'all',
      setStockFilter: vi.fn(),
      ratingFilter: 'all',
      setRatingFilter: vi.fn(),
      categories: ['Fruit'],
      addItem: vi.fn(),
      updateItem: vi.fn(),
      deleteItem: vi.fn(),
      toggleStock: vi.fn(),
      usingMockData: true,
      error: null,
    } as ReturnType<typeof inventoryHook.useFoodInventory>);
  });

  it('renders inventory item', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });
});
