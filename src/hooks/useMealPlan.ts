import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { WeeklyMealPlan, MealPlanBlock, RecipeRotation } from '../types';

export const useMealPlan = () => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Helper function to get week start string from date
  const getWeekStartString = useCallback((date: Date): string => {
    const weekStart = new Date(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString().split('T')[0];
  }, []);

  // Load available weeks from database
  const loadAvailableWeeks = useCallback(async () => {
    try {
      const { data: weeksData, error: weeksError } = await supabase
        .from('weekly_meal_plans')
        .select('week_start')
        .order('week_start', { ascending: false });

      if (weeksError) {
        console.error('Error loading available weeks:', weeksError);
        return;
      }

      const weeks = weeksData?.map(w => w.week_start) || [];
      setAvailableWeeks(weeks);
    } catch (err) {
      console.error('Error in loadAvailableWeeks:', err);
    }
  }, []);

  // Load meal plan for specific week
  const loadWeekPlan = useCallback(async (weekStartStr: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentWeekStart(weekStartStr);

      // Try to load from database first
      const { data: weeklyPlanData, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select(`
          id,
          week_start,
          meal_plan_blocks (
            id,
            name,
            start_day,
            end_day,
            recipe_rotations (
              id,
              name,
              notes,
              rotation_recipes (
                recipe_id
              )
            ),
            block_snacks (
              recipe_id
            )
          )
        `)
        .eq('week_start', weekStartStr)
        .single();

      if (weeklyError && weeklyError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading weekly plan:', weeklyError);
        setError('Failed to load meal plan');
        return;
      }

      if (weeklyPlanData) {
        // Convert database format to our app format
        const convertedPlan: WeeklyMealPlan = {
          id: weeklyPlanData.id,
          weekStart: weeklyPlanData.week_start,
          blocks: weeklyPlanData.meal_plan_blocks?.map(block => ({
            id: block.id,
            name: block.name,
            startDay: block.start_day,
            endDay: block.end_day,
            rotations: block.recipe_rotations?.map(rotation => ({
              id: rotation.id,
              name: rotation.name,
              notes: rotation.notes || undefined,
              recipes: rotation.rotation_recipes?.map(rr => rr.recipe_id) || [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })) || [],
            snacks: block.block_snacks?.map(snack => snack.recipe_id) || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })) || [],
          created_at: weeklyPlanData.created_at || new Date().toISOString(),
          updated_at: weeklyPlanData.updated_at || new Date().toISOString(),
        };

        setWeeklyPlan(convertedPlan);
        setUsingMockData(false);
      } else {
        // No plan exists for this week, create a default one
        try {
          // Create a new weekly meal plan
          const { data: weeklyPlanData, error: weeklyError } = await supabase
            .from('weekly_meal_plans')
            .insert({ week_start: weekStartStr })
            .select()
            .single();

          if (weeklyError) {
            throw weeklyError;
          }

          const newPlan: WeeklyMealPlan = {
            id: weeklyPlanData.id,
            weekStart: weekStartStr,
            blocks: [],
            created_at: weeklyPlanData.created_at || new Date().toISOString(),
            updated_at: weeklyPlanData.updated_at || new Date().toISOString(),
          };

          setWeeklyPlan(newPlan);
          setUsingMockData(false);
        } catch (createErr) {
          console.error('Error creating default week plan:', createErr);
          // Fall back to mock data
          setUsingMockData(true);
          setWeeklyPlan(getMockWeeklyPlan());
        }
      }
    } catch (err) {
      console.error('Error in loadCurrentWeekPlan:', err);
      setError('Failed to load meal plan');
      // Fall back to mock data if database fails
      setUsingMockData(true);
      setWeeklyPlan(getMockWeeklyPlan());
    } finally {
      setLoading(false);
    }
  }, []);

  // Load current week plan (uses current date)
  const loadCurrentWeekPlan = useCallback(async () => {
    const now = new Date();
    const weekStartStr = getWeekStartString(now);
    await loadWeekPlan(weekStartStr);
    await loadAvailableWeeks();
  }, [getWeekStartString, loadWeekPlan, loadAvailableWeeks]);

  // Week navigation functions
  const navigateToWeek = useCallback(async (weekStartStr: string) => {
    await loadWeekPlan(weekStartStr);
  }, [loadWeekPlan]);

  const navigateToPreviousWeek = useCallback(async () => {
    if (!currentWeekStart) return;
    
    const currentDate = new Date(currentWeekStart);
    currentDate.setDate(currentDate.getDate() - 7);
    const previousWeekStr = getWeekStartString(currentDate);
    
    await loadWeekPlan(previousWeekStr);
    await loadAvailableWeeks();
  }, [currentWeekStart, getWeekStartString, loadWeekPlan, loadAvailableWeeks]);

  const navigateToNextWeek = useCallback(async () => {
    if (!currentWeekStart) return;
    
    const currentDate = new Date(currentWeekStart);
    currentDate.setDate(currentDate.getDate() + 7);
    const nextWeekStr = getWeekStartString(currentDate);
    
    await loadWeekPlan(nextWeekStr);
    await loadAvailableWeeks();
  }, [currentWeekStart, getWeekStartString, loadWeekPlan, loadAvailableWeeks]);

  // Load the current week's meal plan
  useEffect(() => {
    loadCurrentWeekPlan();
  }, [loadCurrentWeekPlan]);

  const createMealPlanBlock = async (block: Omit<MealPlanBlock, 'id'>) => {
    if (!weeklyPlan) return null;

    try {
      // Generate auto-incrementing block name with actual week start date
      const blockNumber = weeklyPlan.blocks.length + 1;
      const weekStartDate = weeklyPlan.weekStart;
      const autoGeneratedName = `BLOCK-${blockNumber}-${weekStartDate}`;

      // Create the block in the database
      const { data: blockData, error: blockError } = await supabase
        .from('meal_plan_blocks')
        .insert({
          weekly_plan_id: weeklyPlan.id,
          name: autoGeneratedName,
          start_day: block.startDay,
          end_day: block.endDay
        })
        .select()
        .single();

      if (blockError) throw blockError;

      // Create rotations
      for (const rotation of block.rotations) {
        const { data: rotationData, error: rotationError } = await supabase
          .from('recipe_rotations')
          .insert({
            block_id: blockData.id,
            name: rotation.name,
            notes: rotation.notes
          })
          .select()
          .single();

        if (rotationError) throw rotationError;

        // Add recipes to rotation
        for (const recipeId of rotation.recipes) {
          await supabase
            .from('rotation_recipes')
            .insert({
              rotation_id: rotationData.id,
              recipe_id: recipeId
            });
        }
      }

      // Add snacks
      for (const snackId of block.snacks || []) {
        await supabase
          .from('block_snacks')
          .insert({
            block_id: blockData.id,
            recipe_id: snackId
          });
      }

      // Reload the plan
      await loadWeekPlan(currentWeekStart);
      return blockData.id;
    } catch (err) {
      console.error('Error creating meal plan block:', err);
      setError('Failed to create meal plan block');
      return null;
    }
  };

  const updateMealPlanBlock = async (blockId: number, updates: Partial<MealPlanBlock>) => {
    if (!weeklyPlan) return false;

    try {
      // Update block details (excluding name since it's auto-generated)
      if (updates.startDay !== undefined || updates.endDay !== undefined) {
        const { error: blockError } = await supabase
          .from('meal_plan_blocks')
          .update({
            start_day: updates.startDay,
            end_day: updates.endDay
          })
          .eq('id', blockId);

        if (blockError) throw blockError;
      }

      // Reload the plan
      await loadWeekPlan(currentWeekStart);
      return true;
    } catch (err) {
      console.error('Error updating meal plan block:', err);
      setError('Failed to update meal plan block');
      return false;
    }
  };

  const deleteMealPlanBlock = async (blockId: number) => {
    if (!weeklyPlan) return false;

    try {
      // Delete the block (cascades to rotations and snacks)
      const { error } = await supabase
        .from('meal_plan_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      // Reload the plan
      await loadWeekPlan(currentWeekStart);
      return true;
    } catch (err) {
      console.error('Error deleting meal plan block:', err);
      setError('Failed to delete meal plan block');
      return false;
    }
  };

  const addRotationToBlock = async (blockId: number, rotation: Omit<RecipeRotation, 'id'>) => {
    if (!weeklyPlan) return null;

    try {
      // Create the rotation
      const { data: rotationData, error: rotationError } = await supabase
        .from('recipe_rotations')
        .insert({
          block_id: blockId,
          name: rotation.name,
          notes: rotation.notes
        })
        .select()
        .single();

      if (rotationError) throw rotationError;

      // Add recipes to rotation
      for (const recipeId of rotation.recipes) {
        await supabase
          .from('rotation_recipes')
          .insert({
            rotation_id: rotationData.id,
            recipe_id: recipeId
          });
      }

      // Reload the plan
      await loadWeekPlan(currentWeekStart);
      return rotationData.id;
    } catch (err) {
      console.error('Error adding rotation:', err);
      setError('Failed to add rotation');
      return null;
    }
  };

  const updateRotation = async (blockId: number, rotationId: number, updates: Partial<RecipeRotation>) => {
    if (!weeklyPlan) return false;

    try {
      // Update rotation details
      if (updates.name !== undefined || updates.notes !== undefined) {
        const { error: rotationError } = await supabase
          .from('recipe_rotations')
          .update({
            name: updates.name,
            notes: updates.notes
          })
          .eq('id', rotationId);

        if (rotationError) throw rotationError;
      }

      // Update recipes if needed
      if (updates.recipes !== undefined) {
        // Remove existing recipes
        await supabase
          .from('rotation_recipes')
          .delete()
          .eq('rotation_id', rotationId);

        // Add new recipes
        for (const recipeId of updates.recipes) {
          await supabase
            .from('rotation_recipes')
            .insert({
              rotation_id: rotationId,
              recipe_id: recipeId
            });
        }
      }

      // Reload the plan
      await loadWeekPlan(currentWeekStart);
      return true;
    } catch (err) {
      console.error('Error updating rotation:', err);
      setError('Failed to update rotation');
      return false;
    }
  };

  const deleteRotation = async (blockId: number, rotationId: number) => {
    if (!weeklyPlan) return false;

    try {
      // Delete the rotation (cascades to recipes)
      const { error } = await supabase
        .from('recipe_rotations')
        .delete()
        .eq('id', rotationId);

      if (error) throw error;

      // Reload the plan
      await loadWeekPlan(currentWeekStart);
      return true;
    } catch (err) {
      console.error('Error deleting rotation:', err);
      setError('Failed to delete rotation');
      return false;
    }
  };

  const getDayName = (dayIndex: number): string => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex] || 'Unknown';
  };

  const getDayRange = (startDay: number, endDay: number): string => {
    const startName = getDayName(startDay);
    const endName = getDayName(endDay);
    return startDay === endDay ? startName : `${startName} - ${endName}`;
  };

  // Mock data fallback
  const getMockWeeklyPlan = (): WeeklyMealPlan => ({
    id: 1,
    weekStart: '2024-01-01',
    blocks: [
      {
        id: 1,
        name: 'block_1_2024-01-01',
        startDay: 0,
        endDay: 2,
        rotations: [
          {
            id: 1,
            name: 'Rotation 1',
            recipes: [1, 2], // Mock recipe IDs
            notes: 'Salmon & eggs with salsa',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: 'Rotation 2',
            recipes: [3, 4], // Mock recipe IDs
            notes: 'Chicken breast with orange chicken sauce, and broccoli',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ],
        snacks: [5, 6], // Mock recipe IDs for snacks
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'block_2_2024-01-01',
        startDay: 3,
        endDay: 5,
        rotations: [
          {
            id: 3,
            name: 'Rotation 1',
            recipes: [7, 8], // Mock recipe IDs
            notes: 'Steak with honey and garlic sauce, cabbage',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 4,
            name: 'Rotation 2',
            recipes: [9, 10], // Mock recipe IDs
            notes: 'Ground beef, bacon, lettuce, and guacamole',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ],
        snacks: [11, 12], // Mock recipe IDs for snacks
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return {
    weeklyPlan,
    currentWeekStart,
    availableWeeks,
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
    refreshPlan: loadCurrentWeekPlan,
    navigateToWeek,
    navigateToPreviousWeek,
    navigateToNextWeek,
    loadAvailableWeeks
  };
};
