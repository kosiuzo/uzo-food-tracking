import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Planner from '../../pages/Planner';

// Mock the hooks
vi.mock('../../hooks/useRecipes', () => ({
  useRecipes: () => ({
    allRecipes: [
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
    ],
    favorites: [],
  }),
}));

vi.mock('../../hooks/useMealPlan', () => ({
  useMealPlan: () => ({
    weeklyPlan: {
      id: '1',
      weekStart: '2024-01-01',
      totalDays: 4,
      blocks: [
        {
          id: '1',
          name: 'Mon-Wed Block',
          startDay: 0,
          endDay: 2,
          rotations: [
            {
              id: '1',
              name: 'Rotation 1',
              recipes: ['recipe-1'],
              notes: 'Salmon & eggs with salsa',
            },
            {
              id: '2',
              name: 'Rotation 2',
              recipes: ['recipe-2'],
              notes: 'Chicken breast with orange chicken sauce, and broccoli',
            },
          ],
          snacks: ['snack-1'],
        },
      ],
    },
    loading: false,
    error: null,
    usingMockData: true,
    createMealPlanBlock: vi.fn(),
    updateMealPlanBlock: vi.fn(),
    deleteMealPlanBlock: vi.fn(),
    setTotalDays: vi.fn(),
    getDayName: vi.fn((dayIndex: number) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return days[dayIndex] || 'Unknown';
    }),
    getDayRange: vi.fn((startDay: number, endDay: number) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const start = days[startDay];
      const end = days[endDay];
      return start === end ? start : `${start} - ${end}`;
    }),
  }),
}));

vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('Planner Page', () => {
  it('should render the planner page with title and description', () => {
    render(
      <BrowserRouter>
        <Planner />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText(/Plan your weekly meals with recipe rotations and day ranges/)).toBeInTheDocument();
  });

  it('should display the weekly meal plan overview', () => {
    render(
      <BrowserRouter>
        <Planner />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Weekly Meal Plan Overview')).toBeInTheDocument();
  });

  it('should display meal plan blocks section', () => {
    render(
      <BrowserRouter>
        <Planner />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Meal Plan Blocks')).toBeInTheDocument();
    expect(screen.getByText('1 block')).toBeInTheDocument();
  });

  it('should display the add meal block button', () => {
    render(
      <BrowserRouter>
        <Planner />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Add Meal Block')).toBeInTheDocument();
  });

  it('should display existing meal plan blocks', () => {
    render(
      <BrowserRouter>
        <Planner />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Mon-Wed Block')).toBeInTheDocument();
    expect(screen.getByText('Monday - Wednesday')).toBeInTheDocument();
    expect(screen.getByText('2 rotations')).toBeInTheDocument();
    expect(screen.getByText('1 snack')).toBeInTheDocument();
  });
});
