import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';
import { MealPlanBlock, RecipeRotation, Recipe } from '../types';

interface AddEditMealPlanBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (block: Omit<MealPlanBlock, 'id'>) => void;
  onEdit?: (blockId: string, updates: Partial<MealPlanBlock>) => void;
  block?: MealPlanBlock;
  allRecipes: Recipe[];
  isEdit?: boolean;
}

const DAYS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
];

export function AddEditMealPlanBlockDialog({
  open,
  onOpenChange,
  onSave,
  onEdit,
  block,
  allRecipes,
  isEdit = false,
}: AddEditMealPlanBlockDialogProps) {
  const [name, setName] = useState('');
  const [startDay, setStartDay] = useState(0);
  const [endDay, setEndDay] = useState(2);
  const [rotations, setRotations] = useState<Omit<RecipeRotation, 'id'>[]>([]);
  const [snacks, setSnacks] = useState<string[]>([]);

  useEffect(() => {
    if (block && isEdit) {
      setName(block.name);
      setStartDay(block.startDay);
      setEndDay(block.endDay);
      setRotations(block.rotations.map(({ id, ...rotation }) => rotation));
      setSnacks(block.snacks || []);
    } else {
      // Reset form for new block
      setName('');
      setStartDay(0);
      setEndDay(2);
      setRotations([
        { name: 'Rotation 1', recipes: [], notes: '' },
        { name: 'Rotation 2', recipes: [], notes: '' },
      ]);
      setSnacks([]);
    }
  }, [block, isEdit, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    const blockData: Omit<MealPlanBlock, 'id'> = {
      name: name.trim(),
      startDay,
      endDay,
      rotations: rotations.filter(r => r.name.trim() && r.recipes.length > 0),
      snacks: snacks.length > 0 ? snacks : undefined,
    };

    if (isEdit && block && onEdit) {
      onEdit(block.id, blockData);
    } else {
      onSave(blockData);
    }
    onOpenChange(false);
  };

  const addRotation = () => {
    setRotations([
      ...rotations,
      { name: `Rotation ${rotations.length + 1}`, recipes: [], notes: '' },
    ]);
  };

  const removeRotation = (index: number) => {
    setRotations(rotations.filter((_, i) => i !== index));
  };

  const updateRotation = (index: number, field: keyof Omit<RecipeRotation, 'id'>, value: string | string[]) => {
    const updated = [...rotations];
    updated[index] = { ...updated[index], [field]: value };
    setRotations(updated);
  };

  const addRecipeToRotation = (rotationIndex: number, recipeId: string) => {
    const updated = [...rotations];
    if (!updated[rotationIndex].recipes.includes(recipeId)) {
      updated[rotationIndex].recipes = [...updated[rotationIndex].recipes, recipeId];
      setRotations(updated);
    }
  };

  const removeRecipeFromRotation = (rotationIndex: number, recipeId: string) => {
    const updated = [...rotations];
    updated[rotationIndex].recipes = updated[rotationIndex].recipes.filter(id => id !== recipeId);
    setRotations(updated);
  };

  const addSnack = (recipeId: string) => {
    if (!snacks.includes(recipeId)) {
      setSnacks([...snacks, recipeId]);
    }
  };

  const removeSnack = (recipeId: string) => {
    setSnacks(snacks.filter(id => id !== recipeId));
  };

  const getRecipeName = (recipeId: string) => {
    return allRecipes.find(r => r.id === recipeId)?.name || 'Unknown Recipe';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isEdit ? 'Edit Meal Plan Block' : 'Add New Meal Plan Block'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a meal plan block with recipe rotations for specific days of the week.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Block Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mon-Wed Block"
                className="h-11 sm:h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDay">Start Day</Label>
              <select
                id="startDay"
                value={startDay}
                onChange={(e) => setStartDay(Number(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md h-11 sm:h-10"
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDay">End Day</Label>
              <select
                id="endDay"
                value={endDay}
                onChange={(e) => setEndDay(Number(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md h-11 sm:h-10"
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipe Rotations */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Label className="text-base font-semibold">Recipe Rotations</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRotation} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Rotation
              </Button>
            </div>

            {rotations.map((rotation, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Input
                    value={rotation.name}
                    onChange={(e) => updateRotation(index, 'name', e.target.value)}
                    placeholder="Rotation name"
                    className="max-w-xs h-11 sm:h-10"
                  />
                  {rotations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRotation(index)}
                      className="text-red-600 hover:text-red-700 w-full sm:w-auto h-11 sm:h-10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Rotation
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Recipes</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rotation.recipes.map((recipeId) => (
                      <Badge key={recipeId} variant="secondary" className="gap-2 text-sm px-3 py-2">
                        {getRecipeName(recipeId)}
                        <button
                          type="button"
                          onClick={() => removeRecipeFromRotation(index, recipeId)}
                          className="ml-1 hover:text-red-600 p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addRecipeToRotation(index, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md h-11 sm:h-10"
                  >
                    <option value="">Add a recipe...</option>
                    {allRecipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={rotation.notes}
                    onChange={(e) => updateRotation(index, 'notes', e.target.value)}
                    placeholder="e.g., Salmon & eggs with salsa"
                    rows={2}
                    className="min-h-[80px] sm:min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Snacks */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Snacks (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {snacks.map((recipeId) => (
                <Badge key={recipeId} variant="outline" className="gap-2 text-sm px-3 py-2">
                  {getRecipeName(recipeId)}
                  <button
                    type="button"
                    onClick={() => removeSnack(recipeId)}
                    className="ml-1 hover:text-red-600 p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addSnack(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-input rounded-md h-11 sm:h-10"
            >
              <option value="">Add a snack recipe...</option>
              {allRecipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} className="w-full sm:w-auto">
            {isEdit ? 'Update Block' : 'Create Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
