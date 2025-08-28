import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Utensils, Apple } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useRecipes } from '../hooks/useRecipes';
import { useInventorySearch } from '../hooks/useInventorySearch';
import { MealLog, Recipe, FoodItem, MealItemEntry } from '../types';
import { calculateRecipeNutrition } from '../lib/servingUnitUtils';

interface LogMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mealLog: Omit<MealLog, 'id'>) => void;
  editingMealLog?: MealLog;
}

export function LogMealDialog({ open, onOpenChange, onSave, editingMealLog }: LogMealDialogProps) {
  const { toast } = useToast();
  const { allRecipes } = useRecipes();
  const { allItems } = useInventorySearch();
  
  // Track selected items for quantity input
  const [itemQuantities, setItemQuantities] = useState<Record<number, { quantity: number; unit: string }>>({});
  
  const [formData, setFormData] = useState({
    recipe_ids: [] as string[],
    item_entries: [] as MealItemEntry[],
    date: new Date().toISOString().split('T')[0],
    meal_name: '',
    notes: '',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });

  // Update form data when editingMealLog changes
  useEffect(() => {
    if (editingMealLog) {
      setFormData({
        recipe_ids: editingMealLog.recipe_ids || [],
        item_entries: editingMealLog.item_entries || [],
        date: editingMealLog.date,
        meal_name: editingMealLog.meal_name,
        notes: editingMealLog.notes || '',
        nutrition: editingMealLog.nutrition,
      });
      
      // Set item quantities from existing item entries
      const quantities: Record<number, { quantity: number; unit: string }> = {};
      editingMealLog.item_entries?.forEach(entry => {
        quantities[entry.item_id] = { quantity: entry.quantity, unit: entry.unit };
      });
      setItemQuantities(quantities);
    } else if (open) {
      // Reset form when opening for new meal log
      setFormData({
        recipe_ids: [],
        item_entries: [],
        date: new Date().toISOString().split('T')[0],
        meal_name: '',
        notes: '',
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      });
      setItemQuantities({});
    }
  }, [editingMealLog, open]);

  const selectedRecipes = formData.recipe_ids.map(id => allRecipes.find(r => r.id === id)).filter(Boolean) as Recipe[];

  const calculateCombinedNutrition = (recipes: Recipe[], itemEntries: MealItemEntry[]) => {
    // Calculate nutrition from recipes
    const recipeNutrition = recipes.reduce((total, recipe) => ({
      calories: total.calories + recipe.nutrition.calories_per_serving,
      protein: total.protein + recipe.nutrition.protein_per_serving,
      carbs: total.carbs + recipe.nutrition.carbs_per_serving,
      fat: total.fat + recipe.nutrition.fat_per_serving,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Calculate nutrition from item entries
    const itemNutrition = itemEntries.reduce((total, entry) => ({
      calories: total.calories + entry.nutrition.calories,
      protein: total.protein + entry.nutrition.protein,
      carbs: total.carbs + entry.nutrition.carbs,
      fat: total.fat + entry.nutrition.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    // Combine both
    return {
      calories: recipeNutrition.calories + itemNutrition.calories,
      protein: recipeNutrition.protein + itemNutrition.protein,
      carbs: recipeNutrition.carbs + itemNutrition.carbs,
      fat: recipeNutrition.fat + itemNutrition.fat,
    };
  };

  // Calculate nutrition for individual item entry using centralized utility
  const calculateItemNutrition = (item: FoodItem, quantity: number, unit: string) => {
    // Use the centralized calculateRecipeNutrition function for a single ingredient
    const ingredients = [{ item_id: item.id.toString(), quantity, unit }];
    
    // Convert FoodItem to the expected format for calculateRecipeNutrition
    const adaptedItem = {
      id: item.id.toString(),
      name: item.name,
      nutrition: item.nutrition,
      serving_size: item.serving_size,
      serving_quantity: item.serving_quantity,
      serving_unit: item.serving_unit,
      serving_unit_type: item.serving_unit_type,
    };
    
    const nutrition = calculateRecipeNutrition(ingredients, 1, [adaptedItem]);
    
    return {
      calories: nutrition.calories_per_serving,
      protein: nutrition.protein_per_serving,
      carbs: nutrition.carbs_per_serving,
      fat: nutrition.fat_per_serving,
    };
  };

  // Convert allRecipes to options for MultiSelect
  const recipeOptions: Option[] = allRecipes.map(recipe => ({
    label: recipe.name,
    value: recipe.id,
  }));

  // Convert allItems to options for MultiSelect
  const itemOptions: Option[] = allItems.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // Handle recipe selection from MultiSelect
  const handleRecipeSelectionChange = (selectedIds: string[]) => {
    const newRecipes = selectedIds.map(id => allRecipes.find(r => r.id === id)).filter(Boolean) as Recipe[];
    
    setFormData(prev => ({
      ...prev,
      recipe_ids: selectedIds,
      nutrition: calculateCombinedNutrition(newRecipes, prev.item_entries),
    }));
    
    updateMealName(newRecipes, formData.item_entries);
  };

  // Handle item selection from MultiSelect
  const handleItemSelectionChange = (selectedIds: string[]) => {
    const newItemEntries: MealItemEntry[] = [];
    
    selectedIds.forEach(idStr => {
      const itemId = parseInt(idStr);
      const item = allItems.find(i => i.id === itemId);
      if (!item) return;
      
      const quantities = itemQuantities[itemId] || { quantity: 1, unit: item.serving_unit || 'serving' };
      const nutrition = calculateItemNutrition(item, quantities.quantity, quantities.unit);
      
      newItemEntries.push({
        item_id: itemId,
        quantity: quantities.quantity,
        unit: quantities.unit,
        nutrition,
      });
    });
    
    setFormData(prev => ({
      ...prev,
      item_entries: newItemEntries,
      nutrition: calculateCombinedNutrition(selectedRecipes, newItemEntries),
    }));
    
    updateMealName(selectedRecipes, newItemEntries);
  };

  // Update meal name based on selections
  const updateMealName = (recipes: Recipe[], itemEntries: MealItemEntry[]) => {
    if (recipes.length === 1 && itemEntries.length === 0) {
      setFormData(prev => ({ ...prev, meal_name: recipes[0].name }));
    } else if (recipes.length === 0 && itemEntries.length === 1) {
      const item = allItems.find(i => i.id === itemEntries[0].item_id);
      setFormData(prev => ({ ...prev, meal_name: item?.name || 'Individual Item' }));
    } else if (recipes.length > 0 || itemEntries.length > 0) {
      const totalItems = recipes.length + itemEntries.length;
      setFormData(prev => ({ ...prev, meal_name: `Mixed Meal (${totalItems} items)` }));
    }
  };

  // Handle quantity change for items
  const handleItemQuantityChange = (itemId: number, quantity: number, unit: string) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: { quantity, unit }
    }));
    
    // Update the item entry in form data
    const updatedEntries = formData.item_entries.map(entry => {
      if (entry.item_id === itemId) {
        const item = allItems.find(i => i.id === itemId);
        if (!item) return entry;
        
        const nutrition = calculateItemNutrition(item, quantity, unit);
        return { ...entry, quantity, unit, nutrition };
      }
      return entry;
    });
    
    setFormData(prev => ({
      ...prev,
      item_entries: updatedEntries,
      nutrition: calculateCombinedNutrition(selectedRecipes, updatedEntries),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.meal_name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      });
      return;
    }

    if (formData.recipe_ids.length === 0 && formData.item_entries.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipe or food item",
        variant: "destructive",
      });
      return;
    }

    const mealLog: Omit<MealLog, 'id'> = {
      recipe_ids: formData.recipe_ids.map(id => parseInt(id)),
      item_entries: formData.item_entries.length > 0 ? formData.item_entries : undefined,
      date: formData.date,
      meal_name: formData.meal_name.trim(),
      notes: formData.notes.trim() || undefined,
      nutrition: formData.nutrition,
    };

    onSave(mealLog);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{editingMealLog ? 'Edit Meal Log' : 'Log a Meal'}</DialogTitle>
          <DialogDescription>
            Select recipes and/or individual food items and log your meal with nutrition information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Select Items *</Label>
            <Tabs defaultValue="recipes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recipes" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Recipes
                </TabsTrigger>
                <TabsTrigger value="items" className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  Individual Items
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recipes" className="space-y-3">
                <MultiSelect
                  options={recipeOptions}
                  defaultValue={formData.recipe_ids}
                  onValueChange={handleRecipeSelectionChange}
                  placeholder="Select recipes for this meal..."
                  maxCount={2}
                />
                
                {/* Selected Recipes Display */}
                {selectedRecipes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Selected Recipes:</Label>
                    <div className="space-y-2">
                      {selectedRecipes.map((recipe) => (
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
              </TabsContent>
              
              <TabsContent value="items" className="space-y-3">
                <MultiSelect
                  options={itemOptions}
                  defaultValue={formData.item_entries.map(entry => entry.item_id.toString())}
                  onValueChange={handleItemSelectionChange}
                  placeholder="Select individual food items..."
                />
                
                {/* Selected Items Display with Quantity Inputs */}
                {formData.item_entries.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Selected Items:</Label>
                    <div className="space-y-3">
                      {formData.item_entries.map((entry) => {
                        const item = allItems.find(i => i.id === entry.item_id);
                        if (!item) return null;
                        
                        return (
                          <Card key={entry.item_id} className="p-3 bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Apple className="h-4 w-4 text-primary flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground mb-2">
                                  {entry.nutrition.calories.toFixed(0)} cal • 
                                  P: {entry.nutrition.protein.toFixed(1)}g • 
                                  C: {entry.nutrition.carbs.toFixed(1)}g • 
                                  F: {entry.nutrition.fat.toFixed(1)}g
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={entry.quantity}
                                    onChange={(e) => handleItemQuantityChange(
                                      entry.item_id, 
                                      parseFloat(e.target.value) || 0, 
                                      entry.unit
                                    )}
                                    className="w-20 h-8"
                                  />
                                  <Select
                                    value={entry.unit}
                                    onValueChange={(value) => handleItemQuantityChange(
                                      entry.item_id, 
                                      entry.quantity, 
                                      value
                                    )}
                                  >
                                    <SelectTrigger className="w-28 h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Volume</div>
                                      <SelectItem value="tsp">teaspoons (tsp)</SelectItem>
                                      <SelectItem value="tbsp">tablespoons (tbsp)</SelectItem>
                                      <SelectItem value="cup">cups</SelectItem>
                                      <SelectItem value="fl_oz">fluid ounces (fl oz)</SelectItem>
                                      <SelectItem value="ml">milliliters (ml)</SelectItem>
                                      <SelectItem value="l">liters (l)</SelectItem>
                                      
                                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Weight</div>
                                      <SelectItem value="g">grams (g)</SelectItem>
                                      <SelectItem value="kg">kilograms (kg)</SelectItem>
                                      <SelectItem value="oz">ounces (oz)</SelectItem>
                                      <SelectItem value="lb">pounds (lb)</SelectItem>
                                      
                                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Count</div>
                                      <SelectItem value="piece">pieces</SelectItem>
                                      <SelectItem value="slice">slices</SelectItem>
                                      <SelectItem value="can">cans</SelectItem>
                                      <SelectItem value="bottle">bottles</SelectItem>
                                      <SelectItem value="serving">servings</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
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

          {/* Nutrition Information (Combined from Recipes and Items) */}
          {(selectedRecipes.length > 0 || formData.item_entries.length > 0) && (
            <div className="space-y-3 bg-muted/50 p-3 rounded-md">
              <Label>Combined Nutrition</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Calories:</span> {formData.nutrition.calories.toFixed(1)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Protein:</span> {formData.nutrition.protein.toFixed(1)}g
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Carbs:</span> {formData.nutrition.carbs.toFixed(1)}g
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Fat:</span> {formData.nutrition.fat.toFixed(1)}g
                  </div>
                  {selectedRecipes.length > 0 && formData.item_entries.length > 0 && (
                    <div className="text-xs text-muted-foreground pt-1">
                      {selectedRecipes.length} recipe(s) + {formData.item_entries.length} item(s)
                    </div>
                  )}
                </div>
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
