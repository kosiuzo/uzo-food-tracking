import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Meals from '../../pages/Meals';
import { renderWithProviders } from '../setup';
import * as mealLogsHook from '../../hooks/useMealLogs';
import * as recipesHook from '../../hooks/useRecipes';

vi.mock('../../hooks/useMealLogs');
vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));
vi.mock('../../components/LogMealDialog', () => ({ LogMealDialog: () => null }));
vi.mock('../../components/ConfirmDialog', () => ({ ConfirmDialog: () => null }));
vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Meals Page', () => {
  it('renders meal logs', () => {
    vi.mocked(mealLogsHook.useMealLogs).mockReturnValue({
      mealLogs: [{
        id: 1,
        meal_name: 'Pasta',
        date: '2024-01-01',
        recipe_ids: [],
        notes: '',
        nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        estimated_cost: 0,
      }],
      addMealLog: vi.fn(),
      updateMealLog: vi.fn(),
      deleteMealLog: vi.fn(),
      reLogMeal: vi.fn(),
      usingMockData: true,
      error: null,
      loading: false,
      getMealLogsByDateRange: vi.fn(),
      getRecentMealLogs: vi.fn(),
      refetch: vi.fn(),
    } as ReturnType<typeof mealLogsHook.useMealLogs>);

    vi.mocked(recipesHook.useRecipes).mockReturnValue({
      getRecipeById: vi.fn(),
    } as ReturnType<typeof recipesHook.useRecipes>);

    renderWithProviders(<Meals />);
    expect(screen.getByText('Total Meals')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });
});
