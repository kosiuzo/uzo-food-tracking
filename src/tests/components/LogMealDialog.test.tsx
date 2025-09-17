import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { LogMealDialog } from '../../components/LogMealDialog';
import { renderWithProviders } from '../setup';

const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

// Mock the hooks that the component uses
vi.mock('../../hooks/useMealLogs', () => ({
  useMealLogs: () => ({
    // Mock empty implementation since this is now AI-based
  })
}));

describe('LogMealDialog', () => {
  const mockOnSave = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
  });

  it('renders dialog with AI-based title', () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Log Meals with AI')).toBeInTheDocument();
    expect(screen.getByText('Add food items to each meal and let AI calculate nutrition and generate meal names. You can log multiple meals at once!')).toBeInTheDocument();
  });

  it('renders editing mode with correct title', () => {
    const editingMealLog = {
      id: 1,
      date: '2025-08-28',
      meal_name: 'Test Meal',
      notes: 'Test notes',
      cost: 5.50,
      macros: { calories: 200, protein: 10, carbs: 30, fat: 5 }
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
  });

  it('displays meal entry cards for adding items', () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Meal 1')).toBeInTheDocument();
    expect(screen.getByText('Food Items')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., 2 eggs, 1 slice bread, 1 tbsp butter')).toBeInTheDocument();
  });

  it('shows Process with AI button for each meal entry', () => {
    renderWithProviders(
      <LogMealDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
      />
    );

    const processButtons = screen.getAllByText(/Process with AI/);
    expect(processButtons.length).toBeGreaterThan(0);
  });
});