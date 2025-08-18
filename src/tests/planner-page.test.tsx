import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Planner } from '../pages/Planner';
import { useMealPlan } from '../hooks/useMealPlan';
import { useRecipes } from '../hooks/useRecipes';
import { useIsMobile } from '../hooks/use-mobile';

// Mock the hooks
vi.mock('../hooks/useMealPlan');
vi.mock('../hooks/useRecipes');
vi.mock('../hooks/use-mobile');
vi.mock('../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

const mockUseMealPlan = vi.mocked(useMealPlan);
const mockUseRecipes = vi.mocked(useRecipes);
const mockUseIsMobile = vi.mocked(useIsMobile);

describe('Planner Page', () => {
  const defaultMockData = {
    allRecipes: [
      { id: '1', name: 'Grilled Chicken Salad' },
      { id: '2', name: 'Avocado Toast' },
      { id: '3', name: 'Banana Smoothie' },
    ],
    favorites: [
      { id: '1', name: 'Grilled Chicken Salad' },
    ],
    setMeal: vi.fn(),
    clearMeal: vi.fn(),
    getPlansInRange: vi.fn(() => [
      { date: '2025-08-18', mealType: 'breakfast', recipeId: '3' },
      { date: '2025-08-18', mealType: 'lunch', recipeId: '1' },
    ]),
    usingMockData: true,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMealPlan.mockReturnValue(defaultMockData);
    mockUseRecipes.mockReturnValue({
      allRecipes: defaultMockData.allRecipes,
      favorites: defaultMockData.favorites,
    });
  });

  it('renders desktop view when not mobile', () => {
    mockUseIsMobile.mockReturnValue(false);
    
    render(<Planner />);
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('Meal')).toBeInTheDocument();
    expect(screen.getByText('breakfast')).toBeInTheDocument();
    expect(screen.getByText('lunch')).toBeInTheDocument();
    expect(screen.getByText('dinner')).toBeInTheDocument();
  });

  it('renders mobile view when on mobile', () => {
    mockUseIsMobile.mockReturnValue(true);
    
    render(<Planner />);
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('Monday, Aug 18')).toBeInTheDocument();
    expect(screen.getByText('breakfast')).toBeInTheDocument();
    expect(screen.getByText('lunch')).toBeInTheDocument();
    expect(screen.getByText('dinner')).toBeInTheDocument();
  });

  it('shows demo mode indicator when using mock data', () => {
    mockUseIsMobile.mockReturnValue(false);
    
    render(<Planner />);
    
    expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
    expect(screen.getByText(/Showing sample meal plans/)).toBeInTheDocument();
  });

  it('displays weekly overview section', () => {
    mockUseIsMobile.mockReturnValue(false);
    
    render(<Planner />);
    
    expect(screen.getByText('Weekly Overview')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    mockUseIsMobile.mockReturnValue(false);
    mockUseMealPlan.mockReturnValue({
      ...defaultMockData,
      loading: true,
    });
    
    render(<Planner />);
    
    expect(screen.getByText('Loading meal plan...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    mockUseIsMobile.mockReturnValue(false);
    mockUseMealPlan.mockReturnValue({
      ...defaultMockData,
      error: 'Failed to load meal plan',
      usingMockData: false,
    });
    
    render(<Planner />);
    
    expect(screen.getByText(/Error loading meal plan/)).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });
});
