import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InventoryPage } from '../../components/InventoryPage';
import { renderWithProviders } from '../setup';

// Mock the inventory search hook
const mockInventoryHook = {
  items: [
    {
      id: 1,
      name: 'Apple',
      brand: 'Organic Co',
      category: 'Fruits',
      in_stock: true,
      rating: 5,
      price: 2.99,
    },
    {
      id: 2,
      name: 'Bread',
      brand: 'Bakery Inc',
      category: 'Grains',
      in_stock: false,
      rating: 0,
      price: 3.50,
    },
  ],
  allItems: [],
  loading: false,
  error: null,
  usingMockData: false,
  searchQuery: '',
  setSearchQuery: vi.fn(),
  categoryFilter: 'all',
  setCategoryFilter: vi.fn(),
  stockFilter: 'all',
  setStockFilter: vi.fn(),
  ratingFilter: 'all',
  setRatingFilter: vi.fn(),
  categories: ['Fruits', 'Grains', 'Vegetables'],
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
  toggleStock: vi.fn(),
  refetch: vi.fn(),
  outOfStockItems: [],
};

vi.mock('../../hooks/useInventorySearch', () => ({
  useInventorySearch: () => mockInventoryHook
}));

// Mock the dialog component to focus on workflow testing
vi.mock('../../components/AddEditItemDialog', () => ({
  AddEditItemDialog: vi.fn(({ open, onOpenChange, onSave, item }) => {
    if (!open) return null;
    
    return (
      <div data-testid="add-edit-dialog">
        <h2>{item ? 'Edit Food Item' : 'Add Food Item'}</h2>
        <button onClick={() => onOpenChange(false)}>Cancel</button>
        <button 
          onClick={() => onSave({
            name: 'New Item',
            brand: 'New Brand',
            category: 'Fruits',
            price: 1.99,
          })}
        >
          Save
        </button>
      </div>
    );
  })
}));

// Mock FoodItemCard to focus on workflow
vi.mock('../../components/FoodItemCard', () => ({
  FoodItemCard: vi.fn(({ item, onToggleStock, onEdit, onDelete, onRatingChange }) => (
    <div data-testid={`food-item-${item.id}`}>
      <h3>{item.name}</h3>
      <p>{item.brand}</p>
      <span data-testid={`stock-status-${item.id}`}>
        {item.in_stock ? 'In Stock' : 'Out of Stock'}
      </span>
      <button 
        data-testid={`toggle-stock-${item.id}`}
        onClick={onToggleStock}
      >
        Toggle Stock
      </button>
      <button 
        data-testid={`edit-item-${item.id}`}
        onClick={onEdit}
      >
        Edit
      </button>
      <button 
        data-testid={`delete-item-${item.id}`}
        onClick={onDelete}
      >
        Delete
      </button>
      <button 
        data-testid={`rate-item-${item.id}`}
        onClick={() => onRatingChange(4)}
      >
        Rate 4 Stars
      </button>
    </div>
  ))
}));

