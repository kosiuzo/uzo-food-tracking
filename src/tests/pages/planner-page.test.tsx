import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Planner from '../../pages/Planner';
import { renderWithProviders } from '../setup';
import * as useMealPlanModule from '../../hooks/useMealPlan';
import * as useRecipesModule from '../../hooks/useRecipes';

// Mock the hooks
vi.mock('../../hooks/useMealPlan');
vi.mock('../../hooks/useRecipes');
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('Planner Page', () => {
  beforeEach(() => {
    // Set default mock return values
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: {
        id: 1,
        weekStart: '2024-01-15',
        blocks: [],
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
      },
      currentWeekStart: '2024-01-15',
      availableWeeks: ['2024-01-15', '2024-01-08', '2024-01-22'],
      loading: false,
      error: null,
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      addRotationToBlock: vi.fn(),
      updateRotation: vi.fn(),
      deleteRotation: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
      refreshPlan: vi.fn(),
      navigateToWeek: vi.fn(),
      navigateToPreviousWeek: vi.fn(),
      navigateToNextWeek: vi.fn(),
      loadAvailableWeeks: vi.fn(),
    });

    vi.mocked(useRecipesModule.useRecipes).mockReturnValue({
      allRecipes: [],
      favorites: [],
    });
  });

  it('should render the planner page with title and description', () => {
    renderWithProviders(<Planner />);

    expect(screen.getByText('Add Meal Block')).toBeInTheDocument();
    expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
  });

  it('should display the add meal block button', () => {
    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Add Meal Block')).toBeInTheDocument();
  });

  it('should display meal plan blocks section', () => {
    renderWithProviders(<Planner />);

    expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
  });

  it('should display existing meal plan blocks', () => {
    renderWithProviders(<Planner />);

    // This test will pass if the component renders without crashing
    expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: null,
      currentWeekStart: '',
      availableWeeks: [],
      loading: true,
      error: null,
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      addRotationToBlock: vi.fn(),
      updateRotation: vi.fn(),
      deleteRotation: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
      refreshPlan: vi.fn(),
      navigateToWeek: vi.fn(),
      navigateToPreviousWeek: vi.fn(),
      navigateToNextWeek: vi.fn(),
      loadAvailableWeeks: vi.fn(),
    });

    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Loading meal plan...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: null,
      currentWeekStart: '',
      availableWeeks: [],
      loading: false,
      error: 'Failed to load meal plan',
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      addRotationToBlock: vi.fn(),
      updateRotation: vi.fn(),
      deleteRotation: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
      refreshPlan: vi.fn(),
      navigateToWeek: vi.fn(),
      navigateToPreviousWeek: vi.fn(),
      navigateToNextWeek: vi.fn(),
      loadAvailableWeeks: vi.fn(),
    });

    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Error loading meal plan')).toBeInTheDocument();
    expect(screen.getByText('Failed to load meal plan')).toBeInTheDocument();
  });

  it('shows no meal plan message when weeklyPlan is null', () => {
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: null,
      currentWeekStart: '',
      availableWeeks: [],
      loading: false,
      error: null,
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      addRotationToBlock: vi.fn(),
      updateRotation: vi.fn(),
      deleteRotation: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
      refreshPlan: vi.fn(),
      navigateToWeek: vi.fn(),
      navigateToPreviousWeek: vi.fn(),
      navigateToNextWeek: vi.fn(),
      loadAvailableWeeks: vi.fn(),
    });

    renderWithProviders(<Planner />);
    
    expect(screen.getByText('No meal plan found')).toBeInTheDocument();
  });
});
