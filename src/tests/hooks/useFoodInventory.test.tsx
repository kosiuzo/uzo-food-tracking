import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFoodInventory } from '../../hooks/useFoodInventory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock the mockData
vi.mock('../../data/mockData', () => ({
  mockFoodItems: [
    {
      id: 1,
      name: 'Apple',
      brand: 'Organic Brand',
      category: 'Fruit',
      in_stock: true,
      price: 2.99,
      serving_size: 100,
      image_url: 'https://example.com/apple.jpg',
      nutrition: {
        calories_per_serving: 95,
        protein_per_serving: 0.5,
        carbs_per_serving: 25,
        fat_per_serving: 0.3,
        fiber_per_serving: 0,
      },
      last_edited: '2025-01-01T00:00:00Z',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
}));

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

// Create a wrapper component for the hook
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('useFoodInventory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load items on mount', async () => {
    const { result } = renderHook(() => useFoodInventory(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });

    expect(result.current.items[0].name).toBe('Apple');
  });

  it('should provide the expected interface', async () => {
    const { result } = renderHook(() => useFoodInventory(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.items).toBeDefined();
    });

    // Test that the hook returns the expected structure
    expect(Array.isArray(result.current.items)).toBe(true);
    expect(Array.isArray(result.current.allItems)).toBe(true);
    expect(typeof result.current.loading).toBe('boolean');
    expect(typeof result.current.usingMockData).toBe('boolean');
    expect(typeof result.current.searchQuery).toBe('string');
    expect(typeof result.current.categoryFilter).toBe('string');
    expect(typeof result.current.stockFilter).toBe('string');
    expect(typeof result.current.ratingFilter).toBe('string');
    expect(Array.isArray(result.current.categories)).toBe(true);
    expect(Array.isArray(result.current.outOfStockItems)).toBe(true);
    
    // Test that functions exist
    expect(typeof result.current.addItem).toBe('function');
    expect(typeof result.current.updateItem).toBe('function');
    expect(typeof result.current.deleteItem).toBe('function');
    expect(typeof result.current.toggleStock).toBe('function');
    expect(typeof result.current.setCategoryFilter).toBe('function');
    expect(typeof result.current.setSearchQuery).toBe('function');
    expect(typeof result.current.setStockFilter).toBe('function');
    expect(typeof result.current.setRatingFilter).toBe('function');
    expect(typeof result.current.performSearch).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });


});