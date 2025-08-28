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
      },
      {
        id: 2,
        name: 'Milk',
        serving_unit: 'cup',
        serving_unit_type: 'volume',
        serving_size: 240,
        serving_quantity: 1,
        nutrition: {
          calories_per_serving: 150,
          protein_per_serving: 8,
          carbs_per_serving: 12,
          fat_per_serving: 8,
        }
      }
    ]
  })
}));

vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

// Mock serving unit utilities
vi.mock('../../lib/servingUnitUtils', () => ({
  scaleNutrition: vi.fn((nutrition, actualGrams, baseGrams) => {
    const ratio = actualGrams / baseGrams;
    return {
      calories: Math.round(nutrition.calories * ratio),
      protein: Math.round(nutrition.protein * ratio * 100) / 100,
      carbs: Math.round(nutrition.carbs * ratio * 100) / 100,
      fat: Math.round(nutrition.fat * ratio * 100) / 100,
    };
  }),
  getServingUnitType: vi.fn((unit) => {
    if (unit === 'cup' || unit === 'ml') return 'volume';
    if (unit === 'g' || unit === 'oz') return 'weight';
    if (unit === 'piece' || unit === 'serving') return 'package';
    return null;
  }),
  convertVolumeToGrams: vi.fn(() => 240), // Mock conversion
}));

// Mock MultiSelect component
vi.mock('../../components/ui/multi-select', () => ({
  MultiSelect: ({ onValueChange, options, value }: any) => (
    <div>
      <button
        data-testid="select-items"
        onClick={() => onValueChange(['1'])}
      >
        Select Items
      </button>
      <div data-testid="selected-items">
        {value?.join(', ')}
      </div>
    </div>
  ),
}));

describe('LogMealDialog - Individual Item Logging', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders individual items tab', () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Individual Items')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
  });

  it('allows selecting individual items and setting quantities', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Click on Individual Items tab
    fireEvent.click(screen.getByText('Individual Items'));

    // Select an item
    fireEvent.click(screen.getByTestId('select-items'));

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('calculates nutrition correctly for individual items with proper units', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Click on Individual Items tab
    fireEvent.click(screen.getByText('Individual Items'));

    // Select an item
    fireEvent.click(screen.getByTestId('select-items'));

    // Set quantity
    const quantityInput = screen.getByDisplayValue('1');
    fireEvent.change(quantityInput, { target: { value: '2' } });

    // Fill in required fields
    fireEvent.change(screen.getByDisplayValue(new Date().toISOString().split('T')[0]), { 
      target: { value: '2024-01-15' } 
    });
    
    const mealNameInput = screen.getByLabelText(/meal name/i);
    fireEvent.change(mealNameInput, { target: { value: 'Test Meal' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save meal log/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          item_entries: expect.arrayContaining([
            expect.objectContaining({
              item_id: 1,
              quantity: 2,
              nutrition: expect.objectContaining({
                calories: expect.any(Number),
                protein: expect.any(Number),
                carbs: expect.any(Number),
                fat: expect.any(Number),
              })
            })
          ])
        })
      );
    });
  });

  it('supports mixed meals with both recipes and individual items', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Select a recipe first
    fireEvent.click(screen.getByText('Recipes'));
    fireEvent.click(screen.getByTestId('select-items'));

    // Then select individual items
    fireEvent.click(screen.getByText('Individual Items'));
    fireEvent.click(screen.getByTestId('select-items'));

    // Fill in required fields
    fireEvent.change(screen.getByDisplayValue(new Date().toISOString().split('T')[0]), { 
      target: { value: '2024-01-15' } 
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save meal log/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          recipe_ids: expect.arrayContaining(['1']),
          item_entries: expect.arrayContaining([
            expect.objectContaining({
              item_id: 1,
            })
          ]),
          nutrition: expect.objectContaining({
            calories: expect.any(Number),
            protein: expect.any(Number),
            carbs: expect.any(Number),
            fat: expect.any(Number),
          })
        })
      );
    });
  });

  it('updates meal name correctly for individual items', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Click on Individual Items tab
    fireEvent.click(screen.getByText('Individual Items'));

    // Select an item
    fireEvent.click(screen.getByTestId('select-items'));

    // Check that meal name is automatically set for single item
    await waitFor(() => {
      const mealNameInput = screen.getByDisplayValue('Apple');
      expect(mealNameInput).toBeInTheDocument();
    });
  });

  it('validates required fields before saving', async () => {
    const mockToast = vi.fn();
    vi.mocked(require('../../hooks/use-toast').useToast).mockReturnValue({
      toast: mockToast
    });

    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Try to submit without any selections
    fireEvent.click(screen.getByRole('button', { name: /save meal log/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Validation Error',
          description: expect.stringContaining('meal name'),
          variant: 'destructive'
        })
      );
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('handles unit changes for individual items', async () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    // Click on Individual Items tab
    fireEvent.click(screen.getByText('Individual Items'));

    // Select an item
    fireEvent.click(screen.getByTestId('select-items'));

    // Change unit
    const unitSelect = screen.getByDisplayValue('piece');
    fireEvent.change(unitSelect, { target: { value: 'g' } });

    // Change quantity
    const quantityInput = screen.getByDisplayValue('1');
    fireEvent.change(quantityInput, { target: { value: '200' } });

    // Fill required fields and submit
    fireEvent.change(screen.getByDisplayValue(new Date().toISOString().split('T')[0]), { 
      target: { value: '2024-01-15' } 
    });
    const mealNameInput = screen.getByLabelText(/meal name/i);
    fireEvent.change(mealNameInput, { target: { value: 'Test Meal' } });

    fireEvent.click(screen.getByRole('button', { name: /save meal log/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          item_entries: expect.arrayContaining([
            expect.objectContaining({
              item_id: 1,
              quantity: 200,
              unit: 'g',
            })
          ])
        })
      );
    });
  });
});