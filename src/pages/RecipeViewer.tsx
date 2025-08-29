import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRecipes } from '../hooks/useRecipes';
import { useInventorySearch } from '../hooks/useInventorySearch';

export default function RecipeViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById } = useRecipes();
  const { allItems } = useInventorySearch();

  const recipe = id ? getRecipeById(Number(id)) : undefined;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const getIngredientName = (itemId: number) =>
    allItems.find(item => item.id === itemId)?.name || 'Unknown item';

  if (!recipe) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <p className="text-center">Recipe not found.</p>
      </div>
    );
  }

  const steps = recipe.instructions
    .split('\n')
    .map(step => step.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 border-b flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <h1 className="text-lg font-bold truncate max-w-[60%] text-center">
          {recipe.name}
        </h1>
        <div className="w-12" />
      </header>

      <div className="px-4 py-2 text-sm text-muted-foreground flex justify-center gap-6">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {recipe.servings} servings
        </div>
        {recipe.total_time_minutes && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.total_time_minutes} min
          </div>
        )}
      </div>

      <Tabs defaultValue="instructions" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ingredients" className="text-lg py-3">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="instructions" className="text-lg py-3">
            Instructions
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="ingredients"
          className="flex-1 overflow-y-auto p-4"
        >
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border text-lg"
              >
                <span>{getIngredientName(ing.item_id)}</span>
                <span className="font-medium">
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent
          value="instructions"
          className="flex-1 overflow-y-auto p-4"
        >
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i}>
                <button
                  onClick={() => toggleStep(i)}
                  className={`w-full flex items-start gap-4 p-4 rounded-lg text-left border transition-colors ${
                    completedSteps.has(i)
                      ? 'bg-green-50 line-through opacity-60'
                      : 'bg-background'
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {i + 1}
                  </span>
                  <span className="text-lg leading-relaxed">
                    {step.replace(/^\d+\.\s*/, '')}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </div>
  );
}

