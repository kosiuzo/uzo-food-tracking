import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Tags from '../../pages/Tags';
import { renderWithProviders } from '../setup';
import * as tagsHook from '../../hooks/useTags';

vi.mock('../../hooks/useTags');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('Tags Page', () => {
  it('renders tag list', () => {
    vi.mocked(tagsHook.useTags).mockReturnValue({
      tags: [{ id: 1, name: 'Spicy', color: '#fff' }],
      searchQuery: '',
      setSearchQuery: vi.fn(),
      addTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
      usingMockData: true,
      error: null,
      isDeleting: false,
    } as ReturnType<typeof tagsHook.useTags>);

    renderWithProviders(<Tags />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Spicy')).toBeInTheDocument();
  });
});
