import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../setup';
import { InventoryPage } from '../../components/InventoryPage';
import * as inventoryHook from '../../hooks/useInventorySearch';

vi.mock('../../hooks/useInventorySearch');
vi.mock('../../components/FoodItemCard', () => ({
  FoodItemCard: ({ item, onToggleStock, onEdit, onDelete }: {
    item: { name: string };
    onToggleStock: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }) => (
    <div>
      <span>{item.name}</span>
      <button onClick={onToggleStock}>toggle</button>
      <button onClick={onEdit}>edit</button>
      <button onClick={onDelete}>delete</button>
    </div>
  ),
}));
vi.mock('../../components/AddEditItemDialog', () => ({
  AddEditItemDialog: ({ onSave }: {
    onSave: (item: Record<string, unknown>) => void;
  }) => (
    <button
      onClick={() =>
        onSave({ id: '2', name: 'Banana', category: 'Fruit', in_stock: true, rating: 0 })
      }
    >
      save item
    </button>
  ),
}));


describe('Inventory Page', () => {
  let addItem: ReturnType<typeof vi.fn>;
  let updateItem: ReturnType<typeof vi.fn>;
  let deleteItem: ReturnType<typeof vi.fn>;
  let toggleStock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addItem = vi.fn();
    updateItem = vi.fn();
    deleteItem = vi.fn();
    toggleStock = vi.fn();

    vi.mocked(inventoryHook.useInventorySearch).mockReturnValue({
      items: [{ id: '1', name: 'Apple', category: 'Fruit', in_stock: true, rating: 0 }],
      searchQuery: '',
      setSearchQuery: vi.fn(),
      categoryFilter: 'all',
      setCategoryFilter: vi.fn(),
      stockFilter: 'all',
      setStockFilter: vi.fn(),
      ratingFilter: 'all',
      setRatingFilter: vi.fn(),
      categories: ['Fruit'],
      addItem,
      updateItem,
      deleteItem,
      toggleStock,
      usingMockData: false,
      error: null,
    } as ReturnType<typeof inventoryHook.useInventorySearch>);
  });

  it('creates an item', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await user.click(screen.getByText('save item'));
    expect(addItem).toHaveBeenCalledWith({
      id: '2',
      name: 'Banana',
      category: 'Fruit',
      in_stock: true,
      rating: 0,
    });
  });

  it('updates an item', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await user.click(screen.getByText('edit'));
    await user.click(screen.getByText('save item'));
    expect(updateItem).toHaveBeenCalledWith('1', {
      id: '2',
      name: 'Banana',
      category: 'Fruit',
      in_stock: true,
      rating: 0,
    });
  });

  it('deletes an item', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await user.click(screen.getByText('delete'));
    expect(deleteItem).toHaveBeenCalledWith('1');
  });

  it('toggles stock status', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await user.click(screen.getByText('toggle'));
    expect(toggleStock).toHaveBeenCalledWith('1');
  });
});

