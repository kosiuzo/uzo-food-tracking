import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFoodInventory } from '../hooks/useFoodInventory';
import { Recipe, RecipeIngredient } from '../types';
import { getServingUnitType, convertVolumeToGrams, scaleNutrition, UNIT_TO_TYPE } from '../lib/servingUnitUtils';

interface AddRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  editingRecipe?: Recipe;
}

export function AddRecipeDialog({ open, onOpenChange, onSave, editingRecipe }: AddRecipeDialogProps) {
  const { toast } = useToast();
  const { allItems } = useFoodInventory();
  
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    servings: 1,
    prep_time_minutes: 0,
    ingredients: [] as RecipeIngredient[],
  });

  // Update form data when editingRecipe changes
  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        instructions: editingRecipe.instructions,
        servings: editingRecipe.servings,
        prep_time_minutes: editingRecipe.prep_time_minutes,
        ingredients: editingRecipe.ingredients,
      });
    } else if (open) {
      // Reset form when opening for new recipe
      setFormData({
        name: '',
        instructions: '',
        servings: 1,
        prep_time_minutes: 0,
        ingredients: [],
      });
    }
  }, [editingRecipe, open]);

  // Calculate nutrition based on ingredients
  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    formData.ingredients.forEach(ingredient => {
      const item = allItems.find(item => item.id === ingredient.item_id);
      if (item) {
        let quantityInGrams = ingredient.quantity;
        const unitType = getServingUnitType(ingredient.unit);
        
        try {
          // Handle different unit types
          if (unitType === 'volume' && item.serving_unit_type === 'volume' && item.serving_quantity && item.serving_unit) {
            // Use volume conversion for volume-based ingredients
            quantityInGrams = convertVolumeToGrams(
              ingredient.quantity,
              ingredient.unit,
              item.serving_quantity,
              item.serving_unit,
              item.serving_size || 100
            );
          } else if (unitType === 'weight') {
            // Convert weight units to grams
            switch (ingredient.unit) {
              case 'kg':
                quantityInGrams *= 1000;
                break;
              case 'oz':
                quantityInGrams *= 28.35; // 1 oz = 28.35g
                break;
              case 'lb':
                quantityInGrams *= 453.592; // 1 lb = 453.592g
                break;
              case 'g':
              default:
                // already in grams
                break;
            }
          } else if (unitType === 'package') {
            // For package units, multiply by serving size
            quantityInGrams = ingredient.quantity * (item.serving_size || 100);
          } else {
            // Fallback: assume grams
            quantityInGrams = ingredient.quantity;
          }
          
          // Scale nutrition based on actual grams vs item's serving size
          const scaled = scaleNutrition(
            {
              calories: item.nutrition.calories_per_serving,
              protein: item.nutrition.protein_per_serving,
              carbs: item.nutrition.carbs_per_serving,
              fat: item.nutrition.fat_per_serving,
            },
            quantityInGrams,
            item.serving_size || 100 // item's actual serving size
          );
          
          totalCalories += scaled.calories;
          totalProtein += scaled.protein;
          totalCarbs += scaled.carbs;
          totalFat += scaled.fat;
          
        } catch (error) {
          console.warn(`Error calculating nutrition for ${item.name}:`, error);
          // Fallback to simple gram calculation
          const factor = quantityInGrams / (item.serving_size || 100);
          totalCalories += item.nutrition.calories_per_serving * factor;
          totalProtein += item.nutrition.protein_per_serving * factor;
          totalCarbs += item.nutrition.carbs_per_serving * factor;
          totalFat += item.nutrition.fat_per_serving * factor;
        }
      }
    });

    return {
      calories_per_serving: Math.round((totalCalories / formData.servings) * 10) / 10,
      protein_per_serving: Math.round((totalProtein / formData.servings) * 10) / 10,
      carbs_per_serving: Math.round((totalCarbs / formData.servings) * 10) / 10,
      fat_per_serving: Math.round((totalFat / formData.servings) * 10) / 10,
    };
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item_id: '', quantity: 1, unit: 'cup' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, ...updates } : ingredient
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.instructions.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in recipe name and instructions.",
        variant: "destructive",
      });
      return;
    }

    if (formData.ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add at least one ingredient.",
        variant: "destructive",
      });
      return;
    }

    const recipeData = {
      ...formData,
      nutrition: calculateNutrition()
    };

    onSave(recipeData);
    
    // Reset form
    setFormData({
      name: '',
      instructions: '',
      servings: 1,
      prep_time_minutes: 0,
      ingredients: [],
    });

    toast({
      title: "Recipe added",
      description: `${formData.name} has been added to your recipes.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
          <DialogDescription>
            {editingRecipe ? 'Update your recipe details and ingredients.' : 'Create a new recipe with ingredients, instructions, and nutritional information.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipe-name">Recipe Name *</Label>
            <Input
              id="recipe-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Banana Smoothie"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep-time">Prep Time (min)</Label>
              <Input
                id="prep-time"
                type="number"
                value={formData.prep_time_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, prep_time_minutes: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="1. Step one...&#10;2. Step two..."
              rows={4}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Ingredients *</Label>
              <Button type="button" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {formData.ingredients.map((ingredient, index) => (
              <Card key={index} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Ingredient {index + 1}</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <Select
                  value={ingredient.item_id}
                  onValueChange={(value) => updateIngredient(index, { item_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select food item" />
                  </SelectTrigger>
                  <SelectContent>
                    {allItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} {item.brand && `(${item.brand})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(index, { quantity: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Unit</Label>
                    <Select
                      value={ingredient.unit}
                      onValueChange={(value) => updateIngredient(index, { unit: value })}
                    >
                      <SelectTrigger>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Calculated Nutrition Preview */}
          {formData.ingredients.length > 0 && (
            <div className="space-y-2">
              <Label>Calculated Nutrition (per serving)</Label>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">{calculateNutrition().calories_per_serving}</div>
                  <div className="text-xs text-muted-foreground">cal</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">{calculateNutrition().protein_per_serving}g</div>
                  <div className="text-xs text-muted-foreground">protein</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">{calculateNutrition().carbs_per_serving}g</div>
                  <div className="text-xs text-muted-foreground">carbs</div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">{calculateNutrition().fat_per_serving}g</div>
                  <div className="text-xs text-muted-foreground">fat</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}