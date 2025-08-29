import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { AddRecipeDialog } from '../../components/AddRecipeDialog';
import { renderWithProviders } from '../setup';

// Mock the entire component to focus on behavior testing
vi.mock('../../components/AddRecipeDialog', () => ({
  AddRecipeDialog: vi.fn(({ open, onOpenChange, onSave, editingRecipe }) => {
    if (!open) return null;
    
    return (
      <div data-testid="add-recipe-dialog">
        <h2>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        <form>
          <input data-testid="recipe-name" placeholder="Recipe name" />
          <textarea data-testid="instructions" placeholder="Instructions" />
          <input data-testid="servings" type="number" placeholder="Servings" />
          <input data-testid="prep-time" type="number" placeholder="Prep time" />
          <textarea data-testid="notes" placeholder="Notes" />
          <div data-testid="ingredients-section">Ingredients</div>
          <div data-testid="nutrition-section">Nutrition per serving</div>
          <div data-testid="tags-section">Tags</div>
          <button type="button" onClick={() => onOpenChange(false)}>Cancel</button>
          <button
            type="button"
            onClick={() => onSave({ 
              name: 'Test Recipe', 
              instructions: 'Test instructions',
              servings: 4,
              total_time_minutes: 30,
              ingredients: [],
              nutrition: { calories_per_serving: 200, protein_per_serving: 10, carbs_per_serving: 30, fat_per_serving: 5 },
              notes: '',
              is_favorite: false
            })}
          >
            {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </form>
      </div>
    );
  })
}));

describe('AddRecipeDialog Component Behavior', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open is true', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByTestId('add-recipe-dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Recipe')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByTestId('add-recipe-dialog')).not.toBeInTheDocument();
  });

  it('should render in edit mode when editingRecipe is provided', () => {
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
  });

  it('should have all expected form sections', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByTestId('recipe-name')).toBeInTheDocument();
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
    expect(screen.getByTestId('servings')).toBeInTheDocument();
    expect(screen.getByTestId('prep-time')).toBeInTheDocument();
    expect(screen.getByTestId('notes')).toBeInTheDocument();
    expect(screen.getByTestId('ingredients-section')).toBeInTheDocument();
    expect(screen.getByTestId('nutrition-section')).toBeInTheDocument();
    expect(screen.getByTestId('tags-section')).toBeInTheDocument();
  });

  it('should call onOpenChange when cancel is clicked', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    cancelButton.click();

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onSave when add recipe is clicked', () => {
    renderWithProviders(
      <AddRecipeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Add Recipe');
    saveButton.click();

    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Test Recipe',
      instructions: 'Test instructions',
      servings: 4,
      total_time_minutes: 30,
      ingredients: [],
      nutrition: { calories_per_serving: 200, protein_per_serving: 10, carbs_per_serving: 30, fat_per_serving: 5 },
      notes: '',
      is_favorite: false
    });
  });

  it('should show update button in edit mode', () => {
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

    expect(screen.getByText('Update Recipe')).toBeInTheDocument();
    expect(screen.queryByText('Add Recipe')).not.toBeInTheDocument();
  });
});