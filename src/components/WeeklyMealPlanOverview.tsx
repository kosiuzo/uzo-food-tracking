import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { WeeklyMealPlan, Recipe } from '../types';

interface WeeklyMealPlanOverviewProps {
  weeklyPlan: WeeklyMealPlan;
  allRecipes: Recipe[];
  getDayName: (dayIndex: number) => string;
}

export function WeeklyMealPlanOverview({
  weeklyPlan,
  allRecipes,
  getDayName,
}: WeeklyMealPlanOverviewProps) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getRecipeName = (recipeId: string) => {
    return allRecipes.find(r => r.id === recipeId)?.name || 'Unknown Recipe';
  };

  const getRecipesForDay = (dayIndex: number) => {
    const dayBlocks = weeklyPlan.blocks.filter(
      block => dayIndex >= block.startDay && dayIndex <= block.endDay
    );

    const recipes: { rotation: string; recipes: string[]; notes?: string }[] = [];
    const snacks: string[] = [];

    dayBlocks.forEach(block => {
      block.rotations.forEach(rotation => {
        recipes.push({
          rotation: rotation.name,
          recipes: rotation.recipes,
          notes: rotation.notes,
        });
      });
      if (block.snacks) {
        snacks.push(...block.snacks);
      }
    });

    return { recipes, snacks };
  };

  const getDayClass = (dayIndex: number) => {
    const hasMeals = weeklyPlan.blocks.some(
      block => dayIndex >= block.startDay && dayIndex <= block.endDay
    );
    return hasMeals ? 'bg-primary/5 border-primary/20' : 'bg-muted/30';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          Weekly Meal Plan Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile: Stacked layout */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {DAYS.map((dayName, dayIndex) => {
            const { recipes, snacks } = getRecipesForDay(dayIndex);
            const hasMeals = recipes.length > 0;
            const isInPlan = weeklyPlan.blocks.some(
              block => dayIndex >= block.startDay && dayIndex <= block.endDay
            );

            return (
              <div
                key={dayIndex}
                className={`p-4 rounded-lg border-2 ${
                  isInPlan ? getDayClass(dayIndex) : 'bg-muted/30 border-muted'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="font-semibold text-base text-primary">
                    {dayName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Day {dayIndex + 1}
                  </div>
                </div>

                {hasMeals ? (
                  <div className="space-y-3">
                    {recipes.map((rotation, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-primary flex-shrink-0" />
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {rotation.rotation}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {rotation.recipes.map((recipeId) => (
                            <div
                              key={recipeId}
                              className="text-sm bg-background px-3 py-2 rounded border"
                            >
                              {getRecipeName(recipeId)}
                            </div>
                          ))}
                          {rotation.notes && (
                            <div className="text-sm text-muted-foreground italic px-3">
                              {rotation.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {snacks.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-muted">
                        <div className="text-sm font-medium text-muted-foreground">
                          Snacks:
                        </div>
                        {snacks.map((recipeId) => (
                          <div
                            key={recipeId}
                            className="text-sm bg-muted/50 px-3 py-2 rounded"
                          >
                            {getRecipeName(recipeId)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-sm text-muted-foreground italic text-center">
                      {isInPlan ? 'No meals planned' : 'Not in plan'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid sm:grid-cols-7 gap-2">
          {DAYS.map((dayName, dayIndex) => {
            const { recipes, snacks } = getRecipesForDay(dayIndex);
            const hasMeals = recipes.length > 0;
            const isInPlan = weeklyPlan.blocks.some(
              block => dayIndex >= block.startDay && dayIndex <= block.endDay
            );

            return (
              <div
                key={dayIndex}
                className={`min-h-[200px] p-3 rounded-lg border-2 ${
                  isInPlan ? getDayClass(dayIndex) : 'bg-muted/30 border-muted'
                }`}
              >
                <div className="text-center mb-3">
                  <div className="font-semibold text-sm text-primary">
                    {dayName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Day {dayIndex + 1}
                  </div>
                </div>

                {hasMeals ? (
                  <div className="space-y-3">
                    {recipes.map((rotation, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-1">
                          <UtensilsCrossed className="h-3 w-3 text-primary" />
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {rotation.rotation}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {rotation.recipes.map((recipeId) => (
                            <div
                              key={recipeId}
                              className="text-xs bg-background px-2 py-1 rounded border"
                            >
                              {getRecipeName(recipeId)}
                            </div>
                          ))}
                          {rotation.notes && (
                            <div className="text-xs text-muted-foreground italic px-2">
                              {rotation.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {snacks.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-muted">
                        <div className="text-xs font-medium text-muted-foreground">
                          Snacks:
                        </div>
                        {snacks.map((recipeId) => (
                          <div
                            key={recipeId}
                            className="text-xs bg-muted/50 px-2 py-1 rounded"
                          >
                            {getRecipeName(recipeId)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground italic text-center">
                      {isInPlan ? 'No meals planned' : 'Not in plan'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-muted">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/5 border border-primary/20 rounded"></div>
              <span>Meal days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted/30 border border-muted rounded"></div>
              <span>No meals planned</span>
            </div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-3 w-3 text-primary" />
              <span>Recipe rotation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
