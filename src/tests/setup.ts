import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase client for tests
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn((tableName) => {
      // Mock different table behaviors
      if (tableName === 'weekly_meal_plans') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({
                data: null, // No existing plan
                error: { code: 'PGRST116' } // No rows returned
              }))
            }))
          })),
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => ({
                data: { id: 1, week_start: '2024-01-15' },
                error: null
              }))
            }))
          }))
        };
      }
      
      if (tableName === 'meal_plan_blocks') {
        return {
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => ({
                data: { id: 999, name: 'Test Block', start_day: 0, end_day: 2 },
                error: null
              }))
            }))
          })),
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null
            }))
          })),
          delete: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        };
      }
      
      if (tableName === 'recipe_rotations') {
        return {
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => ({
                data: { id: 888, name: 'New Rotation', notes: 'Test rotation' },
                error: null
              }))
            }))
          })),
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null
            }))
          })),
          delete: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        };
      }
      
      if (tableName === 'rotation_recipes') {
        return {
          insert: vi.fn(() => ({
            data: null,
            error: null
          })),
          delete: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null
            }))
          }))
        };
      }
      
      if (tableName === 'block_snacks') {
        return {
          insert: vi.fn(() => ({
            data: null,
            error: null
          }))
        };
      }
      
      // Default mock for other tables
      return {
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [],
            error: null,
          })),
          single: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        })),
      };
    }),
  },
}));