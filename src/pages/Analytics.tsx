import { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout } from '../components/Layout';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  daily_averages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    days_count: number;
  };
  weekly_averages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    weeks_count: number;
  };
  monthly_averages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    months_count: number;
  };
  calorie_extremes: {
    highest: { date: string; calories: number } | null;
    lowest: { date: string; calories: number } | null;
  };
  summary: {
    total_meals: number;
    days_with_data: number;
  };
}

interface DailyCache {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals_count: number;
}

interface WeeklyCache {
  week_start: string;
  avg_calories: number;
  avg_protein: number;
  avg_carbs: number;
  avg_fat: number;
  days_with_data: number;
}

interface MonthlyCache {
  month_start: string;
  avg_calories: number;
  avg_protein: number;
  avg_carbs: number;
  avg_fat: number;
  days_with_data: number;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentDays, setRecentDays] = useState<DailyCache[]>([]);
  const [recentWeeks, setRecentWeeks] = useState<WeeklyCache[]>([]);
  const [recentMonths, setRecentMonths] = useState<MonthlyCache[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading analytics data from cache system...');

      // Load all data in parallel
      const [
        analyticsResult,
        recentDaysResult,
        recentWeeksResult,
        recentMonthsResult
      ] = await Promise.all([
        // Get aggregated analytics from RPC
        supabase.rpc('get_analytics_data', { p_days_back: 30 }),

        // Get recent 7 days from cache table
        supabase
          .from('daily_analytics_cache')
          .select('*')
          .order('date', { ascending: false })
          .limit(7),

        // Get recent 4 weeks from cache table
        supabase
          .from('weekly_analytics_cache')
          .select('*')
          .order('week_start', { ascending: false })
          .limit(4),

        // Get recent 2 months from cache table
        supabase
          .from('monthly_analytics_cache')
          .select('*')
          .order('month_start', { ascending: false })
          .limit(2)
      ]);

      // Check for errors
      if (analyticsResult.error) {
        throw new Error(`Analytics RPC error: ${analyticsResult.error.message}`);
      }
      if (recentDaysResult.error) {
        throw new Error(`Recent days error: ${recentDaysResult.error.message}`);
      }
      if (recentWeeksResult.error) {
        throw new Error(`Recent weeks error: ${recentWeeksResult.error.message}`);
      }
      if (recentMonthsResult.error) {
        throw new Error(`Recent months error: ${recentMonthsResult.error.message}`);
      }

      console.log('✅ Analytics data loaded successfully');
      console.log('📊 Analytics summary:', analyticsResult.data);
      console.log('📅 Recent days:', recentDaysResult.data?.length);
      console.log('📅 Recent weeks:', recentWeeksResult.data?.length);
      console.log('📅 Recent months:', recentMonthsResult.data?.length);

      setAnalytics(analyticsResult.data);
      setRecentDays(recentDaysResult.data || []);
      setRecentWeeks(recentWeeksResult.data || []);
      setRecentMonths(recentMonthsResult.data || []);
      setUsingMockData(false);

    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      // TODO: Could fallback to mock data here if needed
      setUsingMockData(false);
    } finally {
      setLoading(false);
    }
  };

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
              onClick={loadAnalyticsData}
              className="mt-2"
              variant="outline"
            >
              Retry
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
        {!loading && analytics && (
          <>
            {/* Daily Nutrition Averages */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Averages ({analytics.daily_averages.days_count} days)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.daily_averages.calories}</div>
                  <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.daily_averages.protein}g</div>
                  <div className="text-sm text-muted-foreground">Avg Protein/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{analytics.daily_averages.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Avg Carbs/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.daily_averages.fat}g</div>
                  <div className="text-sm text-muted-foreground">Avg Fat/Day</div>
                </Card>
              </div>

              {/* Recent days breakdown */}
              {recentDays.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent 7 Days</h3>
                  <div className="space-y-2">
                    {recentDays.map((day) => (
                      <Card key={day.date} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{formatDate(day.date)}</div>
                          <div className="text-sm text-muted-foreground">{day.meals_count} meals</div>
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
                Weekly Averages ({analytics.weekly_averages.weeks_count} weeks)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.weekly_averages.calories}</div>
                  <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.weekly_averages.protein}g</div>
                  <div className="text-sm text-muted-foreground">Avg Protein/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{analytics.weekly_averages.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Avg Carbs/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.weekly_averages.fat}g</div>
                  <div className="text-sm text-muted-foreground">Avg Fat/Day</div>
                </Card>
              </div>

              {/* Recent weeks breakdown */}
              {recentWeeks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent 4 Weeks</h3>
                  <div className="space-y-2">
                    {recentWeeks.map((week) => (
                      <Card key={week.week_start} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{formatWeekPeriod(week.week_start)}</div>
                          <div className="text-sm text-muted-foreground">{week.days_with_data} days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{Math.round(week.avg_calories)}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{Math.round(week.avg_protein)}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-orange-600">{Math.round(week.avg_carbs)}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{Math.round(week.avg_fat)}g</div>
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
                Monthly Averages ({analytics.monthly_averages.months_count} months)
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics.monthly_averages.calories}</div>
                  <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.monthly_averages.protein}g</div>
                  <div className="text-sm text-muted-foreground">Avg Protein/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{analytics.monthly_averages.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Avg Carbs/Day</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.monthly_averages.fat}g</div>
                  <div className="text-sm text-muted-foreground">Avg Fat/Day</div>
                </Card>
              </div>

              {/* Recent months breakdown */}
              {recentMonths.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent 2 Months</h3>
                  <div className="space-y-2">
                    {recentMonths.map((month) => (
                      <Card key={month.month_start} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{formatMonthPeriod(month.month_start)}</div>
                          <div className="text-sm text-muted-foreground">{month.days_with_data} days</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{Math.round(month.avg_calories)}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{Math.round(month.avg_protein)}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-orange-600">{Math.round(month.avg_carbs)}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{Math.round(month.avg_fat)}g</div>
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
                {analytics.calorie_extremes.highest && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <ArrowUp className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-red-600">
                          {analytics.calorie_extremes.highest.calories} calories
                        </div>
                        <div className="text-sm text-muted-foreground">Highest Day</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(analytics.calorie_extremes.highest.date)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {analytics.calorie_extremes.lowest && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <ArrowDown className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-blue-600">
                          {analytics.calorie_extremes.lowest.calories} calories
                        </div>
                        <div className="text-sm text-muted-foreground">Lowest Day</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(analytics.calorie_extremes.lowest.date)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {!analytics.calorie_extremes.highest && !analytics.calorie_extremes.lowest && (
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
                  <div className="text-2xl font-bold text-indigo-600">{analytics.summary.total_meals}</div>
                  <div className="text-sm text-muted-foreground">Total Meals Logged</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{analytics.summary.days_with_data}</div>
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