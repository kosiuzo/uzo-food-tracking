import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Analytics from '../../pages/Analytics';
import { renderWithProviders } from '../setup';
import * as mealLogsHook from '../../hooks/useMealLogs';
import * as inventoryHook from '../../hooks/useFoodInventory';

vi.mock('../../hooks/useMealLogs');
vi.mock('../../hooks/useFoodInventory');
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('Analytics Page', () => {
  it('renders analytics summary', () => {
    vi.mocked(mealLogsHook.useMealLogs).mockReturnValue({
      mealLogs: [],
      getRecentMealLogs: () => [],
      usingMockData: false,
      loading: false,
      error: null,
      addMealLog: vi.fn(),
      updateMealLog: vi.fn(),
      deleteMealLog: vi.fn(),
      reLogMeal: vi.fn(),
      getMealLogsByDateRange: vi.fn(),
      refetch: vi.fn(),
    } as any);

    vi.mocked(inventoryHook.useFoodInventory).mockReturnValue({
      allItems: [],
      usingMockData: false,
      loading: false,
      error: null,
    } as any);

    renderWithProviders(<Analytics />);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Top Categories')).toBeInTheDocument();
  });
});
