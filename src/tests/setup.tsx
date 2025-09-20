import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock window.matchMedia for mobile hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock OpenRouter client before other imports
vi.mock('../lib/openrouter', () => ({
  openRouterClient: {
    makeRequest: vi.fn(),
    makeRequestWithRetry: vi.fn(),
    getDebugInfo: vi.fn(() => ({
      message: 'Debug info only available in development mode',
      errors: [],
      successfulCalls: [],
      apiKeyConfigured: true,
      environment: 'test'
    })),
    clearDebugLogs: vi.fn()
  },
  OpenRouterErrorType: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    AUTH_ERROR: 'AUTH_ERROR',
    RATE_LIMIT: 'RATE_LIMIT',
    JSON_PARSE_ERROR: 'JSON_PARSE_ERROR',
    RESPONSE_VALIDATION_ERROR: 'RESPONSE_VALIDATION_ERROR',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    MODEL_ERROR: 'MODEL_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    API_ERROR: 'API_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  }
}));

// Create a custom render function that includes providers
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

// Mock Supabase client for tests
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({
        data: { session: null },
        error: null
      })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signUp: vi.fn(() => Promise.resolve({ error: null })),
      signInWithPassword: vi.fn(() => Promise.resolve({ error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      resetPasswordForEmail: vi.fn(() => Promise.resolve({ error: null })),
    },
    from: vi.fn((tableName) => {
      // Mock different table behaviors
      if (tableName === 'weekly_meal_plans') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => {
                throw new Error('Mocked database error'); // Force fallback to mock data
              })
            })),
            order: vi.fn(() => ({
              data: [
                { week_start: '2024-01-15' },
                { week_start: '2024-01-08' }
              ],
              error: null
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