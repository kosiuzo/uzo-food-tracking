import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { useMealPlan, MealType } from '../hooks/useMealPlan';
import { useRecipes } from '../hooks/useRecipes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { addDays, addWeeks, eachDayOfInterval, format, startOfWeek } from 'date-fns';
import { useIsMobile } from '../hooks/use-mobile';

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

function toISODate(d: Date) {
  return d.toISOString().split('T')[0];
}

const Planner = () => {
  const { allRecipes, favorites } = useRecipes();
  const { setMeal, clearMeal, getPlansInRange, usingMockData, loading, error } = useMealPlan();
  const isMobile = useIsMobile();

  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    document.title = 'Meal Planner | Food Tracker';
  }, []);

  const days = useMemo(
    () => eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) }),
    [weekStart]
  );

  const weekRangeISO = {
    start: toISODate(weekStart),
    end: toISODate(addDays(weekStart, 6)),
  };

  const weekPlans = getPlansInRange(weekRangeISO.start, weekRangeISO.end);

  const valueFor = (dateISO: string, meal: MealType) => {
    const entry = weekPlans.find((p) => p.date === dateISO && p.mealType === meal);
    return entry?.recipeId;
  };

  // Build a quick lookup for recipe names
  const recipeMap = useMemo(() => {
    const m = new Map<string, { id: string; name: string }>();
    for (const r of allRecipes) m.set(r.id, { id: r.id, name: r.name });
    return m;
  }, [allRecipes]);

  return (
    <Layout>
      <section className="space-y-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Meal Planner</h1>
            <p className="text-muted-foreground mt-1">
              Plan your weekly meals and organize your recipe collection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setWeekStart((d) => addWeeks(d, -1))}>
              ← Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            >
              This Week
            </Button>
            <Button variant="outline" onClick={() => setWeekStart((d) => addWeeks(d, 1))}>
              Next →
            </Button>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg text-muted-foreground">Loading meal plan...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !usingMockData && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-red-500"></div>
              <div>
                <p className="text-red-800 font-medium">Error loading meal plan</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Reload Page
            </Button>
          </div>
        )}

        {/* Mock Data Indicator */}
        {usingMockData && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-amber-500 mt-0.5"></div>
              <div>
                <p className="text-amber-800 font-medium">Demo Mode</p>
                <p className="text-sm text-amber-700 mt-1">
                  Showing sample meal plans with realistic data. Connect to Supabase to save your real meal plans and sync across devices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content when not loading */}
        {!loading && (
          <>
            {/* Mobile-friendly view */}
            {isMobile ? (
              <div className="space-y-6">
                {days.map((d) => {
                  const dateISO = toISODate(d);
                  return (
                    <Card key={`mobile-${dateISO}`} className="shadow-sm">
                      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
                        <CardTitle className="text-xl text-primary">
                          {format(d, 'EEEE')}
                        </CardTitle>
                        <p className="text-muted-foreground font-medium">
                          {format(d, 'MMMM d, yyyy')}
                        </p>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        {mealTypes.map((meal) => {
                          const currentValue = valueFor(dateISO, meal);
                          const recipeName = currentValue ? recipeMap.get(currentValue)?.name : null;
                          
                          return (
                            <div key={`mobile-${dateISO}-${meal}`} className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                                  {meal}
                                </Badge>
                                {currentValue && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => clearMeal(dateISO, meal)}
                                    className="h-7 px-3 text-xs hover:bg-red-50 hover:text-red-600 ml-auto"
                                  >
                                    Clear
                                  </Button>
                                )}
                              </div>
                              
                              <Select value={currentValue} onValueChange={(val) => setMeal(dateISO, meal, val)}>
                                <SelectTrigger className="w-full h-11 border-2 hover:border-primary/50 transition-colors">
                                  <SelectValue placeholder="Select a recipe">
                                    {recipeName && (
                                      <span className="block text-left font-medium">
                                        {recipeName}
                                      </span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {favorites.length > 0 && (
                                    <SelectGroup>
                                      <SelectLabel className="font-semibold text-primary">⭐ Favorites</SelectLabel>
                                      {favorites.map((r) => (
                                        <SelectItem key={`mobile-fav-${r.id}`} value={r.id}>
                                          <div className="flex items-center gap-2">
                                            <span>⭐</span>
                                            <span>{r.name}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  )}
                                  <SelectGroup>
                                    <SelectLabel className="font-semibold">All Recipes</SelectLabel>
                                    {allRecipes.map((r) => (
                                      <SelectItem key={`mobile-${r.id}`} value={r.id}>
                                        {r.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              
                              {currentValue && (
                                <div className="bg-muted/30 rounded-lg p-3 border-l-4 border-l-primary">
                                  <p className="text-sm font-medium text-primary">
                                    Selected: {recipeName}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Desktop grid view */
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[1200px] lg:min-w-[1400px]">
                      <div
                        className="grid"
                        style={{ gridTemplateColumns: `200px repeat(${days.length}, minmax(200px, 1fr))` }}
                      >
                        {/* Header row */}
                        <div className="px-4 py-3 text-sm font-medium text-muted-foreground border-b">Meal</div>
                        {days.map((d) => (
                          <div key={d.toISOString()} className="px-4 py-3 text-sm font-medium border-b">
                            <div className="font-semibold text-base">{format(d, 'EEE')}</div>
                            <div className="text-muted-foreground text-sm">{format(d, 'MMM d')}</div>
                          </div>
                        ))}

                        {/* Meal rows */}
                        {mealTypes.map((meal, mealIndex) => (
                          <>
                            <div
                              key={`label-${meal}`}
                              className="px-4 py-4 text-sm capitalize text-muted-foreground font-medium border-b bg-muted/30"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                {meal}
                              </div>
                            </div>
                            {days.map((d, dayIndex) => {
                              const dateISO = toISODate(d);
                              const currentValue = valueFor(dateISO, meal);
                              const recipeName = currentValue ? recipeMap.get(currentValue)?.name : null;
                              const isAlternateRow = mealIndex % 2 === 1;
                              
                              return (
                                <div 
                                  key={`${dateISO}-${meal}`} 
                                  className={`border-b p-4 ${isAlternateRow ? 'bg-muted/10' : ''}`}
                                >
                                  <div className="space-y-3">
                                    <Select value={currentValue} onValueChange={(val) => setMeal(dateISO, meal, val)}>
                                      <SelectTrigger className="w-full h-10 text-sm border-2 hover:border-primary/50 transition-colors">
                                        <SelectValue placeholder="Select a recipe">
                                          {recipeName && (
                                            <span className="block text-left">
                                              {recipeName}
                                            </span>
                                          )}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {favorites.length > 0 && (
                                          <SelectGroup>
                                            <SelectLabel className="font-semibold">⭐ Favorites</SelectLabel>
                                            {favorites.map((r) => (
                                              <SelectItem key={`fav-${r.id}`} value={r.id}>
                                                <div className="flex items-center gap-2">
                                                  <span>⭐</span>
                                                  <span>{r.name}</span>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        )}
                                        <SelectGroup>
                                          <SelectLabel className="font-semibold">All Recipes</SelectLabel>
                                          {allRecipes.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                              {r.name}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    
                                    {currentValue && (
                                      <div className="flex items-center justify-between">
                                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                          {recipeName}
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => clearMeal(dateISO, meal)}
                                          className="h-7 px-3 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 border"
                                        >
                                          Clear
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weekly overview - visual summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
              {days.map((d) => {
                const dateISO = toISODate(d);
                return (
                  <article key={`overview-${dateISO}`} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                    <div className="mb-4 text-center">
                      <div className="text-lg font-semibold text-primary">
                        {format(d, 'EEE')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(d, 'MMM d')}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {mealTypes.map((meal) => {
                        const rid = valueFor(dateISO, meal);
                        const name = rid ? recipeMap.get(rid)?.name : undefined;
                        
                        return (
                          <div key={`ovr-${dateISO}-${meal}`} className="space-y-2">
                            <Badge variant="outline" className="capitalize text-xs w-full justify-center py-1">
                              {meal}
                            </Badge>
                            
                            <div className="min-h-[3rem] flex items-center justify-center text-center">
                              {name ? (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-tight">
                                    {name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {rid && favorites.find(f => f.id === rid) ? '⭐ Favorite' : 'Recipe'}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">
                                  Not planned
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Planner;
