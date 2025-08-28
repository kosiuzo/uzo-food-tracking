import { useState } from 'react';
import { Plus, Calendar, Utensils, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from '../components/Layout';
import { LogMealDialog } from '../components/LogMealDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useMealLogs } from '../hooks/useMealLogs';
import { useRecipes } from '../hooks/useRecipes';
import { useToast } from '@/hooks/use-toast';
import { MealLog } from '../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getTodayLocalDate, getYesterdayLocalDate, getCurrentWeekRange, getLastWeekRange, formatDateStringForDisplay } from '@/lib/utils';

export default function Meals() {
  const { mealLogs, addMealLog, updateMealLog, deleteMealLog, reLogMeal, usingMockData, error, loading } = useMealLogs();
  const { getRecipeById } = useRecipes();
  const { toast } = useToast();
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [editingMealLog, setEditingMealLog] = useState<MealLog | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; mealLog: MealLog | null }>({ open: false, mealLog: null });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [reLoggedMeals, setReLoggedMeals] = useState<Set<string>>(new Set());

  // Debug logging
  console.log('Meals component render:', { loading, mealLogs: mealLogs?.length, error, usingMockData });

  // Ensure mealLogs is always an array
  const safeMealLogs = Array.isArray(mealLogs) ? mealLogs : [];

  // Filter meals by selected date, date range, or show all if no filter
  const filteredMeals = selectedDate 
    ? safeMealLogs.filter(log => log.date === selectedDate)
    : dateRange
    ? safeMealLogs.filter(log => log.date >= dateRange.start && log.date <= dateRange.end)
    : safeMealLogs;

  const recentLogs = filteredMeals.slice(0, 20); // Show last 20 meals from filtered results

  // Safety check for recipes
  const safeGetRecipeById = (id: string) => {
    try {
      return getRecipeById(id);
    } catch (err) {
      console.warn('Error getting recipe by ID:', err);
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    const todayLocal = getTodayLocalDate();
    const yesterdayLocal = getYesterdayLocalDate();

    if (dateString === todayLocal) {
      return 'Today';
    } else if (dateString === yesterdayLocal) {
      return 'Yesterday';
    } else {
      // Format the date string for display
      const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
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

  const handleReLogMeal = async (mealLog: MealLog) => {
    try {
      await reLogMeal(mealLog);
      // Track this meal as successfully re-logged
      setReLoggedMeals(prev => new Set(prev).add(mealLog.id));
      toast({
        title: 'Meal re-logged',
        description: `${mealLog.meal_name} has been logged for today.`,
      });
      // Clear the success state after 3 seconds
      setTimeout(() => {
        setReLoggedMeals(prev => {
          const newSet = new Set(prev);
          newSet.delete(mealLog.id);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to re-log meal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Check if a meal is already logged for today
  const isMealLoggedToday = (mealLog: MealLog) => {
    const today = getTodayLocalDate();
    return safeMealLogs.some(log => 
      log.date === today && 
      log.recipe_ids.length === mealLog.recipe_ids.length &&
      log.recipe_ids.every(id => mealLog.recipe_ids.includes(id))
    );
  };

  return (
    <Layout>
      <div className="space-y-6">

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

            {/* Date Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="date-filter" className="text-sm font-medium">Filter by Date:</Label>
                </div>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
                {(selectedDate || dateRange) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDate('');
                      setDateRange(null);
                    }}
                    className="h-8 px-2"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
              
              {/* Quick Date Navigation */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Quick select:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(getTodayLocalDate())}
                  className="h-7 px-2 text-xs"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(getYesterdayLocalDate())}
                  className="h-7 px-2 text-xs"
                >
                  Yesterday
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDate('');
                    setDateRange(getCurrentWeekRange());
                  }}
                  className="h-7 px-2 text-xs"
                >
                  This Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDate('');
                    setDateRange(getLastWeekRange());
                  }}
                  className="h-7 px-2 text-xs"
                >
                  Last Week
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{filteredMeals.length}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedDate 
                    ? 'Meals on ' + formatDateStringForDisplay(selectedDate)
                    : dateRange
                    ? `Meals ${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)}`
                    : 'Total Meals'
                  }
                </div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredMeals.reduce((sum, log) => sum + log.nutrition.calories, 0).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedDate 
                    ? 'Calories on ' + formatDateStringForDisplay(selectedDate)
                    : dateRange
                    ? `Calories ${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)}`
                    : 'Total Calories'
                  }
                </div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredMeals.reduce((sum, log) => sum + log.nutrition.protein, 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredMeals.reduce((sum, log) => sum + log.nutrition.carbs, 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </Card>
            </div>
            
            {/* Additional Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredMeals.reduce((sum, log) => sum + log.nutrition.fat, 0).toFixed(1)}g
                </div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  ${filteredMeals.reduce((sum, log) => sum + (log.estimated_cost || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedDate 
                    ? 'Cost on ' + formatDateStringForDisplay(selectedDate)
                    : dateRange
                    ? `Cost ${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)}`
                    : 'Total Cost'
                  }
                </div>
              </Card>
            </div>

            {/* Recent Meals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {selectedDate 
                    ? `Meals on ${formatDateStringForDisplay(selectedDate)}`
                    : dateRange
                    ? `Meals ${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)}`
                    : 'Recent Meals'
                  }
                </h2>
                {selectedDate && (
                  <Badge variant="outline" className="text-xs">
                    {filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              {recentLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-lg">
                      {selectedDate 
                        ? `No meals logged on ${formatDateStringForDisplay(selectedDate)}`
                        : dateRange
                        ? `No meals logged ${formatDateStringForDisplay(dateRange.start)} - ${formatDateStringForDisplay(dateRange.end)}`
                        : 'No meals logged yet'
                      }
                    </p>
                    {!selectedDate && !dateRange && !usingMockData && (
                      <p className="text-sm text-muted-foreground">
                        Click the + button to log your first meal!
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                recentLogs.map(log => {
                  const recipes = log.recipe_ids.map(id => safeGetRecipeById(id)).filter(Boolean);
                  
                  return (
                    <Card key={log.id} className="p-4">
                      <div className="space-y-3">
                        <div className="space-y-3">
                          {/* Header with all action buttons */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-medium">{log.meal_name}</h3>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                {formatDate(log.date)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant={reLoggedMeals.has(log.id) ? "default" : "outline"}
                                    onClick={() => handleReLogMeal(log)}
                                    disabled={isMealLoggedToday(log)}
                                    className={`${
                                      reLoggedMeals.has(log.id)
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : isMealLoggedToday(log) 
                                          ? 'text-muted-foreground border-muted-foreground/20 cursor-not-allowed' 
                                          : 'text-primary hover:text-primary border-primary/20 hover:bg-primary/10'
                                    }`}
                                  >
                                    {reLoggedMeals.has(log.id) ? (
                                      <span className="flex items-center gap-1">
                                        <span className="text-sm">✓</span>
                                        Logged
                                      </span>
                                    ) : (
                                      <Clock className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {reLoggedMeals.has(log.id)
                                      ? 'Successfully re-logged for today!'
                                      : isMealLoggedToday(log) 
                                        ? 'This meal is already logged for today' 
                                        : 'Re-log this meal for today'
                                    }
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingMealLog(log);
                                  setIsLogDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteConfirm({ open: true, mealLog: log })}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Recipes */}
                          {recipes.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">
                                Recipes ({recipes.length}):
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {recipes.map((recipe, index) => (
                                  <Badge key={recipe.id} variant="outline" className="text-xs px-3 py-1 whitespace-nowrap break-words min-w-0 flex-shrink-0">
                                    {recipe.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Nutrition */}
                        <div className="flex gap-4 text-xs flex-wrap">
                          <span className="font-medium">
                            {log.nutrition.calories.toFixed(1)} cal
                          </span>
                          <span className="text-muted-foreground">
                            P: {log.nutrition.protein.toFixed(1)}g
                          </span>
                          <span className="text-muted-foreground">
                            C: {log.nutrition.carbs.toFixed(1)}g
                          </span>
                          <span className="text-muted-foreground">
                            F: {log.nutrition.fat.toFixed(1)}g
                          </span>
                          {log.estimated_cost && log.estimated_cost > 0 && (
                            <span className="text-green-600 font-medium">
                              Cost: ${log.estimated_cost.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {log.notes && (
                          <p className="text-sm text-muted-foreground">{log.notes}</p>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Floating Add Button */}
        <Button
          className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsLogDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

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
          onSave={(mealData) => {
            if (editingMealLog) {
              updateMealLog(editingMealLog.id, mealData);
            } else {
              addMealLog(mealData);
            }
            setIsLogDialogOpen(false);
            setEditingMealLog(null);
          }}
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