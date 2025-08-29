import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRecipes } from '@/hooks/useRecipes';
import { useInventorySearch } from '@/hooks/useInventorySearch';
import { useIsMobile } from '@/hooks/use-mobile';

export default function RecipeViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById } = useRecipes();
  const { allItems } = useInventorySearch();
  const isMobile = useIsMobile();

  // Memoize recipe lookup with proper validation
  const recipe = useMemo(() => {
    if (!id) return undefined;
    const recipeId = Number(id);
    if (isNaN(recipeId)) return undefined;
    return getRecipeById(recipeId);
  }, [id, getRecipeById]);

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [hasError, setHasError] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const toggleStep = useCallback((idx: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setCompletedSteps(new Set());
  }, []);

  const getIngredientName = useCallback((itemId: number) => {
    const item = allItems.find(item => item.id === itemId);
    return item?.name || 'Unknown item';
  }, [allItems]);

  // Handle errors in useEffect to avoid side effects during render
  useEffect(() => {
    if (recipe && recipe.instructions) {
      try {
        recipe.instructions
          .split('\n')
          .map(step => step.trim())
          .filter(Boolean);
        setLoadingError(null);
      } catch (error) {
        setLoadingError('Failed to parse recipe instructions');
        setHasError(true);
      }
    }
  }, [recipe]);

  const retryLoad = useCallback(() => {
    setHasError(false);
    setLoadingError(null);
    // The hooks will automatically refetch data
    window.location.reload();
  }, []);

  if (!recipe) {
    const isInvalidId = id && isNaN(Number(id));
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <header className="p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Back
          </Button>
          <div className="w-12" />
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">
              {isInvalidId ? 'Invalid Recipe ID' : 'Recipe Not Found'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {isInvalidId 
                ? 'The recipe ID provided is not valid.'
                : 'The recipe you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate('/recipes')}>
                Browse Recipes
              </Button>
              <Button variant="ghost" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const steps = useMemo(() => {
    if (!recipe?.instructions) return [];
    return recipe.instructions
      .split('\n')
      .map(step => step.trim())
      .filter(Boolean);
  }, [recipe?.instructions]);

  const completedCount = completedSteps.size;
  const totalSteps = steps.length;

  if (hasError || loadingError) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <header className="p-3 sm:p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-2"
            size={isMobile ? "sm" : "default"}
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="w-8 sm:w-12" />
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              {loadingError || "Something went wrong loading the recipe. Please try again."}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full min-h-[44px] touch-manipulation"
                onClick={retryLoad}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <header className="p-3 sm:p-4 border-b flex items-center justify-between gap-2 sm:gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 sm:gap-2 shrink-0"
          size={isMobile ? "sm" : "default"}
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-base sm:text-lg font-bold truncate text-center flex-1 px-2">
          {recipe.name}
        </h1>
        <div className="w-8 sm:w-12 shrink-0" />
      </header>

      <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-muted-foreground flex justify-center gap-4 sm:gap-6 border-b">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{recipe.servings} servings</span>
        </div>
        {recipe.total_time_minutes && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{recipe.total_time_minutes} min</span>
          </div>
        )}
        {totalSteps > 0 && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{completedCount}/{totalSteps}</span>
            <span className="hidden sm:inline">completed</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="instructions" className="flex-1 flex flex-col">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4">
          <TabsList className="grid w-full grid-cols-2 h-auto" role="tablist">
            <TabsTrigger 
              value="ingredients" 
              className="text-sm sm:text-base py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              role="tab"
              aria-label="View recipe ingredients"
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger 
              value="instructions" 
              className="text-sm sm:text-base py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              role="tab"
              aria-label="View recipe instructions"
            >
              Instructions
              {totalSteps > 0 && (
                <span className="ml-1 text-xs opacity-75">({completedCount}/{totalSteps})</span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="ingredients"
          className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 mt-2 sm:mt-4"
          role="tabpanel"
          aria-label="Recipe ingredients list"
        >
          {recipe.ingredients.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No ingredients listed for this recipe.</p>
            </div>
          ) : (
            <ul className="space-y-2 sm:space-y-3" role="list">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={`ingredient-${ing.item_id}-${i}`}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors min-h-[56px]"
                  role="listitem"
                >
                  <span className="text-sm sm:text-base font-medium text-foreground">
                    {getIngredientName(ing.item_id)}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-primary shrink-0 ml-2">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent
          value="instructions"
          className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 mt-2 sm:mt-4"
          role="tabpanel"
          aria-label="Recipe cooking instructions"
        >
          {steps.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No instructions provided for this recipe.</p>
            </div>
          ) : (
            <>
              {completedCount > 0 && (
                <div className="flex justify-between items-center mb-4 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Progress: {completedCount} of {totalSteps} steps completed
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetProgress}
                    className="text-xs min-h-[36px] touch-manipulation"
                    aria-label="Reset all step progress"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              )}
              <ol className="space-y-3 sm:space-y-4" role="list">
                {steps.map((step, i) => {
                  const isCompleted = completedSteps.has(i);
                  return (
                    <li key={`step-${i}`} role="listitem">
                      <button
                        onClick={() => toggleStep(i)}
                        className={`w-full flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg text-left border transition-all duration-200 touch-manipulation min-h-[56px] ${
                          isCompleted
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 opacity-75'
                            : 'bg-card hover:bg-accent/50 border-border hover:border-accent-foreground/20'
                        }`}
                        aria-pressed={isCompleted}
                        aria-label={`Step ${i + 1}${isCompleted ? ' - completed' : ''}: ${step.replace(/^\d+\.\s*/, '').substring(0, 50)}...`}
                      >
                        <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm transition-colors ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          {i + 1}
                        </span>
                        <span className={`text-sm sm:text-base leading-relaxed transition-all ${
                          isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {step.replace(/^\d+\.\s*/, '')}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

