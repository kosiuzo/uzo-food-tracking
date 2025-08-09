import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShoppingList } from '../../hooks/useShoppingList';
import { FoodItem } from '../../types';

// Mock the useFoodInventory hook
vi.mock('../../hooks/useFoodInventory', () => ({
  useFoodInventory: () => ({
    outOfStockItems: mockOutOfStockItems,
    updateItem: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { purchase_count: 0 }, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

// Test data with prices
const mockOutOfStockItems: FoodItem[] = [
  {
    id: '1',
    name: 'Sweet Potato',
    category: 'Vegetables',
    in_stock: false,
    unit: 'piece',
    quantity: 2,
    price: 2.99,
    nutrition: {
      calories_per_100g: 86,
      protein_per_100g: 1.6,
      carbs_per_100g: 20,
      fat_per_100g: 0.1,
      fiber_per_100g: 3.0,
    },
    last_edited: '2025-08-09T00:00:00Z',
  },
  {
    id: '2',
    name: 'Spinach',
    category: 'Vegetables',
    in_stock: false,
    unit: 'cup',
    quantity: 1,
    price: 2.49,
    nutrition: {
      calories_per_100g: 23,
      protein_per_100g: 2.9,
      carbs_per_100g: 3.6,
      fat_per_100g: 0.4,
      fiber_per_100g: 2.2,
    },
    last_edited: '2025-08-09T00:00:00Z',
  },
  {
    id: '3',
    name: 'Chicken Breast',
    category: 'Protein',
    in_stock: false,
    unit: 'piece',
    quantity: 1,
    // No price - should be counted as item without price
    nutrition: {
      calories_per_100g: 165,
      protein_per_100g: 31,
      carbs_per_100g: 0,
      fat_per_100g: 3.6,
      fiber_per_100g: 0,
    },
    last_edited: '2025-08-09T00:00:00Z',
  },
];

describe('useShoppingList - Price Calculations', () => {
  it('should calculate estimated total correctly when items have prices', () => {
    const { result } = renderHook(() => useShoppingList());

    expect(result.current.summary.totalItems).toBe(3);
    expect(result.current.summary.estimatedTotal).toBe(8.47); // (2.99 * 2) + (2.49 * 1) + (0 * 1)
    expect(result.current.summary.itemsWithoutPrices).toBe(1); // Chicken Breast has no price
  });

  it('should calculate individual item total correctly', () => {
    const { result } = renderHook(() => useShoppingList());

    const sweetPotatoTotal = result.current.getItemTotal(mockOutOfStockItems[0]);
    const spinachTotal = result.current.getItemTotal(mockOutOfStockItems[1]);
    const chickenTotal = result.current.getItemTotal(mockOutOfStockItems[2]);

    expect(sweetPotatoTotal).toBe(5.98); // 2.99 * 2
    expect(spinachTotal).toBe(2.49); // 2.49 * 1
    expect(chickenTotal).toBe(0); // undefined price should default to 0
  });
});