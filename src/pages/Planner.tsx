import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useMealPlan } from '../hooks/useMealPlan';
import { useRecipes } from '../hooks/useRecipes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChefHat, RotateCcw, Utensils, Calendar, Copy } from 'lucide-react';
import { AddEditMealPlanBlockDialog } from '../components/AddEditMealPlanBlockDialog';
import { BlockReuseDialog } from '../components/BlockReuseDialog';
import { MealPlanBlockCard } from '../components/MealPlanBlockCard';
import { WeeklyMealPlanOverview } from '../components/WeeklyMealPlanOverview';
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

  return (
    <Layout>
      <section className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
        <header className="space-y-4">
          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Meal Planner</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Plan your weekly meals with recipe rotations and day ranges
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Meal Block
              </Button>
              <Button 
                onClick={() => setShowReuseDialog(true)} 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Copy className="h-4 w-4" />
                Reuse Block
              </Button>
              <Link to="/meal-prep-generator">
                <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  <Utensils className="h-4 w-4" />
                  Generate Meal Prep
                </Button>
              </Link>
            </div>
          </div>

          {/* Week Navigation */}
          <Card className="border-primary/20">
            <CardContent className="py-4">
              <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
                {/* Current Week Display */}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{getCurrentWeekText()}</h3>
                    <p className="text-sm text-muted-foreground">
                      {weeklyPlan?.blocks.length || 0} meal block{(weeklyPlan?.blocks.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-3">
                  {/* Week Selector Dropdown */}
                  {availableWeeks.length > 0 && (
                    <Select value={currentWeekStart} onValueChange={navigateToWeek}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select week..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWeeks.map((weekStart) => (
                          <SelectItem key={weekStart} value={weekStart}>
                            {getWeekDisplayText(weekStart)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

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

        {/* Weekly Overview */}
        <WeeklyMealPlanOverview
          weeklyPlan={weeklyPlan}
          allRecipes={allRecipes}
          getDayName={getDayName}
        />

        {/* Meal Plan Blocks */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Meal Plan Blocks
            </h2>
            <Badge variant="outline" className="self-start sm:self-center">
              {weeklyPlan.blocks.length} block{weeklyPlan.blocks.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {weeklyPlan.blocks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No meal plan blocks yet</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Create your first meal plan block to get started with recipe rotations.
                </p>
                <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Block
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {weeklyPlan.blocks.map((block) => (
                <MealPlanBlockCard
                  key={block.id}
                  block={block}
                  allRecipes={allRecipes}
                  onEdit={handleEditBlock}
                  onDelete={handleDeleteBlock}
                  getDayRange={getDayRange}
                />
              ))}
            </div>
          )}
        </div>

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
      </section>
    </Layout>
  );
};

export default Planner;
