import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MealLog, DbMealLog } from '../types';
import { dbMealLogToMealLog, mealLogToDbInsert } from '../lib/type-mappers';
import { mockMealLogs } from '../data/mockData';
import { getTodayLocalDate } from '../lib/utils';

export function useMealLogs() {
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadMealLogs();
  }, []);

  const loadMealLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Attempting to load meal logs from Supabase...');
      
      // Try to connect to Supabase first
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .order('cooked_at', { ascending: false });
      
      if (error) {
        console.warn('⚠️ Supabase connection failed, falling back to mock data:', error.message);
        // Fall back to mock data
        setMealLogs(mockMealLogs);
        setUsingMockData(true);
        console.log('✅ Loaded mock data:', mockMealLogs.length, 'meal logs');
        return;
      }
      
      // Successfully connected to Supabase
      console.log('✅ Connected to Supabase successfully');
      
      if (data && data.length > 0) {
        console.log('✅ Loaded data from Supabase:', data.length, 'meal logs');
        const mappedMealLogs = data.map(dbMealLogToMealLog);
        setMealLogs(mappedMealLogs);
        setUsingMockData(false);
      } else {
        // Database is connected but empty - this is a valid state
        console.log('ℹ️ Database is connected but empty');
        setMealLogs([]);
        setUsingMockData(false);
      }
    } catch (err) {
      console.warn('⚠️ Error loading meal logs, falling back to mock data:', err);
      // Fall back to mock data on any error
      setMealLogs(mockMealLogs);
      setUsingMockData(true);
      setError(err instanceof Error ? err.message : 'Failed to load meal logs');
    } finally {
      setLoading(false);
    }
  };


  const addMealLog = async (mealLog: Omit<MealLog, 'id'>) => {
    try {
      const dbMealLog = mealLogToDbInsert(mealLog);
      
      const { data, error } = await supabase
        .from('meal_logs')
        .insert([dbMealLog])
        .select()
        .single();
      
      if (error) throw error;
      
      const newMealLog = dbMealLogToMealLog(data as DbMealLog);
      setMealLogs(prev => [newMealLog, ...prev]);
      return newMealLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add meal log');
      throw err;
    }
  };

  const updateMealLog = async (id: number, updatedData: Omit<MealLog, 'id'>) => {
    try {
      const dbMealLog = mealLogToDbInsert(updatedData);
      
      const { error } = await supabase
        .from('meal_logs')
        .update(dbMealLog)
        .eq('id', id);
      
      if (error) throw error;
      
      setMealLogs(prev => prev.map(log => 
        log.id === id ? { ...updatedData, id } : log
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update meal log');
      throw err;
    }
  };

  const deleteMealLog = async (id: number) => {
    try {
      const { error } = await supabase
        .from('meal_logs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMealLogs(prev => prev.filter(log => log.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete meal log');
      throw err;
    }
  };

  const getMealLogsByDateRange = (startDate: string, endDate: string) => {
    return mealLogs.filter(log => log.date >= startDate && log.date <= endDate);
  };

  const getRecentMealLogs = (days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];
    
    return mealLogs.filter(log => log.date >= cutoffDateString);
  };

  const reLogMeal = async (mealLog: MealLog) => {
    try {
      // Create a copy of the meal log with today's date
      const today = getTodayLocalDate();
      const newMealLog: Omit<MealLog, 'id'> = {
        recipe_ids: mealLog.recipe_ids,
        meal_name: mealLog.meal_name,
        date: today,
        notes: mealLog.notes,
        nutrition: mealLog.nutrition,
        estimated_cost: mealLog.estimated_cost,
      };
      
      // Use the existing addMealLog function
      const addedMealLog = await addMealLog(newMealLog);
      return addedMealLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to re-log meal');
      throw err;
    }
  };

  return {
    mealLogs,
    loading,
    error,
    usingMockData,
    addMealLog,
    updateMealLog,
    deleteMealLog,
    reLogMeal,
    getMealLogsByDateRange,
    getRecentMealLogs,
    refetch: loadMealLogs,
  };
}