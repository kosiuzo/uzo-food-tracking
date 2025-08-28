import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LogMealDialog } from '../../components/LogMealDialog';
import { renderWithProviders } from '../setup';

// Mock hooks
vi.mock('../../hooks/useRecipes', () => ({
  useRecipes: () => ({
    allRecipes: [
      {
        id: '1',
        name: 'Test Recipe',
        nutrition: {
          calories_per_serving: 200,
          protein_per_serving: 10,
          carbs_per_serving: 30,
          fat_per_serving: 5,
        }
      }
    ]
  })
}));

vi.mock('../../hooks/useInventorySearch', () => ({
  useInventorySearch: () => ({
    allItems: [
      {
        id: 1,
        name: 'Apple',
        serving_unit: 'piece',
        serving_unit_type: 'package',
        serving_size: 150,
        serving_quantity: 1,
        nutrition: {
          calories_per_serving: 95,
          protein_per_serving: 0.5,
          carbs_per_serving: 25,
          fat_per_serving: 0.3,
        }
      }
    ]
  })
}));

const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

// Mock serving unit utilities
vi.mock('../../lib/servingUnitUtils', () => ({
  calculateRecipeNutrition: vi.fn((ingredients, servings, allItems) => {
    const ingredient = ingredients[0];
    const item = allItems.find(i => i.id.toString() === ingredient.item_id);
    
    if (!item) {
      return { calories_per_serving: 0, protein_per_serving: 0, carbs_per_serving: 0, fat_per_serving: 0 };
    }
    
    return {
      calories_per_serving: item.nutrition.calories_per_serving * ingredient.quantity,
      protein_per_serving: item.nutrition.protein_per_serving * ingredient.quantity,
      carbs_per_serving: item.nutrition.carbs_per_serving * ingredient.quantity,
      fat_per_serving: item.nutrition.fat_per_serving * ingredient.quantity,
    };
  })
}));

// Mock MultiSelect component
vi.mock('../../components/ui/multi-select', () => ({
  MultiSelect: ({ onValueChange }: {
    onValueChange: (values: string[]) => void;
  }) => (
    <div data-testid="multi-select">
      <button
        data-testid="select-button"
        onClick={() => onValueChange(['1'])}
      >
        Select Items
      </button>
    </div>
  ),
}));

describe('LogMealDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
  });

  it('renders dialog with proper title and tabs', () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Log a Meal')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Individual Items')).toBeInTheDocument();
  });

  it('has required form fields', () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/meal name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('validates required fields and shows error', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to save without filling required fields
    const saveButton = screen.getByText(/log meal/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      });
    });
  });

  it('shows validation error when no items are selected', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Fill meal name but don't select any items
    const mealNameInput = screen.getByLabelText(/meal name/i);
    fireEvent.change(mealNameInput, { target: { value: 'Test Meal' } });

    const saveButton = screen.getByText(/log meal/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Please select at least one recipe or food item",
        variant: "destructive",
      });
    });
  });

  it('renders editing mode with correct title', () => {
    const editingMealLog = {
      id: 1,
      recipe_ids: [1],
      item_entries: [],
      date: '2025-08-28',
      meal_name: 'Test Meal',
      notes: 'Test notes',
      nutrition: { calories: 200, protein: 10, carbs: 30, fat: 5 }
    };

    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        editingMealLog={editingMealLog}
      />
    );

    expect(screen.getByText('Edit Meal Log')).toBeInTheDocument();
    expect(screen.getByText('Update Meal')).toBeInTheDocument();
  });
});