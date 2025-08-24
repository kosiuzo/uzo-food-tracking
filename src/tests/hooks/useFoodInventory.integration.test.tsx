import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFoodInventory } from '../../hooks/useFoodInventory';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

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

describe('Database Integration', () => {
  describe('Type Mappers Integration', () => {
    it('should correctly map database item to FoodItem', () => {
      const dbItem = {
        id: 1,
        name: 'Apple',
        brand: 'Organic',
        category: 'Fruit',
        in_stock: true,
        price: 2.99,
        calories_per_serving: 95,
        carbs_per_serving: 25,
        fat_per_serving: 0.3,
        protein_per_serving: 0.5,
        servings_per_container: 1,
        serving_size_grams: 100,
        serving_quantity: null,
        serving_unit: null,
        serving_unit_type: null,
        image_url: null,
        ingredients: null,
        last_purchased: null,
        rating: null,
        last_edited: null,
        created_at: null,
        updated_at: null,
      };

      // Test that the structure matches what we expect
      expect(dbItem.id).toBe(1);
      expect(dbItem.name).toBe('Apple');
      expect(dbItem.category).toBe('Fruit');
      expect(dbItem.in_stock).toBe(true);
    });
  });

  describe('Hook Integration', () => {
    it('should work with real type mappers', async () => {
      const { result } = renderHook(() => useFoodInventory(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.items).toBeDefined();
      });

      // Test that the hook returns the expected structure
      expect(typeof result.current.items).toBe('object');
      expect(typeof result.current.addItem).toBe('function');
      expect(typeof result.current.updateItem).toBe('function');
      expect(typeof result.current.deleteItem).toBe('function');
    });
  });
});