describe('Inventory Workflow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Inventory Display', () => {
    it('displays inventory statistics correctly', () => {
      renderWithProviders(<InventoryPage />);

      // Check stats display
      expect(screen.getByText('1')).toBeInTheDocument(); // In Stock count
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Out of Stock count
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('displays all inventory items', () => {
      renderWithProviders(<InventoryPage />);

      expect(screen.getByTestId('food-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('food-item-2')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Bread')).toBeInTheDocument();
    });

    it('shows correct stock status for each item', () => {
      renderWithProviders(<InventoryPage />);

      expect(screen.getByTestId('stock-status-1')).toHaveTextContent('In Stock');
      expect(screen.getByTestId('stock-status-2')).toHaveTextContent('Out of Stock');
    });
  });

  describe('Search Functionality', () => {
    it('displays search input with correct placeholder', () => {
      renderWithProviders(<InventoryPage />);

      const searchInput = screen.getByPlaceholderText('Search items by name, brand, category, or ingredients...');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls setSearchQuery when user types in search', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const searchInput = screen.getByPlaceholderText('Search items by name, brand, category, or ingredients...');
      await user.type(searchInput, 'apple');

      expect(mockInventoryHook.setSearchQuery).toHaveBeenCalledWith('apple');
    });

    it('shows full-text search badge when search query exists and not using mock data', () => {
      mockInventoryHook.searchQuery = 'test query';
      mockInventoryHook.usingMockData = false;
      
      renderWithProviders(<InventoryPage />);

      expect(screen.getByText('Full-text search')).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('displays all filter dropdowns', () => {
      renderWithProviders(<InventoryPage />);

      expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Items')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Ratings')).toBeInTheDocument();
    });

    it('calls setCategoryFilter when category is changed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      // This is a simplified test - in real UI testing we'd need to open dropdown and select
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'Fruits' } });

      expect(mockInventoryHook.setCategoryFilter).toHaveBeenCalledWith('Fruits');
    });

    it('calls setStockFilter when stock filter is changed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const stockSelect = screen.getByDisplayValue('All Items');
      fireEvent.change(stockSelect, { target: { value: 'in-stock' } });

      expect(mockInventoryHook.setStockFilter).toHaveBeenCalledWith('in-stock');
    });

    it('calls setRatingFilter when rating filter is changed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const ratingSelect = screen.getByDisplayValue('All Ratings');
      fireEvent.change(ratingSelect, { target: { value: '5' } });

      expect(mockInventoryHook.setRatingFilter).toHaveBeenCalledWith('5');
    });
  });

  describe('Add Item Workflow', () => {
    it('opens add dialog when floating add button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const addButton = screen.getByTestId('add-item-button');
      await user.click(addButton);

      expect(screen.getByTestId('add-edit-dialog')).toBeInTheDocument();
      expect(screen.getByText('Add Food Item')).toBeInTheDocument();
    });

    it('closes add dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      // Open dialog
      const addButton = screen.getByTestId('add-item-button');
      await user.click(addButton);

      // Cancel
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByTestId('add-edit-dialog')).not.toBeInTheDocument();
    });

    it('calls addItem and closes dialog when item is saved', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      // Open dialog
      const addButton = screen.getByTestId('add-item-button');
      await user.click(addButton);

      // Save item
      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockInventoryHook.addItem).toHaveBeenCalledWith({
          name: 'New Item',
          brand: 'New Brand',
          category: 'Fruits',
          price: 1.99,
        });
      });

      expect(screen.queryByTestId('add-edit-dialog')).not.toBeInTheDocument();
    });
  });

  describe('Edit Item Workflow', () => {
    it('opens edit dialog when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const editButton = screen.getByTestId('edit-item-1');
      await user.click(editButton);

      expect(screen.getByTestId('add-edit-dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Food Item')).toBeInTheDocument();
    });

    it('calls updateItem when edited item is saved', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      // Open edit dialog
      const editButton = screen.getByTestId('edit-item-1');
      await user.click(editButton);

      // Save changes
      const saveButton = screen.getByText('Save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockInventoryHook.updateItem).toHaveBeenCalledWith(1, {
          name: 'New Item',
          brand: 'New Brand',
          category: 'Fruits',
          price: 1.99,
        });
      });
    });
  });

  describe('Item Actions Workflow', () => {
    it('calls toggleStock when toggle stock button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const toggleButton = screen.getByTestId('toggle-stock-1');
      await user.click(toggleButton);

      expect(mockInventoryHook.toggleStock).toHaveBeenCalledWith(1);
    });

    it('calls deleteItem when delete button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const deleteButton = screen.getByTestId('delete-item-1');
      await user.click(deleteButton);

      expect(mockInventoryHook.deleteItem).toHaveBeenCalledWith(1);
    });

    it('calls updateItem when rating is changed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<InventoryPage />);

      const rateButton = screen.getByTestId('rate-item-1');
      await user.click(rateButton);

      expect(mockInventoryHook.updateItem).toHaveBeenCalledWith(1, { rating: 4 });
    });
  });

  describe('Loading and Error States', () => {
    it('displays loading state correctly', () => {
      mockInventoryHook.loading = true;
      mockInventoryHook.items = [];
      
      renderWithProviders(<InventoryPage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays empty state when no items found', () => {
      mockInventoryHook.loading = false;
      mockInventoryHook.items = [];
      
      renderWithProviders(<InventoryPage />);

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('displays error state correctly', () => {
      mockInventoryHook.error = 'Failed to load items';
      mockInventoryHook.usingMockData = false;
      
      renderWithProviders(<InventoryPage />);

      expect(screen.getByText('Failed to load items')).toBeInTheDocument();
    });

    it('displays mock data indicator when using mock data', () => {
      mockInventoryHook.usingMockData = true;
      
      renderWithProviders(<InventoryPage />);

      expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      expect(screen.getByText(/Showing sample data/)).toBeInTheDocument();
    });
  });
});