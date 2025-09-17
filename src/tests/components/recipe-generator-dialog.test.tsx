import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { RecipeGeneratorDialog } from '../../components/RecipeGeneratorDialog';
import { renderWithProviders } from '../setup';
import { openRouterClient } from '../../lib/openrouter';

vi.mock('../../hooks/useInventorySearch');
vi.mock('../../hooks/useTags');
vi.mock('../../hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../../components/ui/grouped-multi-select', () => ({
  GroupedMultiSelect: ({ onValueChange }: { onValueChange: (value: string[]) => void }) => (
    <button onClick={() => onValueChange(['item1'])}>Select Ingredient</button>
  ),
}));
vi.mock('../../lib/servingUnitUtils', () => ({
  calculateRecipeNutrition: vi.fn(() => ({
    calories_per_serving: 100,
    protein_per_serving: 10,
    carbs_per_serving: 20,
    fat_per_serving: 5,
  })),
}));

import * as inventoryHook from '../../hooks/useInventorySearch';
import * as tagsHook from '../../hooks/useTags';

describe('RecipeGeneratorDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(inventoryHook.useInventorySearch).mockReturnValue({
      allItems: [{ id: 'item1', name: 'Tomato', in_stock: true }],
    } as ReturnType<typeof inventoryHook.useFoodInventory>);
    vi.mocked(tagsHook.useTags).mockReturnValue({
      allTags: [{ id: 'tag1', name: 'Vegan' }],
    } as ReturnType<typeof tagsHook.useTags>);

    vi.spyOn(openRouterClient, 'makeRequestWithRetry').mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              name: 'AI Salad',
              instructions: 'Mix ingredients.',
              servings: 2,
              total_time_minutes: 10,
              ingredient_list: ['2 cups lettuce', '1 tomato'],
              nutrition: {
                calories_per_serving: 150,
                protein_per_serving: 5,
                carbs_per_serving: 12,
                fat_per_serving: 8,
              },
              tags: ['Vegan'],
            }),
          },
        },
      ],
    });
  });

  it('generates a recipe and calls onRecipeGenerated when accepted', async () => {
    const onRecipeGenerated = vi.fn();
    renderWithProviders(
      <RecipeGeneratorDialog
        open={true}
        onOpenChange={vi.fn()}
        onRecipeGenerated={onRecipeGenerated}
      />
    );

    fireEvent.click(screen.getByText('Select Ingredient'));
    fireEvent.click(screen.getByRole('button', { name: /generate recipe/i }));

    await waitFor(() => expect(openRouterClient.makeRequestWithRetry).toHaveBeenCalled());

    await screen.findByText('AI Salad');

    fireEvent.click(screen.getByRole('button', { name: /accept & save recipe/i }));

    expect(onRecipeGenerated).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'AI Salad' })
    );
  });
});
