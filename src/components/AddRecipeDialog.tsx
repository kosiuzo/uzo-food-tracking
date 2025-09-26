import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventorySearch } from '../hooks/useInventorySearch';
import { Recipe, RecipeIngredient } from '../types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { calculateRecipeNutrition, UNIT_TO_TYPE } from '../lib/servingUnitUtils';

// Form-specific type that allows string quantities during editing
interface RecipeFormData {
  name: string;
  instructions: string;
  servings: string;
  total_time_minutes: string;
  ingredients: Array<Omit<RecipeIngredient, 'quantity'> & { quantity: string }>;
  ingredient_list: string[]; // AI-generated ingredient strings
  nutrition?: {
    calories_per_serving: number;
    protein_per_serving: number;
    carbs_per_serving: number;
    fat_per_serving: number;
  };
  notes: string;
  selectedTagIds: string[];
}

interface AddRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (recipe: Omit<Recipe, 'id'> & { selectedTagIds?: string[] }) => void;
  editingRecipe?: Recipe;
}

export function AddRecipeDialog({ open, onOpenChange, onSave, editingRecipe }: AddRecipeDialogProps) {
  const { toast } = useToast();
  const { allItems } = useInventorySearch();
  // Tags are now stored directly on recipes as text[]
  
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    instructions: '',
    servings: '1',
    total_time_minutes: '',
    ingredients: [],
    ingredient_list: [],
    notes: '',
    selectedTagIds: [],
  });

  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [originalServings, setOriginalServings] = useState<number>(1); // Track original servings for AI recipes
  const [tagInput, setTagInput] = useState('');

  // Update form data when editingRecipe changes
  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        instructions: editingRecipe.instructions,
        servings: editingRecipe.servings.toString(),
        total_time_minutes: editingRecipe.total_time_minutes?.toString() || '',
        ingredients: editingRecipe.ingredients,
        ingredient_list: editingRecipe.ingredient_list || [],
        nutrition: editingRecipe.nutrition,
        notes: editingRecipe.notes || '',
        // Map existing tags (objects) to plain names for the free-typed input
        selectedTagIds: editingRecipe.tags?.map(tag => tag.name) || [],
      });
      setSelectedIngredientIds(editingRecipe.ingredients.map(ing => ing.item_id.toString()));
      setOriginalServings(editingRecipe.servings); // Track original servings for scaling
    } else if (open) {
      // Reset form when opening for new recipe
      setFormData({
        name: '',
        instructions: '',
        servings: '1',
        total_time_minutes: '',
        ingredients: [],
        ingredient_list: [],
        notes: '',
        selectedTagIds: [],
      });
      setSelectedIngredientIds([]);
      setOriginalServings(1);
      setTagInput('');
    }
  }, [editingRecipe, open]);

  // Helpers for tag input (comma/enter to add, click X to remove)
  const addTag = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setFormData(prev => ({
      ...prev,
      selectedTagIds: Array.from(new Set([...(prev.selectedTagIds || []), value]))
    }));
    setTagInput('');
  };

  const removeTag = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTagIds: (prev.selectedTagIds || []).filter(t => t !== name)
    }));
  };

  // Auto-determine nutrition source and calculate nutrition
  const getAutoNutritionSource = (): 'calculated' | 'ai_generated' | 'manual' => {
    // If recipe has ingredient_list, it's AI-generated
    if (formData.ingredient_list && formData.ingredient_list.length > 0) {
      return 'ai_generated';
    }
    // If recipe has linked ingredients, it's calculated
    if (formData.ingredients && formData.ingredients.length > 0) {
      return 'calculated';
    }
    // Otherwise, it's manual (no ingredients defined)
    return 'manual';
  };

  const calculateNutrition = () => {
    const autoSource = getAutoNutritionSource();

    // If recipe has ingredient_list (AI-imported), use stored nutrition with scaling
    if (autoSource === 'ai_generated' && formData.nutrition) {
      const currentServings = parseInt(formData.servings) || 1;
      const scaleFactor = originalServings / currentServings; // Scale per serving values

      return {
        calories_per_serving: formData.nutrition.calories_per_serving * scaleFactor,
        protein_per_serving: formData.nutrition.protein_per_serving * scaleFactor,
        carbs_per_serving: formData.nutrition.carbs_per_serving * scaleFactor,
        fat_per_serving: formData.nutrition.fat_per_serving * scaleFactor,
      };
    }

    // If recipe has manual nutrition, use stored nutrition
    if (autoSource === 'manual' && formData.nutrition) {
      return formData.nutrition;
    }

    // If recipe has linked ingredients (manual), calculate from ingredients
    if (autoSource === 'calculated' && formData.ingredients.length > 0) {
      const ingredientsWithNumbers = formData.ingredients.map(ing => ({
        ...ing,
        quantity: parseFloat(ing.quantity) || 0
      }));
      return calculateRecipeNutrition(ingredientsWithNumbers, parseInt(formData.servings) || 1, allItems);
    }

    // Fallback to stored nutrition or defaults
    return formData.nutrition || {
      calories_per_serving: 0,
      protein_per_serving: 0,
      carbs_per_serving: 0,
      fat_per_serving: 0,
    };
  };

  // Convert allItems to options for MultiSelect (in-stock items only)
  const ingredientOptions: Option[] = allItems
    .filter(item => item.in_stock)
    .map(item => ({
      label: item.name,
      value: item.id.toString(),
    }));

  // Handle ingredient selection from MultiSelect
  const handleIngredientSelectionChange = (selectedIds: string[]) => {
    setSelectedIngredientIds(selectedIds);
    
    // Update ingredients array based on selection
    const newIngredients = selectedIds.map(itemId => {
      // Check if this ingredient already exists
      const existingIngredient = formData.ingredients.find(ing => ing.item_id.toString() === itemId);
      return existingIngredient || {
        item_id: parseInt(itemId),
        quantity: '1',
        unit: 'cup',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
    
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item_id: '', quantity: '1', unit: 'cup' }]
    }));
  };

  const removeIngredient = (index: number) => {
    const ingredientToRemove = formData.ingredients[index];
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
    // Also update selected ingredient IDs
    setSelectedIngredientIds(prev => prev.filter(id => id !== ingredientToRemove.item_id));
  };

  const updateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, ...updates } : ingredient
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.instructions.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in recipe name and instructions.",
        variant: "destructive",
      });
      return;
    }

    // Require either linked ingredients OR ingredient list
    if (formData.ingredients.length === 0 && formData.ingredient_list.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add at least one ingredient or ingredient string.",
        variant: "destructive",
      });
      return;
    }

    const recipeData = {
      ...formData,
      servings: parseInt(formData.servings) || 1,
      total_time_minutes: parseInt(formData.total_time_minutes) || 0,
      ingredients: formData.ingredients.map(ing => ({
        ...ing,
        quantity: parseFloat(ing.quantity) || 0
      })),
      ingredient_list: formData.ingredient_list,
      nutrition_source: getAutoNutritionSource(),
      nutrition: calculateNutrition(),
      // Pass selected tag IDs for the parent to handle
      selectedTagIds: formData.selectedTagIds,
    };

    await onSave(recipeData);
    
    // Reset form
    setFormData({
      name: '',
      instructions: '',
      servings: '1',
      total_time_minutes: '',
      ingredients: [],
      ingredient_list: [],
      notes: '',
      selectedTagIds: [],
    });
    setSelectedIngredientIds([]);
    setOriginalServings(1);
    setTagInput('');

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
            {editingRecipe ? 'Update your recipe details and in-stock ingredients.' : 'Create a new recipe with in-stock ingredients, instructions, and nutritional information.'}
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
              {getAutoNutritionSource() === 'ai_generated' ? (
                <div className="flex items-center gap-2 h-10">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = parseInt(formData.servings) || 1;
                      if (current > 1) {
                        setFormData(prev => ({ ...prev, servings: (current - 1).toString() }));
                      }
                    }}
                    disabled={parseInt(formData.servings) <= 1}
                    className="h-8 w-8 p-0 rounded-full shrink-0"
                    aria-label="Decrease servings"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-medium text-center flex-1">
                    {formData.servings} serving{parseInt(formData.servings) !== 1 ? 's' : ''}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = parseInt(formData.servings) || 1;
                      setFormData(prev => ({ ...prev, servings: (current + 1).toString() }));
                    }}
                    className="h-8 w-8 p-0 rounded-full shrink-0"
                    aria-label="Increase servings"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Input
                  id="servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                  min="1"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep-time">Total Time (min)</Label>
              <Input
                id="prep-time"
                type="number"
                value={formData.total_time_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, total_time_minutes: e.target.value }))}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {formData.selectedTagIds?.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                onBlur={() => addTag(tagInput)}
                placeholder="Type a tag and press Enter"
                className="w-auto min-w-[180px] flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Free-type tags. Examples: paleo, gluten-free, breakfast, main-dish
            </p>
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

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes or tips..."
              rows={3}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Select Ingredients * (in-stock only)</Label>
              <MultiSelect
                options={ingredientOptions}
                onValueChange={handleIngredientSelectionChange}
                defaultValue={selectedIngredientIds}
                placeholder="Search and select in-stock ingredients..."
                maxCount={3}
              />
            </div>
            
            {formData.ingredients.length > 0 && (
              <div className="space-y-2">
                <Label>Ingredient Details</Label>
                {formData.ingredients.map((ingredient, index) => {
                  const item = allItems.find(item => item.id === ingredient.item_id);
                  return (
                    <Card key={index} className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {item?.name} {item?.brand && `(${item.brand})`}
                        </Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeIngredient(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredient(index, { quantity: e.target.value })}
                            min="0"
                            step="0.01"
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
                  );
                })}
              </div>
            )}
          </div>


          {/* AI Ingredient List */}
          {getAutoNutritionSource() === 'ai_generated' && (
            <div className="space-y-3">
              <Label>AI Ingredient List</Label>
              <div className="space-y-2">
                {formData.ingredient_list.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => {
                        const newList = [...formData.ingredient_list];
                        newList[index] = e.target.value;
                        setFormData(prev => ({ ...prev, ingredient_list: newList }));
                      }}
                      placeholder="e.g., 2 cups flour"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newList = formData.ingredient_list.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, ingredient_list: newList }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      ingredient_list: [...prev.ingredient_list, ''] 
                    }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
            </div>
          )}

          {/* Manual Nutrition Entry */}
          {getAutoNutritionSource() === 'manual' && (
            <div className="space-y-3">
              <Label>Manual Nutrition (per serving)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Calories</Label>
                  <Input
                    type="number"
                    value={formData.nutrition?.calories_per_serving || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: {
                        ...prev.nutrition,
                        calories_per_serving: parseFloat(e.target.value) || 0,
                        protein_per_serving: prev.nutrition?.protein_per_serving || 0,
                        carbs_per_serving: prev.nutrition?.carbs_per_serving || 0,
                        fat_per_serving: prev.nutrition?.fat_per_serving || 0,
                      }
                    }))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Protein (g)</Label>
                  <Input
                    type="number"
                    value={formData.nutrition?.protein_per_serving || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: {
                        calories_per_serving: prev.nutrition?.calories_per_serving || 0,
                        protein_per_serving: parseFloat(e.target.value) || 0,
                        carbs_per_serving: prev.nutrition?.carbs_per_serving || 0,
                        fat_per_serving: prev.nutrition?.fat_per_serving || 0,
                      }
                    }))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Carbs (g)</Label>
                  <Input
                    type="number"
                    value={formData.nutrition?.carbs_per_serving || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: {
                        calories_per_serving: prev.nutrition?.calories_per_serving || 0,
                        protein_per_serving: prev.nutrition?.protein_per_serving || 0,
                        carbs_per_serving: parseFloat(e.target.value) || 0,
                        fat_per_serving: prev.nutrition?.fat_per_serving || 0,
                      }
                    }))}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Fat (g)</Label>
                  <Input
                    type="number"
                    value={formData.nutrition?.fat_per_serving || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: {
                        calories_per_serving: prev.nutrition?.calories_per_serving || 0,
                        protein_per_serving: prev.nutrition?.protein_per_serving || 0,
                        carbs_per_serving: prev.nutrition?.carbs_per_serving || 0,
                        fat_per_serving: parseFloat(e.target.value) || 0,
                      }
                    }))}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Calculated Nutrition Preview */}
          <div className="space-y-3 bg-muted/50 p-3 rounded-md">
            <Label>Calculated Nutrition (per serving)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Calories:</span> {calculateNutrition().calories_per_serving.toFixed(1)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Protein:</span> {calculateNutrition().protein_per_serving.toFixed(1)}g
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Carbs:</span> {calculateNutrition().carbs_per_serving.toFixed(1)}g
                </div>
                <div className="text-sm">
                  <span className="font-medium">Fat:</span> {calculateNutrition().fat_per_serving.toFixed(1)}g
                </div>
              </div>
            </div>
          </div>

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
