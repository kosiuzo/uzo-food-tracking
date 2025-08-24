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

describe('Food Inventory Database Integration', () => {
  it('should work with the useFoodInventory hook', async () => {
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