import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useMealPlan } from '../hooks/useMealPlan';
import { useRecipes } from '../hooks/useRecipes';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, ChefHat, RotateCcw, Utensils, Calendar, Copy, MoreHorizontal, ChevronDown, ChevronRight, Clock, Users, BookOpen, Wand2, CalendarSync, Trash2, Edit } from 'lucide-react';
import { AddEditMealPlanBlockDialog } from '../components/AddEditMealPlanBlockDialog';
import { BlockReuseDialog } from '../components/BlockReuseDialog';
import { MealPlanBlock } from '../types';

const Planner = () => {
  const { allRecipes, favorites } = useRecipes();
  const {
    weeklyPlan,
    currentWeekStart,
    availableWeeks,
    loading,
    error,
    usingMockData,
    createMealPlanBlock,
    updateMealPlanBlock,
    deleteMealPlanBlock,
    getDayName,
    getDayRange,
    navigateToWeek,
  } = useMealPlan();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showReuseDialog, setShowReuseDialog] = useState(false);
  const [editingBlock, setEditingBlock] = useState<MealPlanBlock | null>(null);
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();

  const handleCreateBlock = (block: Omit<MealPlanBlock, 'id'>) => {
    createMealPlanBlock(block);
  };

  const handleReuseBlock = (block: Omit<MealPlanBlock, 'id'>) => {
    createMealPlanBlock(block);
  };

  const handleEditBlock = (block: MealPlanBlock) => {
    setEditingBlock(block);
    setShowAddDialog(true);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<MealPlanBlock>) => {
    updateMealPlanBlock(blockId, updates);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Are you sure you want to delete this meal plan block?')) {
      deleteMealPlanBlock(blockId);
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingBlock(null);
  };

  // Helper functions for week display
  const formatWeekDate = (weekStart: string) => {
    const date = new Date(weekStart);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getWeekDisplayText = (weekStart: string) => {
    const date = new Date(weekStart);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);
    
    const startFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const getCurrentWeekText = () => {
    if (!currentWeekStart) return 'Current Week';
    return getWeekDisplayText(currentWeekStart);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg text-muted-foreground">Loading meal plan...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (!weeklyPlan) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No meal plan found</p>
        </div>
      </Layout>
    );
  }

  // Helper function to toggle day expansion
  const toggleDayExpansion = (dayIndex: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
  };

  // Get actual calendar dates for the week
  const getWeekDates = () => {
    if (!currentWeekStart) return [];
    const startDate = new Date(currentWeekStart);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get blocks for a specific day - debug and fix logic
  const getBlocksForDay = (dayIndex: number) => {
    if (!weeklyPlan?.blocks) {
      return [];
    }

    const filteredBlocks = weeklyPlan.blocks.filter(block => {
      // Try both naming conventions
      const blockStartDay = block.start_day ?? (block as unknown as { startDay: number }).startDay;
      const blockEndDay = block.end_day ?? (block as unknown as { endDay: number }).endDay;

      const isInRange = dayIndex >= blockStartDay && dayIndex <= blockEndDay;
      return isInRange;
    });
    return filteredBlocks;
  };

  // Get day name
  const getDayDisplayName = (dayIndex: number) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayNames[dayIndex];
  };

  // Get formatted date for day
  const getFormattedDate = (dayIndex: number) => {
    const weekDates = getWeekDates();
    if (weekDates[dayIndex]) {
      return weekDates[dayIndex].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return '';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
          <h1 className="text-2xl font-bold mb-3">Planner</h1>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex-1 h-10 gap-2"
              aria-label="Add a meal block"
            >
              <Plus className="h-4 w-4" />
              Add Meal Block
            </Button>

            <Sheet open={isMoreActionsOpen} onOpenChange={setIsMoreActionsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-10 px-3 rounded-full"
                  aria-label="Open planner actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
                <SheetHeader>
                  <SheetTitle>More Actions</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {
                      setShowReuseDialog(true);
                      setIsMoreActionsOpen(false);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Reuse Block
                  </Button>

                  <Link to="/meal-prep-generator" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => setIsMoreActionsOpen(false)}
                    >
                      <Wand2 className="h-4 w-4" />
                      Generate Meal Prep (AI)
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => setIsMoreActionsOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    Import from Recipes
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => setIsMoreActionsOpen(false)}
                  >
                    <CalendarSync className="h-4 w-4" />
                    Duplicate Last Week
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Date Range Card */}
        <div className="px-4 pt-4">
          <Sheet open={isRangePickerOpen} onOpenChange={setIsRangePickerOpen}>
            <SheetTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{getCurrentWeekText()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {weeklyPlan?.blocks.length || 0} meal block{(weeklyPlan?.blocks.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
              <SheetHeader>
                <SheetTitle>Select Week Range</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Available Weeks</h4>
                  <div className="space-y-2">
                    {availableWeeks.length > 0 ? (
                      availableWeeks.map((weekStart) => (
                        <Button
                          key={weekStart}
                          variant={currentWeekStart === weekStart ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => {
                            navigateToWeek(weekStart);
                            setIsRangePickerOpen(false);
                          }}
                        >
                          {getWeekDisplayText(weekStart)}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No weeks available yet</p>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mock Data Indicator */}
        {usingMockData && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-amber-500 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="text-amber-800 font-medium text-sm sm:text-base">Demo Mode</p>
                <p className="text-xs sm:text-sm text-amber-700 mt-1">
                  Showing sample meal plans with realistic data. Connect to Supabase to save your real meal plans and sync across devices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty Hero (when no blocks) */}
        {(!weeklyPlan?.blocks || weeklyPlan.blocks.length === 0) && (
          <div className="px-4">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <ChefHat className="h-6 w-6 text-muted-foreground -ml-2" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No meal blocks yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Create a meal block using "Add Meal Block" above. Blocks can span multiple days (e.g., Monday-Friday) and will show on all assigned days below.
              </p>
            </div>
          </div>
        )}

        {/* Weekly Overview - Always show */}
        <div className="px-4 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Meal Plan Blocks
          </h2>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Weekly Meal Plan</CardTitle>
              <p className="text-sm text-muted-foreground">{getCurrentWeekText()}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                  const dayBlocks = getBlocksForDay(dayIndex);
                  const isPlanned = dayBlocks.length > 0;
                  const isExpanded = expandedDays.has(dayIndex);
                  const dayDate = getFormattedDate(dayIndex);

                  return (
                    <div key={dayIndex} className="border rounded-lg">
                      {/* Day Header */}
                      <div className="p-3 border-b bg-muted/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{getDayDisplayName(dayIndex)}</h4>
                            <p className="text-sm text-muted-foreground">{dayDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isPlanned ? (
                              <Badge variant="secondary" className="text-xs">
                                {dayBlocks.length} meal{dayBlocks.length !== 1 ? 's' : ''}
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs"
                                onClick={() => setShowAddDialog(true)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Meal
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="p-3">
                        {isPlanned ? (
                          <div className="space-y-2">
                            {dayBlocks.map((block) => (
                              <div key={block.id} className="border rounded-lg p-3 bg-background">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium">{block.name}</h5>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditBlock(block);
                                        }}
                                        title="Edit meal block"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 text-xs text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (confirm(`Are you sure you want to delete the meal block "${block.name}"? This will remove it from all planned days.`)) {
                                            handleDeleteBlock(block.id);
                                          }
                                        }}
                                        title="Delete meal block"
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Show recipes for this block - fixed version */}
                                  {(() => {
                                    // Try both possible property names
                                    const rotations = block.recipe_rotations || (block as unknown as { rotations: unknown[] }).rotations || [];

                                    if (rotations && rotations.length > 0) {
                                      // Collect all recipes from all rotations
                                      const allRotationRecipes: unknown[] = [];

                                      rotations.forEach((rotation: unknown) => {
                                        const rot = rotation as { recipes?: unknown[] };
                                        if (rot.recipes && Array.isArray(rot.recipes)) {
                                          allRotationRecipes.push(...rot.recipes);
                                        }
                                      });

                                      if (allRotationRecipes.length > 0) {
                                        return (
                                          <div className="space-y-1">
                                            {allRotationRecipes.map((recipeData: unknown, idx: number) => {
                                              const recipeId = typeof recipeData === 'number' ? recipeData : ((recipeData as { id?: number; recipe_id?: number }).id || (recipeData as { id?: number; recipe_id?: number }).recipe_id);
                                              const recipe = allRecipes.find(r => r.id === recipeId);
                                              return (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                  <ChefHat className="h-3 w-3 text-muted-foreground" />
                                                  <span>{recipe?.name || `Recipe ID: ${recipeId}`}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        );
                                      }
                                    }

                                    return (
                                      <p className="text-sm text-muted-foreground italic">No recipes assigned</p>
                                    );
                                  })()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No meals planned</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content with proper spacing */}
        <div className="pb-4"></div>

        {/* Add/Edit Dialog */}
        <AddEditMealPlanBlockDialog
          open={showAddDialog}
          onOpenChange={handleCloseDialog}
          onSave={handleCreateBlock}
          onEdit={editingBlock ? handleUpdateBlock : undefined}
          block={editingBlock}
          allRecipes={allRecipes}
          isEdit={!!editingBlock}
        />

        {/* Block Reuse Dialog */}
        <BlockReuseDialog
          open={showReuseDialog}
          onOpenChange={setShowReuseDialog}
          onReuseBlock={handleReuseBlock}
          allRecipes={allRecipes}
          currentWeekStart={currentWeekStart}
          getDayRange={getDayRange}
        />
      </div>
    </Layout>
  );
};

export default Planner;
