import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useMealLogs } from '../../hooks/useMealLogs';
import { mockMealLogs } from '../../data/mockData';
import * as supabase from '../../lib/supabase';
import * as typeMappers from '../../lib/type-mappers';
import * as utils from '../../lib/utils';

// Mock dependencies
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }
}));
vi.mock('../../lib/type-mappers');
vi.mock('../../data/mockData');
vi.mock('../../lib/utils');

// Get the mocked supabase client
const mockSupabaseClient = vi.mocked(supabase.supabase);

// Mock meal log data
const mockDbMealLog = {
  id: 1,
  recipe_ids: [1, 2],
  item_entries: [],
  meal_name: 'Test Meal',
  cooked_at: '2025-01-15',
  notes: 'Test notes',
  nutrition: { calories: 500, protein: 25, carbs: 60, fat: 20 },
  estimated_cost: 12.50
};

const mockMealLog = {
  id: 1,
  recipe_ids: [1, 2],
  item_entries: [],
  meal_name: 'Test Meal',
  date: '2025-01-15',
  notes: 'Test notes',
  nutrition: { calories: 500, protein: 25, carbs: 60, fat: 20 },
  estimated_cost: 12.50
};

describe('useMealLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.supabase).mockReturnValue(mockSupabaseClient as any);
    vi.mocked(typeMappers.dbMealLogToMealLog).mockReturnValue(mockMealLog);
    vi.mocked(typeMappers.mealLogToDbInsert).mockReturnValue(mockDbMealLog);
    vi.mocked(mockMealLogs).mockReturnValue([mockMealLog]);
    vi.mocked(utils.getTodayLocalDate).mockReturnValue('2025-01-15');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('loadMealLogs', () => {
    it('should load meal logs from Supabase successfully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockDbMealLog],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useMealLogs());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.mealLogs).toHaveLength(1);
      expect(result.current.usingMockData).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fall back to mock data when Supabase fails', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection failed' }
          })
        })
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.usingMockData).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should handle empty database gracefully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.mealLogs).toHaveLength(0);
      expect(result.current.usingMockData).toBe(false);
    });

    it('should handle database exceptions gracefully', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockRejectedValue(new Error('Database connection error'))
        })
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.usingMockData).toBe(true);
      expect(result.current.error).toContain('Database connection error');
    });
  });

  describe('addMealLog', () => {
    it('should add a meal log successfully', async () => {
      const insertMock = vi.fn().mockResolvedValue({
        data: mockDbMealLog,
        error: null
      });
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [],
                error: null
              })
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: insertMock
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newMealLog = {
        recipe_ids: [1],
        item_entries: [],
        meal_name: 'New Test Meal',
        date: '2025-01-15',
        notes: 'New test notes',
        nutrition: { calories: 300, protein: 15, carbs: 40, fat: 10 },
        estimated_cost: 8.00
      };

      await act(async () => {
        await result.current.addMealLog(newMealLog);
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('meal_logs');
      expect(insertMock).toHaveBeenCalled();
    });

    it('should handle add meal log errors', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [],
                error: null
              })
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Insert failed' }
                })
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newMealLog = {
        recipe_ids: [1],
        item_entries: [],
        meal_name: 'Failed Meal',
        date: '2025-01-15',
        notes: 'Failed notes',
        nutrition: { calories: 300, protein: 15, carbs: 40, fat: 10 },
        estimated_cost: 8.00
      };

      await expect(
        act(async () => {
          await result.current.addMealLog(newMealLog);
        })
      ).rejects.toThrow();
    });
  });

  describe('updateMealLog', () => {
    it('should update a meal log successfully', async () => {
      const updateMock = vi.fn().mockResolvedValue({ data: null, error: null });
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbMealLog],
                error: null
              })
            }),
            update: vi.fn().mockReturnValue({
              eq: updateMock
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updatedMealLog = {
        recipe_ids: [1, 3],
        item_entries: [],
        meal_name: 'Updated Test Meal',
        date: '2025-01-15',
        notes: 'Updated notes',
        nutrition: { calories: 400, protein: 20, carbs: 50, fat: 15 },
        estimated_cost: 10.00
      };

      await act(async () => {
        await result.current.updateMealLog(1, updatedMealLog);
      });

      expect(updateMock).toHaveBeenCalled();
    });

    it('should handle update meal log errors', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbMealLog],
                error: null
              })
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' }
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updatedMealLog = {
        recipe_ids: [1],
        item_entries: [],
        meal_name: 'Failed Update',
        date: '2025-01-15',
        notes: 'Failed notes',
        nutrition: { calories: 300, protein: 15, carbs: 40, fat: 10 },
        estimated_cost: 8.00
      };

      await expect(
        act(async () => {
          await result.current.updateMealLog(1, updatedMealLog);
        })
      ).rejects.toThrow();
    });
  });

  describe('deleteMealLog', () => {
    it('should delete a meal log successfully', async () => {
      const deleteMock = vi.fn().mockResolvedValue({ data: null, error: null });
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbMealLog],
                error: null
              })
            }),
            delete: vi.fn().mockReturnValue({
              eq: deleteMock
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteMealLog(1);
      });

      expect(deleteMock).toHaveBeenCalled();
    });

    it('should handle delete meal log errors', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbMealLog],
                error: null
              })
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Delete failed' }
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.deleteMealLog(1);
        })
      ).rejects.toThrow();
    });
  });

  describe('getMealLogsByDateRange', () => {
    it('should filter meal logs by date range', async () => {
      const mealLogs = [
        { ...mockMealLog, id: 1, date: '2025-01-10' },
        { ...mockMealLog, id: 2, date: '2025-01-15' },
        { ...mockMealLog, id: 3, date: '2025-01-20' }
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mealLogs.map(log => ({ ...mockDbMealLog, id: log.id, cooked_at: log.date })),
            error: null
          })
        })
      });

      vi.mocked(typeMappers.dbMealLogToMealLog).mockImplementation((dbLog: any) => 
        mealLogs.find(log => log.id === dbLog.id) || mockMealLog
      );

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const filtered = result.current.getMealLogsByDateRange('2025-01-12', '2025-01-18');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toBe('2025-01-15');
    });
  });

  describe('getRecentMealLogs', () => {
    it('should get recent meal logs within specified days', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);

      const mealLogs = [
        { ...mockMealLog, id: 1, date: today.toISOString().split('T')[0] },
        { ...mockMealLog, id: 2, date: yesterday.toISOString().split('T')[0] },
        { ...mockMealLog, id: 3, date: weekAgo.toISOString().split('T')[0] },
        { ...mockMealLog, id: 4, date: twoWeeksAgo.toISOString().split('T')[0] }
      ];

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mealLogs.map(log => ({ ...mockDbMealLog, id: log.id, cooked_at: log.date })),
            error: null
          })
        })
      });

      vi.mocked(typeMappers.dbMealLogToMealLog).mockImplementation((dbLog: any) => 
        mealLogs.find(log => log.id === dbLog.id) || mockMealLog
      );

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const recent = result.current.getRecentMealLogs(7);
      expect(recent.length).toBeGreaterThan(0);
      expect(recent.length).toBeLessThanOrEqual(3); // Should exclude the two-weeks-ago entry
    });
  });

  describe('reLogMeal', () => {
    it('should re-log an existing meal with today\'s date', async () => {
      const insertMock = vi.fn().mockResolvedValue({
        data: { ...mockDbMealLog, id: 2, cooked_at: '2025-01-15' },
        error: null
      });
      
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbMealLog],
                error: null
              })
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: insertMock
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const existingMealLog = {
        id: 1,
        recipe_ids: [1, 2],
        item_entries: [],
        meal_name: 'Previous Meal',
        date: '2025-01-10',
        notes: 'Previous notes',
        nutrition: { calories: 500, protein: 25, carbs: 60, fat: 20 },
        estimated_cost: 12.50
      };

      await act(async () => {
        await result.current.reLogMeal(existingMealLog);
      });

      expect(insertMock).toHaveBeenCalled();
      expect(vi.mocked(utils.getTodayLocalDate)).toHaveBeenCalled();
    });

    it('should handle re-log meal errors', async () => {
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'meal_logs') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockDbMealLog],
                error: null
              })
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Re-log failed' }
                })
              })
            })
          };
        }
        return mockSupabaseClient;
      });

      const { result } = renderHook(() => useMealLogs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const existingMealLog = {
        id: 1,
        recipe_ids: [1],
        item_entries: [],
        meal_name: 'Failed Re-log',
        date: '2025-01-10',
        notes: 'Failed notes',
        nutrition: { calories: 300, protein: 15, carbs: 40, fat: 10 },
        estimated_cost: 8.00
      };

      await expect(
        act(async () => {
          await result.current.reLogMeal(existingMealLog);
        })
      ).rejects.toThrow();
    });
  });
});