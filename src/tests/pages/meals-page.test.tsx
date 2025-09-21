import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Meals from '../../pages/Meals';
import { renderWithProviders } from '../setup';
import * as mealLogsHook from '../../hooks/useMealLogs';
import * as recipesHook from '../../hooks/useRecipes';
import { getTodayLocalDate } from '../../lib/utils';

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
    const today = getTodayLocalDate();
    vi.mocked(mealLogsHook.useMealLogs).mockReturnValue({
      mealLogs: [{
        id: 1,
        meal_name: 'Pasta',
        eaten_on: today,
        items: ['pasta', 'sauce'],
        macros: { calories: 500, protein: 15, carbs: 80, fat: 5 },
        notes: '',
        rating: undefined,
        created_at: new Date().toISOString(),
      }],
      addMealLog: vi.fn(),
      addMealLogFromItems: vi.fn(),
      addBatchMealLogsFromItems: vi.fn(),
      updateMealLog: vi.fn(),
      deleteMealLog: vi.fn(),
      reLogMeal: vi.fn(),
      usingMockData: true,
      error: null,
      loading: false,
    } as ReturnType<typeof mealLogsHook.useMealLogs>);

    vi.mocked(recipesHook.useRecipes).mockReturnValue({
      getRecipeById: vi.fn(),
    } as ReturnType<typeof recipesHook.useRecipes>);

    renderWithProviders(<Meals />);
    // Verify key KPI heading is rendered
    expect(screen.getByRole('heading', { name: 'Calories' })).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });
});
