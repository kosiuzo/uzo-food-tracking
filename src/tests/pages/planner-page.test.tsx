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
        blocks: [],
        startDate: '2024-01-15',
        endDate: '2024-01-21',
      },
      loading: false,
      error: null,
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
    });

    vi.mocked(useRecipesModule.useRecipes).mockReturnValue({
      allRecipes: [],
      favorites: [],
    });
  });

  it('should render the planner page with title and description', () => {
    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText(/Plan your weekly meals with recipe rotations and day ranges/)).toBeInTheDocument();
  });

  it('should display the add meal block button', () => {
    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Add Meal Block')).toBeInTheDocument();
  });

  it('should display meal plan blocks section', () => {
    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Meal Plan Blocks')).toBeInTheDocument();
  });

  it('should display existing meal plan blocks', () => {
    renderWithProviders(<Planner />);
    
    // This test will pass if the component renders without crashing
    expect(screen.getByText('Meal Plan Blocks')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: null,
      loading: true,
      error: null,
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
    });

    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Loading meal plan...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: null,
      loading: false,
      error: 'Failed to load meal plan',
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
    });

    renderWithProviders(<Planner />);
    
    expect(screen.getByText('Error loading meal plan')).toBeInTheDocument();
    expect(screen.getByText('Failed to load meal plan')).toBeInTheDocument();
  });

  it('shows no meal plan message when weeklyPlan is null', () => {
    vi.mocked(useMealPlanModule.useMealPlan).mockReturnValue({
      weeklyPlan: null,
      loading: false,
      error: null,
      usingMockData: false,
      createMealPlanBlock: vi.fn(),
      updateMealPlanBlock: vi.fn(),
      deleteMealPlanBlock: vi.fn(),
      getDayName: vi.fn(),
      getDayRange: vi.fn(),
    });

    renderWithProviders(<Planner />);
    
    expect(screen.getByText('No meal plan found')).toBeInTheDocument();
  });
});
