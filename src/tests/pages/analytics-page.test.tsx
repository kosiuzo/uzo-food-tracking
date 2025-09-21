import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Analytics from '../../pages/Analytics';
import { renderWithProviders } from '../setup';
import * as mealLogsHook from '../../hooks/useMealLogs';
import * as inventoryHook from '../../hooks/useInventorySearch';

vi.mock('../../hooks/useMealLogs');
vi.mock('../../hooks/useInventorySearch');
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
    } as ReturnType<typeof mealLogsHook.useMealLogs>);

    vi.mocked(inventoryHook.useInventorySearch).mockReturnValue({
      allItems: [],
      usingMockData: false,
      loading: false,
      error: null,
    } as ReturnType<typeof inventoryHook.useInventorySearch>);

    renderWithProviders(<Analytics />);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    // UI no longer has "Top Categories"; check a stable section instead
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
