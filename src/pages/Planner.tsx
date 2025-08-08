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
import { addDays, addWeeks, eachDayOfInterval, format, startOfWeek } from 'date-fns';

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

function toISODate(d: Date) {
  return d.toISOString().split('T')[0];
}

const Planner = () => {
  const { allRecipes, favorites } = useRecipes();
  const { setMeal, clearMeal, getPlansInRange } = useMealPlan();

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

  return (
    <Layout>
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Meal Planner</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setWeekStart((d) => addWeeks(d, -1))}>
              Previous
            </Button>
            <Button variant="secondary" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
              This Week
            </Button>
            <Button variant="outline" onClick={() => setWeekStart((d) => addWeeks(d, 1))}>
              Next
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid" style={{ gridTemplateColumns: `160px repeat(${days.length}, minmax(120px, 1fr))` }}>
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Meal</div>
                  {days.map((d) => (
                    <div key={d.toISOString()} className="px-3 py-2 text-sm font-medium">
                      <div>{format(d, 'EEE')}</div>
                      <div className="text-muted-foreground text-xs">{format(d, 'MM/dd')}</div>
                    </div>
                  ))}

                  {mealTypes.map((meal) => (
                    <>
                      <div key={`label-${meal}`} className="border-t px-3 py-3 text-sm capitalize text-muted-foreground">
                        {meal}
                      </div>
                      {days.map((d) => {
                        const dateISO = toISODate(d);
                        const currentValue = valueFor(dateISO, meal);
                        return (
                          <div key={`${dateISO}-${meal}`} className="border-t p-2">
                            <div className="flex items-center gap-2">
                              <Select
                                value={currentValue}
                                onValueChange={(val) => setMeal(dateISO, meal, val)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a recipe" />
                                </SelectTrigger>
                                <SelectContent>
                                  {favorites.length > 0 && (
                                    <SelectGroup>
                                      <SelectLabel>Favorites</SelectLabel>
                                      {favorites.map((r) => (
                                        <SelectItem key={`fav-${r.id}`} value={r.id}>
                                          {r.name}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  )}
                                  <SelectGroup>
                                    <SelectLabel>All Recipes</SelectLabel>
                                    {allRecipes.map((r) => (
                                      <SelectItem key={r.id} value={r.id}>
                                        {r.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {currentValue && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => clearMeal(dateISO, meal)}
                                >
                                  Clear
                                </Button>
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
      </section>
    </Layout>
  );
};

export default Planner;
