import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddEditItemDialog } from '../../components/AddEditItemDialog';
import { renderWithProviders } from '../setup';

const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

describe('AddEditItemDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
  });

  it('renders dialog with proper title and form fields', () => {
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Add Food Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('has all required form fields', () => {
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /brand/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  it('shows nutrition section', () => {
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/nutrition information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/protein/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/carbs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fat/i)).toBeInTheDocument();
  });

  it('shows serving information section', () => {
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/serving information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/serving size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/serving unit/i)).toBeInTheDocument();
  });

  it('validates required fields and shows error', async () => {
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to save without filling required fields
    const saveButton = screen.getByText(/add item/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Missing required fields",
        variant: "destructive",
      });
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('allows user to fill in basic item information', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Fill in basic item information
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/brand/i), 'Test Brand');

    expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Brand')).toBeInTheDocument();
  });

  it('allows setting category', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Click category dropdown
    const categoryTrigger = screen.getByRole('combobox', { name: /category/i });
    await user.click(categoryTrigger);

    // Should show category options
    await waitFor(() => {
      expect(screen.getByText('Fruits')).toBeInTheDocument();
    });
  });

  it('allows setting nutrition values', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Fill nutrition values
    await user.type(screen.getByLabelText(/calories/i), '100');
    await user.type(screen.getByLabelText(/protein/i), '5');
    await user.type(screen.getByLabelText(/carbs/i), '20');
    await user.type(screen.getByLabelText(/fat/i), '2');

    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('allows setting serving information', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Set serving size
    const servingSizeInput = screen.getByLabelText(/serving size/i);
    await user.clear(servingSizeInput);
    await user.type(servingSizeInput, '150');

    expect(screen.getByDisplayValue('150')).toBeInTheDocument();
  });

  it('allows setting price information', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Set price
    await user.type(screen.getByLabelText(/price/i), '5.99');

    expect(screen.getByDisplayValue('5.99')).toBeInTheDocument();
  });

  it('submits item with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Fill in required fields
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/brand/i), 'Test Brand');
    
    // Select category
    const categoryTrigger = screen.getByRole('combobox', { name: /category/i });
    await user.click(categoryTrigger);
    await user.click(screen.getByText('Fruits'));

    // Fill nutrition
    await user.type(screen.getByLabelText(/calories/i), '100');
    await user.type(screen.getByLabelText(/protein/i), '2');
    await user.type(screen.getByLabelText(/carbs/i), '25');
    await user.type(screen.getByLabelText(/fat/i), '0.3');

    // Submit form
    const saveButton = screen.getByText(/add item/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Item',
          brand: 'Test Brand',
          category: 'Fruits',
        })
      );
    });
  });

  it('renders editing mode with correct title', () => {
    const editingItem = {
      id: 1,
      name: 'Existing Item',
      brand: 'Existing Brand',
      category: 'Fruits',
      price: 3.99,
      nutrition: {
        calories_per_serving: 95,
        protein_per_serving: 0.5,
        carbs_per_serving: 25,
        fat_per_serving: 0.3,
      },
      serving_size: 150,
      serving_unit: 'g',
      serving_unit_type: 'weight' as const,
      serving_quantity: 1,
      servings_per_container: 1,
      price_per_serving: 3.99,
      in_stock: true,
      rating: 0,
      image_url: null,
      notes: null,
    };

    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        editingItem={editingItem}
      />
    );

    expect(screen.getByText('Edit Food Item')).toBeInTheDocument();
    expect(screen.getByText('Update Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Item')).toBeInTheDocument();
  });

  it('handles cancel action', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('validates numeric inputs', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to enter negative price
    await user.type(screen.getByLabelText(/price/i), '-5');

    // Fill other required fields
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/brand/i), 'Test Brand');

    const saveButton = screen.getByText(/add item/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
    });
  });

  it('shows stock status toggle', () => {
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
  });

  it('allows toggling stock status', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const stockToggle = screen.getByRole('switch');
    await user.click(stockToggle);

    // Should toggle the stock status
    expect(stockToggle).toBeChecked();
  });

  it('handles dialog close properly', () => {
    renderWithProviders(
      <AddEditItemDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Dialog should not be visible when open is false
    expect(screen.queryByText('Add Food Item')).not.toBeInTheDocument();
  });

  it('validates serving size input', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddEditItemDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to enter zero serving size
    const servingSizeInput = screen.getByLabelText(/serving size/i);
    await user.clear(servingSizeInput);
    await user.type(servingSizeInput, '0');

    // Fill other required fields
    await user.type(screen.getByLabelText(/name/i), 'Test Item');
    await user.type(screen.getByLabelText(/brand/i), 'Test Brand');

    const saveButton = screen.getByText(/add item/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Serving size must be greater than 0",
        variant: "destructive",
      });
    });
  });
});