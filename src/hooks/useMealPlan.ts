import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { WeeklyMealPlan, MealPlanBlock, RecipeRotation } from '../types';

// Mock data for the new meal planner
const mockWeeklyMealPlan: WeeklyMealPlan = {
  id: '1',
  weekStart: '2024-01-01',
  blocks: [
    {
      id: '1',
      name: 'Mon-Wed Block',
      startDay: 0, // Monday
      endDay: 2,   // Wednesday
      rotations: [
        {
          id: '1',
          name: 'Rotation 1',
          recipes: ['salmon-eggs-salsa'],
          notes: 'Salmon & eggs with salsa'
        },
        {
          id: '2',
          name: 'Rotation 2',
          recipes: ['chicken-orange-broccoli'],
          notes: 'Chicken breast with orange chicken sauce, and broccoli'
        }
      ],
      snacks: ['protein-bar', 'nuts']
    },
    {
      id: '2',
      name: 'Thu-Sat Block',
      startDay: 3, // Thursday
      endDay: 5,   // Saturday
      rotations: [
        {
          id: '3',
          name: 'Rotation 1',
          recipes: ['steak-honey-garlic', 'cabbage'],
          notes: 'Steak with honey and garlic sauce, cabbage'
        },
        {
          id: '4',
          name: 'Rotation 2',
          recipes: ['ground-beef-bacon', 'lettuce-guacamole'],
          notes: 'Ground beef, bacon, lettuce, and guacamole'
        }
      ],
      snacks: ['yogurt', 'berries']
    }
  ]
};

export function useMealPlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the new structure isn't in the database yet
      // TODO: Implement database loading when schema is updated
      setWeeklyPlan(mockWeeklyMealPlan);
      setUsingMockData(true);
      setError(null);
    } catch (err) {
      console.warn('Failed to load meal plan, using mock data:', err);
      setWeeklyPlan(mockWeeklyMealPlan);
      setUsingMockData(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const createMealPlanBlock = (block: Omit<MealPlanBlock, 'id'>) => {
    const newBlock: MealPlanBlock = {
      ...block,
      id: Math.random().toString(),
    };

    setWeeklyPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: [...prev.blocks, newBlock],
      };
    });
  };

  const updateMealPlanBlock = (blockId: string, updates: Partial<MealPlanBlock>) => {
    setWeeklyPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      };
    });
  };

  const deleteMealPlanBlock = (blockId: string) => {
    setWeeklyPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: prev.blocks.filter((block) => block.id !== blockId),
      };
    });
  };

  const addRotationToBlock = (blockId: string, rotation: Omit<RecipeRotation, 'id'>) => {
    const newRotation: RecipeRotation = {
      ...rotation,
      id: Math.random().toString(),
    };

    setWeeklyPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? { ...block, rotations: [...block.rotations, newRotation] }
            : block
        ),
      };
    });
  };

  const updateRotation = (blockId: string, rotationId: string, updates: Partial<RecipeRotation>) => {
    setWeeklyPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                rotations: block.rotations.map((rotation) =>
                  rotation.id === rotationId ? { ...rotation, ...updates } : rotation
                ),
              }
            : block
        ),
      };
    });
  };

  const deleteRotation = (blockId: string, rotationId: string) => {
    setWeeklyPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        blocks: prev.blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                rotations: block.rotations.filter((rotation) => rotation.id !== rotationId),
              }
            : block
        ),
      };
    });
  };

  const getDayName = (dayIndex: number): string => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex] || 'Unknown';
  };

  const getDayRange = (startDay: number, endDay: number): string => {
    const start = getDayName(startDay);
    const end = getDayName(endDay);
    return start === end ? start : `${start} - ${end}`;
  };

  return {
    weeklyPlan,
    loading,
    error,
    usingMockData,
    createMealPlanBlock,
    updateMealPlanBlock,
    deleteMealPlanBlock,
    addRotationToBlock,
    updateRotation,
    deleteRotation,
    getDayName,
    getDayRange,
    refetch: loadMealPlan,
  };
}
