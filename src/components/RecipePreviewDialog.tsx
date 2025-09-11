import { CheckCircle, XCircle, Clock, Users, ChefHat, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Recipe } from '../types';

interface RecipePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Omit<Recipe, 'id' | 'is_favorite'> | null;
  onAccept: () => void;
  onDecline: () => void;
  ingredients: Array<{ name: string; id: string }>; // To map item_id to name
}

export function RecipePreviewDialog({ 
  open, 
  onOpenChange, 
  recipe, 
  onAccept, 
  onDecline,
  ingredients 
}: RecipePreviewDialogProps) {
  if (!recipe) return null;

  const getIngredientName = (itemId: string) => {
    return ingredients.find(ing => ing.id === itemId)?.name || 'Unknown ingredient';
  };

  const formatInstructions = (instructions: string) => {
    return instructions.split('\n').filter(step => step.trim().length > 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="h-6 w-6 text-primary" />
            Recipe Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recipe Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">{recipe.name}</h2>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              {recipe.total_time_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.total_time_minutes} minutes</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Utensils className="h-5 w-5" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {/* Display ingredient_list if available (AI recipes) */}
                {recipe.ingredient_list && recipe.ingredient_list.length > 0 ? (
                  recipe.ingredient_list.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <span className="font-medium">{ingredient}</span>
                    </li>
                  ))
                ) : (
                  /* Display linked ingredients (manual recipes) */
                  recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span className="font-medium">{getIngredientName(ingredient.item_id)}</span>
                      <Badge variant="outline">
                        {ingredient.quantity} {ingredient.unit}
                      </Badge>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {formatInstructions(recipe.instructions).map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{step.trim()}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Nutrition Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutrition Per Serving</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{recipe.nutrition.calories_per_serving}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{recipe.nutrition.protein_per_serving}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.carbs_per_serving}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{recipe.nutrition.fat_per_serving}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="flex-1 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Decline Recipe
            </Button>
            <Button 
              onClick={onAccept}
              className="flex-1 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Accept & Save Recipe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}