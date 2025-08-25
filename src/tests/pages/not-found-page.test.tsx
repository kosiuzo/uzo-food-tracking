import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import NotFound from '../../pages/NotFound';
import { renderWithProviders } from '../setup';

describe('NotFound Page', () => {
  it('shows 404 message', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });
});
