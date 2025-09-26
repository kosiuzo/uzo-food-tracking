import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Meals from '../../pages/Meals';
import { renderWithProviders } from '../setup';
import * as mealLogsByDateHook from '../../hooks/useMealLogsByDate';
import * as recipesHook from '../../hooks/useRecipes';
import * as dateNavigationHook from '../../hooks/useDateNavigation';
import { getTodayLocalDate } from '../../lib/utils';

vi.mock('../../hooks/useMealLogsByDate');
vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/useDateNavigation');
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
    vi.mocked(mealLogsByDateHook.useMealLogsByDate).mockReturnValue({
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
      getMealLogsForDate: vi.fn(),
      loadSingleDay: vi.fn(),
      usingMockData: false,
      error: null,
      loading: false,
    } as ReturnType<typeof mealLogsByDateHook.useMealLogsByDate>);

    vi.mocked(recipesHook.useRecipes).mockReturnValue({
      getRecipeById: vi.fn(),
    } as ReturnType<typeof recipesHook.useRecipes>);

    vi.mocked(dateNavigationHook.useDateNavigation).mockReturnValue({
      currentDate: today,
      viewMode: 'day',
      dateRange: {
        startDate: today,
        endDate: today
      },
      displayText: 'Thursday, September 25, 2025',
      canGoNext: true,
      goToToday: vi.fn(),
      goToPrevious: vi.fn(),
      goToNext: vi.fn(),
      goToDate: vi.fn(),
      setViewMode: vi.fn(),
      goToLastWeek: vi.fn(),
      goToLastMonth: vi.fn(),
    } as ReturnType<typeof dateNavigationHook.useDateNavigation>);

    renderWithProviders(<Meals />);
    // Verify key KPI heading is rendered
    expect(screen.getByRole('heading', { name: 'Calories' })).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });
});
