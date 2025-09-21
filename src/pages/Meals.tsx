import { useState } from 'react';
import { Plus, Calendar, Utensils, Edit, Trash2, Clock, Search, ChevronDown, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Layout } from '../components/Layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogMealDialog } from '../components/LogMealDialog';
import { MealRelogDialog } from '../components/MealRelogDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useMealLogs } from '../hooks/useMealLogs';
import { useToast } from '@/hooks/use-toast';
import { MealLog } from '../types';
import { logger } from '@/lib/logger';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getTodayLocalDate, getYesterdayLocalDate, getCurrentWeekRange, getLastWeekRange, formatDateStringForDisplay } from '@/lib/utils';

export default function Meals() {
  const { mealLogs, addMealLog, addMealLogFromItems, addBatchMealLogsFromItems, updateMealLog, deleteMealLog, reLogMeal, usingMockData, error, loading } = useMealLogs();
  const { toast } = useToast();
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isRelogDialogOpen, setIsRelogDialogOpen] = useState(false);
  const [editingMealLog, setEditingMealLog] = useState<MealLog | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; mealLog: MealLog | null }>({ open: false, mealLog: null });
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalDate());
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  // Debug logging (no-op in production)
  logger.debug('Meals component render:', { loading, mealLogs: mealLogs?.length, error, usingMockData });

  // Ensure mealLogs is always an array
  const safeMealLogs = Array.isArray(mealLogs) ? mealLogs : [];

  // Filter meals by selected date, date range, or show all if no filter
  const filteredMeals = selectedDate
    ? safeMealLogs.filter(log => {
        return log.eaten_on === selectedDate;
      })
    : dateRange
    ? safeMealLogs.filter(log => {
        return log.eaten_on >= dateRange.start && log.eaten_on <= dateRange.end;
      })
    : safeMealLogs;

  const recentLogs = filteredMeals.slice(0, 20); // Show last 20 meals from filtered results

  const formatDate = (eatenOn: string) => {
    if (!eatenOn) return 'Unknown Date';
    const todayLocal = getTodayLocalDate();
    const yesterdayLocal = getYesterdayLocalDate();

    if (eatenOn === todayLocal) {
      return 'Today';
    } else if (eatenOn === yesterdayLocal) {
      return 'Yesterday';
    } else {
      // Format the date string for display
      const date = new Date(eatenOn + 'T00:00:00'); // Add time to avoid timezone issues
      return date.toLocaleDateString();
    }
  };

  const handleDeleteMealLog = async () => {
    if (!deleteConfirm.mealLog) return;
    
    try {
      await deleteMealLog(deleteConfirm.mealLog.id);
      toast({
        title: 'Meal deleted',
        description: `${deleteConfirm.mealLog.meal_name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete meal log. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReLogMeal = async (mealLog: MealLog, multiplier: number = 1, notes?: string, eatenOn?: string) => {
    try {
      await reLogMeal(mealLog, multiplier, notes, eatenOn);
      toast({
        title: 'Meal re-logged',
        description: `${mealLog.meal_name} has been logged for ${eatenOn || 'today'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to re-log meal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Allow relogging any meal unlimited times
  const isMealLoggedToday = (mealLog: MealLog) => {
    // Always return false so relog button is never disabled
    return false;
  };

  // Calculate nutrition aggregates
  const totalCalories = filteredMeals.reduce((sum, log) => sum + (log.macros?.calories || 0), 0);
  const totalProtein = filteredMeals.reduce((sum, log) => sum + (log.macros?.protein || 0), 0);
  const totalCarbs = filteredMeals.reduce((sum, log) => sum + (log.macros?.carbs || 0), 0);
  const totalFat = filteredMeals.reduce((sum, log) => sum + (log.macros?.fat || 0), 0);
  const totalMacros = totalProtein + totalCarbs + totalFat;

  const proteinPercentage = totalMacros > 0 ? (totalProtein / totalMacros * 100) : 0;
  const carbsPercentage = totalMacros > 0 ? (totalCarbs / totalMacros * 100) : 0;
  const fatPercentage = totalMacros > 0 ? (totalFat / totalMacros * 100) : 0;

  // Sample daily targets (can be made configurable later)
  const calorieTarget = 2000;
  const caloriesPercent = Math.min((totalCalories / calorieTarget) * 100, 100);

  const getDateLabel = () => {
    if (selectedDate === getTodayLocalDate()) return 'Today ▾';
    if (selectedDate === getYesterdayLocalDate()) return 'Yesterday ▾';
    if (dateRange) {
      if (JSON.stringify(dateRange) === JSON.stringify(getCurrentWeekRange())) return 'This Week ▾';
      if (JSON.stringify(dateRange) === JSON.stringify(getLastWeekRange())) return 'Last Week ▾';
      return `${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)} ▾`;
    }
    if (selectedDate) return `${formatDateStringForDisplay(selectedDate)} ▾`;
    return 'All Time ▾';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">

        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Date Pill */}
            <Sheet open={isDateSheetOpen} onOpenChange={setIsDateSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" className="gap-2 rounded-full h-10">
                  {getDateLabel()}
                </Button>
              </SheetTrigger>

              <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
                <SheetHeader>
                  <SheetTitle>Filter by Date</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Quick select</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["Today", "Yesterday", "This Week", "Last Week"].map(option => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => {
                            if (option === "Today") {
                              setSelectedDate(getTodayLocalDate());
                              setDateRange(null);
                            } else if (option === "Yesterday") {
                              setSelectedDate(getYesterdayLocalDate());
                              setDateRange(null);
                            } else if (option === "This Week") {
                              setSelectedDate('');
                              setDateRange(getCurrentWeekRange());
                            } else if (option === "Last Week") {
                              setSelectedDate('');
                              setDateRange(getLastWeekRange());
                            }
                            setIsDateSheetOpen(false);
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Pick a date</h4>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setDateRange(null);
                      }}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setIsDateSheetOpen(false)}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDate('');
                        setDateRange(null);
                        setIsDateSheetOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogDialogOpen(true)}
              className="gap-2"
              aria-label="Log a new meal"
            >
              <Plus className="h-4 w-4" />
              Log Meal
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading meal logs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !usingMockData && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">Error loading meal logs: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-2"
              variant="outline"
            >
              Reload Page
            </Button>
          </div>
        )}

        {/* Content when not loading */}
        {!loading && (
          <>
            {/* Mock Data Indicator - Only show when actually using mock data due to connection issues */}
            {usingMockData && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <p className="text-sm text-amber-800">
                    <strong>Demo Mode:</strong> Cannot connect to database. Showing sample meal logs. 
                    {error && <span className="block mt-1">Error: {error}</span>}
                  </p>
                </div>
              </div>
            )}

            {/* KPI Stack */}
            <div className="px-4 pt-4 space-y-4">
              {/* Calories KPI - Dominant Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Calories</h3>
                    <div className="text-3xl font-bold text-primary">
                      {totalCalories.toFixed(0)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      of {calorieTarget} target
                    </p>
                  </div>
                  <div className="relative w-20 h-20">
                    {/* Ring gauge */}
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted-foreground/20"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(caloriesPercent / 100) * 188.4} 188.4`}
                        className="text-primary transition-all duration-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium">{caloriesPercent.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Macros Row */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-600">Protein</div>
                    <div className="text-xl font-bold">{totalProtein.toFixed(0)}g</div>
                    <div className="text-xs text-muted-foreground">{proteinPercentage.toFixed(0)}%</div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-orange-600">Carbs</div>
                    <div className="text-xl font-bold">{totalCarbs.toFixed(0)}g</div>
                    <div className="text-xs text-muted-foreground">{carbsPercentage.toFixed(0)}%</div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-orange-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(carbsPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-purple-600">Fat</div>
                    <div className="text-xl font-bold">{totalFat.toFixed(0)}g</div>
                    <div className="text-xs text-muted-foreground">{fatPercentage.toFixed(0)}%</div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(fatPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* List Header */}
            <div className="px-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {(() => {
                  const isToday = selectedDate === getTodayLocalDate();
                  const isYesterday = selectedDate === getYesterdayLocalDate();
                  const formattedSingleDate = selectedDate ? formatDateStringForDisplay(selectedDate) : '';
                  const formattedRange = dateRange
                    ? `${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)}`
                    : '';
                  const accessibleDateLabel = dateRange
                    ? formattedRange
                    : formattedSingleDate || 'All Time';
                  const visualLabel = dateRange
                    ? formattedRange
                    : isToday
                      ? 'Today'
                      : isYesterday
                        ? 'Yesterday'
                        : formattedSingleDate || 'All Time';
                  const needsAccessibleHelper = visualLabel !== accessibleDateLabel;

                  return (
                    <>
                      Meals on{' '}
                      {needsAccessibleHelper ? (
                        <>
                          <span className="sr-only">{accessibleDateLabel}</span>
                          <span aria-hidden="true">{visualLabel}</span>
                        </>
                      ) : (
                        accessibleDateLabel
                      )}
                    </>
                  );
                })()}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRelogDialogOpen(true)}
                className="gap-2 text-muted-foreground"
              >
                <History className="h-4 w-4" />
                Re-log meal
              </Button>
            </div>

            {/* Meal List */}
            <div className="px-4 pb-4 space-y-3">
              
              {recentLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No meals yet</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    Log your first meal to see calories and macros.
                  </p>
                  <Button onClick={() => setIsLogDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Log Meal
                  </Button>
                </div>
              ) : (
                recentLogs.map(log => {
                  // Split comma-separated items for preview
                  const allItems: string[] = [];
                  log.items?.forEach(item => {
                    const splitItems = item.split(',')
                      .map(i => i.trim())
                      .filter(i => i.length > 0);
                    allItems.push(...splitItems);
                  });
                  const firstTwoItems = allItems.slice(0, 2);
                  const restCount = Math.max(0, allItems.length - 2);

                  return (
                    <Card key={log.id} className="p-4">
                      <div className="space-y-3">
                        {/* Title and Meta */}
                        <div>
                          <h3 className="font-medium text-lg">{log.meal_name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(log.eaten_on)}
                            </div>
                            {log.macros?.calories && (
                              <div className="flex items-center gap-1">
                                <span>🔥</span>
                                {log.macros.calories.toFixed(0)} kcal
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items Preview */}
                        {firstTwoItems.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {firstTwoItems.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                            {restCount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                +{restCount}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReLogMeal(log);
                            }}
                            className="gap-2 h-8 rounded-full"
                          >
                            <span className="text-sm">↻</span>
                            Re-log
                          </Button>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingMealLog(log);
                                setIsLogDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm({ open: true, mealLog: log });
                              }}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}


        {/* Log Meal Dialog */}
        <LogMealDialog
          open={isLogDialogOpen}
          onOpenChange={(open) => {
            setIsLogDialogOpen(open);
            if (!open) {
              setEditingMealLog(null);
            }
          }}
          editingMealLog={editingMealLog}
          addMealLogFromItems={addMealLogFromItems}
          addBatchMealLogsFromItems={addBatchMealLogsFromItems}
          updateMealLog={updateMealLog}
        />

        {/* Meal Relog Dialog */}
        <MealRelogDialog
          open={isRelogDialogOpen}
          onOpenChange={setIsRelogDialogOpen}
          mealLogs={safeMealLogs}
          onRelogMeal={handleReLogMeal}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm({ open, mealLog: open ? deleteConfirm.mealLog : null })}
          title="Delete Meal Log"
          description={`Are you sure you want to delete "${deleteConfirm.mealLog?.meal_name}"? This action cannot be undone.`}
          onConfirm={handleDeleteMealLog}
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    </Layout>
  );
}
