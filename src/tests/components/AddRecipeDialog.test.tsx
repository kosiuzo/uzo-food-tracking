import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddRecipeDialog } from '../../components/AddRecipeDialog';
import { renderWithProviders } from '../setup';

// Mock hooks
vi.mock('../../hooks/useInventorySearch', () => ({
  useInventorySearch: () => ({
    allItems: [
      {
        id: 1,
        name: 'Flour',
        serving_unit: 'cup',
        serving_unit_type: 'volume',
        serving_size: 120,
        serving_quantity: 1,
        nutrition: {
          calories_per_serving: 455,
          protein_per_serving: 13,
          carbs_per_serving: 95,
          fat_per_serving: 1.2,
        }
      },
      {
        id: 2,
        name: 'Sugar',
        serving_unit: 'cup',
        serving_unit_type: 'volume',
        serving_size: 200,
        serving_quantity: 1,
        nutrition: {
          calories_per_serving: 774,
          protein_per_serving: 0,
          carbs_per_serving: 200,
          fat_per_serving: 0,
        }
      }
    ]
  })
}));

vi.mock('../../hooks/useTags', () => ({
  useTags: () => ({
    allTags: [
      { id: 1, name: 'Dessert', color: '#FF6B6B' },
      { id: 2, name: 'Quick', color: '#4ECDC4' }
    ]
  }),
  useRecipeTagManagement: () => ({
    getSelectedTags: vi.fn().mockReturnValue([]),
    handleTagChange: vi.fn(),
  })
}));

const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

// Mock serving unit utilities
vi.mock('../../lib/servingUnitUtils', () => ({
  calculateRecipeNutrition: vi.fn((ingredients, servings, allItems) => ({
    calories_per_serving: 300,
    protein_per_serving: 8,
    carbs_per_serving: 60,
    fat_per_serving: 2,
  })),
  UNIT_TO_TYPE: {
    'cup': 'volume',
    'tbsp': 'volume',
    'tsp': 'volume',
    'g': 'weight',
    'kg': 'weight',
    'piece': 'package'
  }
}));

// Mock MultiSelect component
vi.mock('../../components/ui/multi-select', () => ({
  MultiSelect: ({ value, onValueChange, options, placeholder }: {
    value: string[];
    onValueChange: (values: string[]) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
  }) => (
    <div data-testid="multi-select">
      <div data-testid="multi-select-placeholder">{placeholder}</div>
      <button
        data-testid="multi-select-button"
        onClick={() => onValueChange(['1'])}
      >
        Select Items
      </button>
      <div data-testid="multi-select-values">
        {value.join(', ')}
      </div>
    </div>
  ),
}));

describe('AddRecipeDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
  });

  it('renders dialog with proper title and form fields', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Add New Recipe')).toBeInTheDocument();
    expect(screen.getByLabelText(/recipe name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/instructions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prep.*time/i)).toBeInTheDocument();
  });

  it('has all required form fields', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByRole('textbox', { name: /recipe name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /instructions/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /servings/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /prep.*time/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /notes/i })).toBeInTheDocument();
  });

  it('validates required fields and shows error', async () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to save without filling required fields
    const saveButton = screen.getByText(/add recipe/i);
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

  it('allows user to fill in basic recipe information', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Fill in basic recipe information
    await user.type(screen.getByLabelText(/recipe name/i), 'Test Recipe');
    await user.type(screen.getByLabelText(/instructions/i), 'Mix ingredients and bake');
    await user.clear(screen.getByLabelText(/servings/i));
    await user.type(screen.getByLabelText(/servings/i), '4');
    await user.type(screen.getByLabelText(/prep.*time/i), '30');

    expect(screen.getByDisplayValue('Test Recipe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mix ingredients and bake')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('shows ingredients section', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/ingredients/i)).toBeInTheDocument();
    expect(screen.getByTestId('multi-select')).toBeInTheDocument();
  });

  it('allows adding ingredients', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Click to select ingredients
    const selectButton = screen.getByTestId('multi-select-button');
    await user.click(selectButton);

    // Verify ingredient selection is working
    expect(screen.getByTestId('multi-select-values')).toHaveTextContent('1');
  });

  it('shows nutrition calculation section', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/nutrition per serving/i)).toBeInTheDocument();
  });

  it('shows tags section', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText(/tags/i)).toBeInTheDocument();
  });

  it('submits recipe with valid data', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Fill in required fields
    await user.type(screen.getByLabelText(/recipe name/i), 'Test Recipe');
    await user.type(screen.getByLabelText(/instructions/i), 'Mix and bake');
    await user.clear(screen.getByLabelText(/servings/i));
    await user.type(screen.getByLabelText(/servings/i), '4');

    // Submit form
    const saveButton = screen.getByText(/add recipe/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Recipe',
          instructions: 'Mix and bake',
          servings: 4,
        })
      );
    });
  });

  it('renders editing mode with correct title', () => {
    const editingRecipe = {
      id: 1,
      name: 'Existing Recipe',
      instructions: 'Existing instructions',
      servings: 2,
      total_time_minutes: 20,
      ingredients: [],
      tags: [],
      nutrition: { calories_per_serving: 200, protein_per_serving: 10, carbs_per_serving: 30, fat_per_serving: 5 },
      is_favorite: false,
      notes: '',
      cost_per_serving: 0,
      total_cost: 0
    };

    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        editingRecipe={editingRecipe}
      />
    );

    expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
    expect(screen.getByText('Update Recipe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Recipe')).toBeInTheDocument();
  });

  it('handles cancel action', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('validates servings input', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to enter invalid servings
    const servingsInput = screen.getByLabelText(/servings/i);
    await user.clear(servingsInput);
    await user.type(servingsInput, '0');

    // Fill other required fields
    await user.type(screen.getByLabelText(/recipe name/i), 'Test Recipe');
    await user.type(screen.getByLabelText(/instructions/i), 'Instructions');

    const saveButton = screen.getByText(/add recipe/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Servings must be greater than 0",
        variant: "destructive",
      });
    });
  });

  it('validates prep time input', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to enter negative prep time
    const prepTimeInput = screen.getByLabelText(/prep.*time/i);
    await user.type(prepTimeInput, '-5');

    // Fill other required fields
    await user.type(screen.getByLabelText(/recipe name/i), 'Test Recipe');
    await user.type(screen.getByLabelText(/instructions/i), 'Instructions');

    const saveButton = screen.getByText(/add recipe/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Prep time must be 0 or greater",
        variant: "destructive",
      });
    });
  });

  it('shows ingredient quantity inputs when ingredients are selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Select ingredients
    const selectButton = screen.getByTestId('multi-select-button');
    await user.click(selectButton);

    // Should show ingredient configuration section
    await waitFor(() => {
      expect(screen.getByText(/ingredient details/i)).toBeInTheDocument();
    });
  });

  it('handles dialog close properly', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Dialog should not be visible when open is false
    expect(screen.queryByText('Add New Recipe')).not.toBeInTheDocument();
  });
});