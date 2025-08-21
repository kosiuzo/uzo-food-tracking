import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { X, Plus, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '../hooks/useRecipes';
import { MealLog, Recipe } from '../types';

interface LogMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mealLog: Omit<MealLog, 'id'>) => void;
  editingMealLog?: MealLog;
}

export function LogMealDialog({ open, onOpenChange, onSave, editingMealLog }: LogMealDialogProps) {
  const { toast } = useToast();
  const { allRecipes } = useRecipes();
  
  const [formData, setFormData] = useState({
    recipe_ids: [] as string[],
    date: new Date().toISOString().split('T')[0],
    meal_name: '',
    notes: '',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    estimated_cost: 0,
  });

  // Update form data when editingMealLog changes
  useEffect(() => {
    if (editingMealLog) {
      setFormData({
        recipe_ids: editingMealLog.recipe_ids || [],
        date: editingMealLog.date,
        meal_name: editingMealLog.meal_name,
        notes: editingMealLog.notes || '',
        nutrition: editingMealLog.nutrition,
        estimated_cost: editingMealLog.estimated_cost || 0,
      });
    } else if (open) {
      // Reset form when opening for new meal log
      setFormData({
        recipe_ids: [],
        date: new Date().toISOString().split('T')[0],
        meal_name: '',
        notes: '',
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
        estimated_cost: 0,
      });
    }
  }, [editingMealLog, open]);

  const selectedRecipes = formData.recipe_ids.map(id => allRecipes.find(r => r.id === id)).filter(Boolean) as Recipe[];

  const calculateCombinedNutrition = (recipes: Recipe[]) => {
    if (recipes.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    return recipes.reduce((total, recipe) => ({
      calories: total.calories + recipe.nutrition.calories_per_serving,
      protein: total.protein + recipe.nutrition.protein_per_serving,
      carbs: total.carbs + recipe.nutrition.carbs_per_serving,
      fat: total.fat + recipe.nutrition.fat_per_serving,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const calculateCombinedCost = (recipes: Recipe[]) => {
    return recipes.reduce((total, recipe) => total + (recipe.cost_per_serving || 0), 0);
  };

  // Convert allRecipes to options for MultiSelect
  const recipeOptions: Option[] = allRecipes.map(recipe => ({
    label: recipe.name,
    value: recipe.id,
  }));

  // Handle recipe selection from MultiSelect
  const handleRecipeSelectionChange = (selectedIds: string[]) => {
    const newRecipes = selectedIds.map(id => allRecipes.find(r => r.id === id)).filter(Boolean) as Recipe[];
    
    setFormData(prev => ({
      ...prev,
      recipe_ids: selectedIds,
      meal_name: newRecipes.length === 1 ? newRecipes[0].name : newRecipes.length > 0 ? `${newRecipes.length} Recipe Combo` : '',
      nutrition: calculateCombinedNutrition(newRecipes),
      estimated_cost: calculateCombinedCost(newRecipes),
    }));
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.recipe_ids.length === 0) {
      toast({
        title: "Missing recipe",
        description: "Please select at least one recipe.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.meal_name.trim()) {
      toast({
        title: "Missing meal name",
        description: "Please enter a meal name.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(formData);
    
    // Reset form
    setFormData({
      recipe_ids: [],
      date: new Date().toISOString().split('T')[0],
      meal_name: '',
      notes: '',
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
      estimated_cost: 0,
    });

    toast({
      title: "Meal logged",
      description: `${formData.meal_name} has been added to your meal log.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingMealLog ? 'Edit Meal' : 'Log a Meal'}</DialogTitle>
          <DialogDescription>
            {editingMealLog ? 'Update your meal log entry.' : 'Log a meal from your recipe collection with nutritional information.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          {/* Recipe Selection */}
          <div className="space-y-3">
            <Label>Recipes *</Label>
            <MultiSelect
              options={recipeOptions}
              onValueChange={handleRecipeSelectionChange}
              defaultValue={formData.recipe_ids}
              placeholder="Search and select recipes..."
              maxCount={2}
            />
            
            {/* Selected Recipes Display */}
            {selectedRecipes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Selected Recipes:</Label>
                <div className="space-y-2">
                  {selectedRecipes.map((recipe, index) => (
                    <Card key={recipe.id} className="p-3 bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{recipe.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {recipe.nutrition.calories_per_serving.toFixed(0)} cal • 
                            P: {recipe.nutrition.protein_per_serving.toFixed(1)}g • 
                            C: {recipe.nutrition.carbs_per_serving.toFixed(1)}g • 
                            F: {recipe.nutrition.fat_per_serving.toFixed(1)}g
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-name">Meal Name *</Label>
            <Input
              id="meal-name"
              value={formData.meal_name}
              onChange={(e) => setFormData(prev => ({ ...prev, meal_name: e.target.value }))}
              placeholder="e.g., Breakfast Smoothie"
            />
          </div>

          {/* Nutrition & Cost (Combined from Recipes) */}
          {selectedRecipes.length > 0 && (
            <div className="space-y-3 bg-muted/50 p-3 rounded-md">
              <Label>Combined Nutrition & Cost</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Calories:</span> {formData.nutrition.calories.toFixed(1)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Protein:</span> {formData.nutrition.protein.toFixed(1)}g
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Carbs:</span> {formData.nutrition.carbs.toFixed(1)}g
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Fat:</span> {formData.nutrition.fat.toFixed(1)}g
                  </div>
                </div>
              </div>
              <div className="text-sm border-t pt-2">
                <span className="font-medium">Total cost:</span> ${formData.estimated_cost.toFixed(2)}
                {selectedRecipes.length > 1 && (
                  <span className="text-muted-foreground ml-2">
                    ({selectedRecipes.length} recipes)
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about this meal..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingMealLog ? 'Update Meal' : 'Log Meal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}