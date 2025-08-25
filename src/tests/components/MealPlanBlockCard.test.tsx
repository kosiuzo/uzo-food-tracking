import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MealPlanBlockCard } from '../../components/MealPlanBlockCard';
import { MealPlanBlock, Recipe } from '../../types';

// Mock data
const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    name: 'Salmon & Eggs with Salsa',
    instructions: 'Cook salmon and eggs, add salsa',
    servings: 2,
    ingredients: [],
    nutrition: {
      calories_per_serving: 400,
      protein_per_serving: 30,
      carbs_per_serving: 10,
      fat_per_serving: 25,
    },
  },
  {
    id: 'recipe-2',
    name: 'Chicken Breast with Orange Sauce',
    instructions: 'Cook chicken, prepare orange sauce',
    servings: 2,
    ingredients: [],
    nutrition: {
      calories_per_serving: 350,
      protein_per_serving: 35,
      carbs_per_serving: 15,
      fat_per_serving: 20,
    },
  },
];

const mockBlock: MealPlanBlock = {
  id: 'block-1',
  name: 'Mon-Wed Block',
  startDay: 0,
  endDay: 2,
  rotations: [
    {
      id: 'rotation-1',
      name: 'Rotation 1',
      recipes: ['recipe-1'],
      notes: 'Salmon & eggs with salsa',
    },
    {
      id: 'rotation-2',
      name: 'Rotation 2',
      recipes: ['recipe-2'],
      notes: 'Chicken breast with orange chicken sauce, and broccoli',
    },
  ],
  snacks: ['snack-1'],
};

const mockGetDayRange = vi.fn((startDay: number, endDay: number) => {
  if (startDay === 0 && endDay === 2) return 'Monday - Wednesday';
  return 'Unknown';
});

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

describe('MealPlanBlockCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the block name and day range', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    expect(screen.getByText('Mon-Wed Block')).toBeInTheDocument();
    expect(screen.getByText('Monday - Wednesday')).toBeInTheDocument();
  });

  it('should display rotation count and snack count', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    expect(screen.getByText('2 rotations')).toBeInTheDocument();
    expect(screen.getByText('1 snack')).toBeInTheDocument();
  });

  it('should expand to show recipe details when expand button is clicked', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    // Initially, recipe details should not be visible
    expect(screen.queryByText('Salmon & Eggs with Salsa')).not.toBeInTheDocument();

    // Click expand button
    const expandButton = screen.getByText('+');
    fireEvent.click(expandButton);

    // Now recipe details should be visible
    expect(screen.getByText('Salmon & Eggs with Salsa')).toBeInTheDocument();
    expect(screen.getByText('Chicken Breast with Orange Sauce')).toBeInTheDocument();
    expect(screen.getByText('Salmon & eggs with salsa')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBlock);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockBlock.id);
  });

  it('should display recipe names correctly when expanded', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    // Expand the card
    const expandButton = screen.getByText('+');
    fireEvent.click(expandButton);

    // Check that recipe names are displayed
    expect(screen.getByText('Salmon & Eggs with Salsa')).toBeInTheDocument();
    expect(screen.getByText('Chicken Breast with Orange Sauce')).toBeInTheDocument();
  });

  it('should display rotation notes when available', () => {
    render(
      <MealPlanBlockCard
        block={mockBlock}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    // Expand the card
    const expandButton = screen.getByText('+');
    fireEvent.click(expandButton);

    // Check that rotation notes are displayed
    expect(screen.getByText('Salmon & eggs with salsa')).toBeInTheDocument();
    expect(screen.getByText('Chicken breast with orange chicken sauce, and broccoli')).toBeInTheDocument();
  });

  it('should handle blocks without snacks gracefully', () => {
    const blockWithoutSnacks: MealPlanBlock = {
      ...mockBlock,
      snacks: undefined,
    };

    render(
      <MealPlanBlockCard
        block={blockWithoutSnacks}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    // Should not display snack count
    expect(screen.queryByText(/snack/)).not.toBeInTheDocument();
  });

  it('should handle unknown recipe IDs gracefully', () => {
    const blockWithUnknownRecipes: MealPlanBlock = {
      ...mockBlock,
      rotations: [
        {
          id: 'rotation-1',
          name: 'Rotation 1',
          recipes: ['unknown-recipe-id'],
          notes: 'Unknown recipe',
        },
      ],
    };

    render(
      <MealPlanBlockCard
        block={blockWithUnknownRecipes}
        allRecipes={mockRecipes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        getDayRange={mockGetDayRange}
      />
    );

    // Expand the card
    const expandButton = screen.getByText('+');
    fireEvent.click(expandButton);

    // Should display "Unknown Recipe" for unknown recipe IDs
    expect(screen.getAllByText('Unknown Recipe')).toHaveLength(2); // One in rotation, one in snacks
  });
});
