import { describe, it, expect, vi } from 'vitest';

// Mock the useFoodInventory hook
vi.mock('../../hooks/useFoodInventory', () => ({
  useFoodInventory: () => ({
    outOfStockItems: [
      {
        id: '1',
        name: 'Milk',
        price: 3.99,
        quantity: 2,
        unit: 'liter',
        category: 'Dairy',
        in_stock: false,
        last_purchased: '2025-01-01', // Previously purchased
      },
      {
        id: '2',
        name: 'Exotic Fruit',
        price: 8.99,
        quantity: 1,
        unit: 'piece',
        category: 'Produce',
        in_stock: false,
        last_purchased: undefined, // Never purchased before
      },
    ],
    updateItem: vi.fn(),
  }),
}));

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { useShoppingList } from '../../hooks/useShoppingList';
import { renderHook } from '@testing-library/react';

describe('useShoppingList Purchase Tracking', () => {
  it('should categorize items by purchase history', () => {
    const { result } = renderHook(() => useShoppingList());
    const { repurchaseItems, newItems } = result.current.getItemsByCategory();

    expect(repurchaseItems).toHaveLength(1);
    expect(repurchaseItems[0].name).toBe('Milk');
    expect(repurchaseItems[0].last_purchased).toBe('2025-01-01');

    expect(newItems).toHaveLength(1);
    expect(newItems[0].name).toBe('Exotic Fruit');
    expect(newItems[0].last_purchased).toBeUndefined();
  });

  it('should identify frequently purchased items sorted by recency', () => {
    const { result } = renderHook(() => useShoppingList());
    const frequentlyPurchased = result.current.getFrequentlyPurchasedItems();

    expect(frequentlyPurchased).toHaveLength(1);
    expect(frequentlyPurchased[0].name).toBe('Milk');
    expect(frequentlyPurchased[0].last_purchased).toBe('2025-01-01');
  });

  it('should handle mixed shopping list with both new and repurchase items', () => {
    const { result } = renderHook(() => useShoppingList());

    expect(result.current.summary.totalItems).toBe(2);
    expect(result.current.summary.estimatedTotal).toBe(16.97); // (3.99 * 2) + (8.99 * 1)

    const { repurchaseItems, newItems } = result.current.getItemsByCategory();
    const totalByCategory = repurchaseItems.length + newItems.length;
    expect(totalByCategory).toBe(2);
  });
});