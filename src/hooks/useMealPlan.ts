import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { WeeklyMealPlan, MealPlanBlock, RecipeRotation } from '../types';

export const useMealPlan = () => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load the current week's meal plan
  useEffect(() => {
    loadCurrentWeekPlan();
  }, [loadCurrentWeekPlan]);

  const loadCurrentWeekPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the start of the current week (Monday)
      const now = new Date();
      const startOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const weekStartStr = startOfWeek.toISOString().split('T')[0];

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
          id: weeklyPlanData.id.toString(),
          weekStart: weeklyPlanData.week_start,
          blocks: weeklyPlanData.meal_plan_blocks?.map(block => ({
            id: block.id.toString(),
            name: block.name,
            startDay: block.start_day,
            endDay: block.end_day,
            rotations: block.recipe_rotations?.map(rotation => ({
              id: rotation.id.toString(),
              name: rotation.name,
              notes: rotation.notes || undefined,
              recipes: rotation.rotation_recipes?.map(rr => rr.recipe_id.toString()) || []
            })) || [],
            snacks: block.block_snacks?.map(snack => snack.recipe_id.toString()) || []
          })) || []
        };

        setWeeklyPlan(convertedPlan);
        setUsingMockData(false);
      } else {
        // No plan exists for this week, create a default one
        await createDefaultWeekPlan(weekStartStr);
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
  }, [createDefaultWeekPlan]);

  const createDefaultWeekPlan = useCallback(async (weekStart: string) => {
    try {
      // Create a new weekly meal plan
      const { data: weeklyPlanData, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .insert({ week_start: weekStart })
        .select()
        .single();

      if (weeklyError) {
        throw weeklyError;
      }

      const newPlan: WeeklyMealPlan = {
        id: weeklyPlanData.id.toString(),
        weekStart,
        blocks: []
      };

      setWeeklyPlan(newPlan);
      setUsingMockData(false);
    } catch (err) {
      console.error('Error creating default week plan:', err);
      // Fall back to mock data
      setUsingMockData(true);
      setWeeklyPlan(getMockWeeklyPlan());
    }
  }, []);

  const createMealPlanBlock = async (block: Omit<MealPlanBlock, 'id'>) => {
    if (!weeklyPlan) return null;

    try {
      // Create the block in the database
      const { data: blockData, error: blockError } = await supabase
        .from('meal_plan_blocks')
        .insert({
          weekly_plan_id: parseInt(weeklyPlan.id),
          name: block.name,
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
              recipe_id: parseInt(recipeId)
            });
        }
      }

      // Add snacks
      for (const snackId of block.snacks || []) {
        await supabase
          .from('block_snacks')
          .insert({
            block_id: blockData.id,
            recipe_id: parseInt(snackId)
          });
      }

      // Reload the plan
      await loadCurrentWeekPlan();
      return blockData.id.toString();
    } catch (err) {
      console.error('Error creating meal plan block:', err);
      setError('Failed to create meal plan block');
      return null;
    }
  };

  const updateMealPlanBlock = async (blockId: string, updates: Partial<MealPlanBlock>) => {
    if (!weeklyPlan) return false;

    try {
      // Update block details
      if (updates.name !== undefined || updates.startDay !== undefined || updates.endDay !== undefined) {
        const { error: blockError } = await supabase
          .from('meal_plan_blocks')
          .update({
            name: updates.name,
            start_day: updates.startDay,
            end_day: updates.endDay
          })
          .eq('id', parseInt(blockId));

        if (blockError) throw blockError;
      }

      // Reload the plan
      await loadCurrentWeekPlan();
      return true;
    } catch (err) {
      console.error('Error updating meal plan block:', err);
      setError('Failed to update meal plan block');
      return false;
    }
  };

  const deleteMealPlanBlock = async (blockId: string) => {
    if (!weeklyPlan) return false;

    try {
      // Delete the block (cascades to rotations and snacks)
      const { error } = await supabase
        .from('meal_plan_blocks')
        .delete()
        .eq('id', parseInt(blockId));

      if (error) throw error;

      // Reload the plan
      await loadCurrentWeekPlan();
      return true;
    } catch (err) {
      console.error('Error deleting meal plan block:', err);
      setError('Failed to delete meal plan block');
      return false;
    }
  };

  const addRotationToBlock = async (blockId: string, rotation: Omit<RecipeRotation, 'id'>) => {
    if (!weeklyPlan) return null;

    try {
      // Create the rotation
      const { data: rotationData, error: rotationError } = await supabase
        .from('recipe_rotations')
        .insert({
          block_id: parseInt(blockId),
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
            recipe_id: parseInt(recipeId)
          });
      }

      // Reload the plan
      await loadCurrentWeekPlan();
      return rotationData.id.toString();
    } catch (err) {
      console.error('Error adding rotation:', err);
      setError('Failed to add rotation');
      return null;
    }
  };

  const updateRotation = async (blockId: string, rotationId: string, updates: Partial<RecipeRotation>) => {
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
          .eq('id', parseInt(rotationId));

        if (rotationError) throw rotationError;
      }

      // Update recipes if needed
      if (updates.recipes !== undefined) {
        // Remove existing recipes
        await supabase
          .from('rotation_recipes')
          .delete()
          .eq('rotation_id', parseInt(rotationId));

        // Add new recipes
        for (const recipeId of updates.recipes) {
          await supabase
            .from('rotation_recipes')
            .insert({
              rotation_id: parseInt(rotationId),
              recipe_id: parseInt(recipeId)
            });
        }
      }

      // Reload the plan
      await loadCurrentWeekPlan();
      return true;
    } catch (err) {
      console.error('Error updating rotation:', err);
      setError('Failed to update rotation');
      return false;
    }
  };

  const deleteRotation = async (blockId: string, rotationId: string) => {
    if (!weeklyPlan) return false;

    try {
      // Delete the rotation (cascades to recipes)
      const { error } = await supabase
        .from('recipe_rotations')
        .delete()
        .eq('id', parseInt(rotationId));

      if (error) throw error;

      // Reload the plan
      await loadCurrentWeekPlan();
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
          },
          {
            id: 'mock-rotation-2',
            name: 'Rotation 2',
            recipes: ['chicken-orange-broccoli'],
            notes: 'Chicken breast with orange chicken sauce, and broccoli'
          }
        ],
        snacks: ['protein-bar', 'nuts']
      },
      {
        id: 'mock-block-2',
        name: 'Thu-Sat Block',
        startDay: 3,
        endDay: 5,
        rotations: [
          {
            id: 'mock-rotation-3',
            name: 'Rotation 1',
            recipes: ['steak-honey-garlic', 'cabbage'],
            notes: 'Steak with honey and garlic sauce, cabbage'
          },
          {
            id: 'mock-rotation-4',
            name: 'Rotation 2',
            recipes: ['ground-beef-bacon', 'lettuce-guacamole'],
            notes: 'Ground beef, bacon, lettuce, and guacamole'
          }
        ],
        snacks: ['yogurt', 'berries']
      }
    ]
  });

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
    refreshPlan: loadCurrentWeekPlan
  };
};
