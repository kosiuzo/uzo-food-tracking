import { TrendingUp, Target, Calendar, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layout } from '../components/Layout';
import { useMealLogs } from '../hooks/useMealLogs';
import { MealLog } from '../types';

export default function Analytics() {
  const { mealLogs, usingMockData, loading, error } = useMealLogs();

  // Helper function to get week start (Monday)
  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  // Helper function to get month start
  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  };

  // Group meals by week and month
  const groupMealsByPeriod = () => {
    const weeklyGroups: Record<string, MealLog[]> = {};
    const monthlyGroups: Record<string, MealLog[]> = {};

    mealLogs.forEach(log => {
      const logDate = new Date(log.eaten_on + 'T00:00:00');

      // Group by week (Monday start)
      const weekStart = getWeekStart(new Date(logDate));
      if (!weeklyGroups[weekStart]) {
        weeklyGroups[weekStart] = [];
      }
      weeklyGroups[weekStart].push(log);

      // Group by month
      const monthStart = getMonthStart(logDate);
      if (!monthlyGroups[monthStart]) {
        monthlyGroups[monthStart] = [];
      }
      monthlyGroups[monthStart].push(log);
    });

    return { weeklyGroups, monthlyGroups };
  };

  const { weeklyGroups, monthlyGroups } = groupMealsByPeriod();

  // Group meals by individual days
  const groupMealsByDay = () => {
    const dailyGroups: Record<string, MealLog[]> = {};

    mealLogs.forEach(log => {
      const date = log.eaten_on;
      if (!dailyGroups[date]) {
        dailyGroups[date] = [];
      }
      dailyGroups[date].push(log);
    });

    return dailyGroups;
  };

  const dailyGroups = groupMealsByDay();

  // Calculate nutrition stats for grouped periods
  const calculatePeriodAverages = (groups: Record<string, MealLog[]>) => {
    const periods = Object.entries(groups).map(([periodStart, logs]) => {
      // Calculate daily totals for this period
      const dailyTotals: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {};

      logs.forEach(log => {
        const date = log.eaten_on;
        if (!dailyTotals[date]) {
          dailyTotals[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
        dailyTotals[date].calories += log.macros.calories;
        dailyTotals[date].protein += log.macros.protein;
        dailyTotals[date].carbs += log.macros.carbs;
        dailyTotals[date].fat += log.macros.fat;
      });

      // Calculate averages for this period
      const dailyValues = Object.values(dailyTotals);
      const daysCount = dailyValues.length;

      if (daysCount === 0) {
        return {
          periodStart,
          avgCalories: 0,
          avgProtein: 0,
          avgCarbs: 0,
          avgFat: 0,
          daysWithData: 0
        };
      }

      const totals = dailyValues.reduce(
        (acc, day) => ({
          calories: acc.calories + day.calories,
          protein: acc.protein + day.protein,
          carbs: acc.carbs + day.carbs,
          fat: acc.fat + day.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        periodStart,
        avgCalories: totals.calories / daysCount,
        avgProtein: totals.protein / daysCount,
        avgCarbs: totals.carbs / daysCount,
        avgFat: totals.fat / daysCount,
        daysWithData: daysCount
      };
    });

    // Calculate overall averages across all periods
    if (periods.length === 0) {
      return {
        periods: [],
        overallAvg: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        periodsCount: 0
      };
    }

    const overallTotals = periods.reduce(
      (acc, period) => ({
        calories: acc.calories + period.avgCalories,
        protein: acc.protein + period.avgProtein,
        carbs: acc.carbs + period.avgCarbs,
        fat: acc.fat + period.avgFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      periods: periods.sort((a, b) => b.periodStart.localeCompare(a.periodStart)), // Most recent first
      overallAvg: {
        calories: overallTotals.calories / periods.length,
        protein: overallTotals.protein / periods.length,
        carbs: overallTotals.carbs / periods.length,
        fat: overallTotals.fat / periods.length,
      },
      periodsCount: periods.length
    };
  };

  // Calculate daily totals (simpler since each "period" is one day)
  const calculateDailyTotals = (groups: Record<string, MealLog[]>) => {
    const days = Object.entries(groups).map(([date, logs]) => {
      const totals = logs.reduce(
        (acc, log) => ({
          calories: acc.calories + log.macros.calories,
          protein: acc.protein + log.macros.protein,
          carbs: acc.carbs + log.macros.carbs,
          fat: acc.fat + log.macros.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        date,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        mealsCount: logs.length
      };
    });

    // Calculate overall averages
    if (days.length === 0) {
      return {
        days: [],
        overallAvg: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        daysCount: 0
      };
    }

    const overallTotals = days.reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return {
      days: days.sort((a, b) => b.date.localeCompare(a.date)), // Most recent first
      overallAvg: {
        calories: overallTotals.calories / days.length,
        protein: overallTotals.protein / days.length,
        carbs: overallTotals.carbs / days.length,
        fat: overallTotals.fat / days.length,
      },
      daysCount: days.length
    };
  };

  const dailyAnalytics = calculateDailyTotals(dailyGroups);
  const weeklyAnalytics = calculatePeriodAverages(weeklyGroups);
  const monthlyAnalytics = calculatePeriodAverages(monthlyGroups);

  // Find highest and lowest calorie days
  const getCalorieExtremes = (logs: MealLog[]) => {
    if (logs.length === 0) return { highest: null, lowest: null };

    // Group by date and sum calories per day
    const dailyCalories = logs.reduce((acc, log) => {
      const date = log.eaten_on;
      acc[date] = (acc[date] || 0) + log.macros.calories;
      return acc;
    }, {} as Record<string, number>);

    const entries = Object.entries(dailyCalories);
    if (entries.length === 0) return { highest: null, lowest: null };

    const sorted = entries.sort(([,a], [,b]) => b - a);

    return {
      highest: { date: sorted[0][0], calories: sorted[0][1] },
      lowest: { date: sorted[sorted.length - 1][0], calories: sorted[sorted.length - 1][1] }
    };
  };

  const calorieExtremes = getCalorieExtremes(mealLogs);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format week period for display
  const formatWeekPeriod = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // Format month period for display
  const formatMonthPeriod = (monthStart: string) => {
    const date = new Date(monthStart);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Your food tracking insights</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !usingMockData && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">Error loading analytics data: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-2"
              variant="outline"
            >
              Reload Page
            </Button>
          </div>
        )}

        {/* Mock Data Indicator */}
        {usingMockData && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <p className="text-sm text-amber-800">
                <strong>Demo Mode:</strong> Showing sample analytics with realistic data. 
                Connect to Supabase to see your real food tracking insights and history.
              </p>
            </div>
          </div>
        )}

        {/* Content when not loading */}
        {!loading && (
          <>
            {/* Daily Nutrition Totals */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Averages ({dailyAnalytics.daysCount} days)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(dailyAnalytics.overallAvg.calories)}</div>
                  <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(dailyAnalytics.overallAvg.protein)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Protein/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(dailyAnalytics.overallAvg.carbs)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Carbs/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(dailyAnalytics.overallAvg.fat)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Fat/Day</div>
                </Card>
              </div>

              {/* Recent days breakdown */}
              {dailyAnalytics.days.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Days</h3>
                  <div className="space-y-2">
                    {dailyAnalytics.days.slice(0, 7).map((day) => (
                      <Card key={day.date} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{formatDate(day.date)}</div>
                          <div className="text-sm text-muted-foreground">{day.mealsCount} meals</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{Math.round(day.calories)}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{Math.round(day.protein)}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-orange-600">{Math.round(day.carbs)}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{Math.round(day.fat)}g</div>
                            <div className="text-muted-foreground">fat</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Weekly Nutrition Averages */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Averages ({weeklyAnalytics.periodsCount} weeks)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(weeklyAnalytics.overallAvg.calories)}</div>
                  <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(weeklyAnalytics.overallAvg.protein)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Protein/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(weeklyAnalytics.overallAvg.carbs)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Carbs/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(weeklyAnalytics.overallAvg.fat)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Fat/Day</div>
                </Card>
              </div>

              {/* Recent weeks breakdown */}
              {weeklyAnalytics.periods.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Weeks</h3>
                  <div className="space-y-2">
                    {weeklyAnalytics.periods.slice(0, 3).map((week) => (
                      <Card key={week.periodStart} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{formatWeekPeriod(week.periodStart)}</div>
                          <div className="text-sm text-muted-foreground">{week.daysWithData} days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{Math.round(week.avgCalories)}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{Math.round(week.avgProtein)}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-orange-600">{Math.round(week.avgCarbs)}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{Math.round(week.avgFat)}g</div>
                            <div className="text-muted-foreground">fat</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Monthly Nutrition Averages */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Monthly Averages ({monthlyAnalytics.periodsCount} months)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(monthlyAnalytics.overallAvg.calories)}</div>
                  <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(monthlyAnalytics.overallAvg.protein)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Protein/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(monthlyAnalytics.overallAvg.carbs)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Carbs/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(monthlyAnalytics.overallAvg.fat)}g</div>
                  <div className="text-sm text-muted-foreground">Avg Fat/Day</div>
                </Card>
              </div>

              {/* Recent months breakdown */}
              {monthlyAnalytics.periods.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Months</h3>
                  <div className="space-y-2">
                    {monthlyAnalytics.periods.slice(0, 3).map((month) => (
                      <Card key={month.periodStart} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{formatMonthPeriod(month.periodStart)}</div>
                          <div className="text-sm text-muted-foreground">{month.daysWithData} days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{Math.round(month.avgCalories)}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{Math.round(month.avgProtein)}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-orange-600">{Math.round(month.avgCarbs)}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{Math.round(month.avgFat)}g</div>
                            <div className="text-muted-foreground">fat</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Calorie Extremes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5" />
                Calorie Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calorieExtremes.highest && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <ArrowUp className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-red-600">
                          {Math.round(calorieExtremes.highest.calories)} calories
                        </div>
                        <div className="text-sm text-muted-foreground">Highest Day</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(calorieExtremes.highest.date)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {calorieExtremes.lowest && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <ArrowDown className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-blue-600">
                          {Math.round(calorieExtremes.lowest.calories)} calories
                        </div>
                        <div className="text-sm text-muted-foreground">Lowest Day</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(calorieExtremes.lowest.date)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {!calorieExtremes.highest && !calorieExtremes.lowest && (
                  <Card className="p-4 col-span-full text-center">
                    <div className="text-muted-foreground">No meal data available</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Start logging meals to see your calorie records
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Summary
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{mealLogs.length}</div>
                  <div className="text-sm text-muted-foreground">Total Meals Logged</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {new Set(mealLogs.map(log => log.eaten_on)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Days with Data</div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}