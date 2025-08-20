import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Planner from '../pages/Planner';
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
  const mockWeeklyPlan = {
    id: 'mock-1',
    weekStart: '2024-01-01',
    blocks: [
      {
        id: 'mock-block-1',
        name: 'Mon-Wed Block',
        startDay: 0,
        endDay: 2,
        rotations: [
          {
            id: 'mock-rotation-1',
            name: 'Rotation 1',
            recipes: ['salmon-eggs-salsa'],
            notes: 'Salmon & eggs with salsa'
          }
        ],
        snacks: ['protein-bar']
      }
    ]
  };

  const defaultMockData = {
    weeklyPlan: mockWeeklyPlan,
    loading: false,
    error: null,
    usingMockData: true,
    createMealPlanBlock: vi.fn(),
    updateMealPlanBlock: vi.fn(),
    deleteMealPlanBlock: vi.fn(),
    addRotationToBlock: vi.fn(),
    updateRotation: vi.fn(),
    deleteRotation: vi.fn(),
    getDayName: vi.fn((dayIndex: number) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return days[dayIndex] || 'Unknown';
    }),
    getDayRange: vi.fn((startDay: number, endDay: number) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const startName = days[startDay] || 'Unknown';
      const endName = days[endDay] || 'Unknown';
      return startDay === endDay ? startName : `${startName} - ${endName}`;
    }),
    refreshPlan: vi.fn()
  };

  const defaultRecipesData = {
    allRecipes: [
      { id: '1', name: 'Grilled Chicken Salad' },
      { id: '2', name: 'Avocado Toast' },
      { id: '3', name: 'Banana Smoothie' },
    ],
    favorites: [
      { id: '1', name: 'Grilled Chicken Salad' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMealPlan.mockReturnValue(defaultMockData);
    mockUseRecipes.mockReturnValue(defaultRecipesData);
  });

  it('renders desktop view when not mobile', () => {
    mockUseIsMobile.mockReturnValue(false);
    
    render(<Planner />);
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('Weekly Overview')).toBeInTheDocument();
    expect(screen.getByText('Meal Plan Blocks')).toBeInTheDocument();
  });

  it('renders mobile view when on mobile', () => {
    mockUseIsMobile.mockReturnValue(true);
    
    render(<Planner />);
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('Weekly Overview')).toBeInTheDocument();
    expect(screen.getByText('Meal Plan Blocks')).toBeInTheDocument();
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
