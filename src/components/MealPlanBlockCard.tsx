import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChefHat, UtensilsCrossed } from 'lucide-react';
import { MealPlanBlock, Recipe } from '../types';

interface MealPlanBlockCardProps {
  block: MealPlanBlock;
  allRecipes: Recipe[];
  onEdit: (block: MealPlanBlock) => void;
  onDelete: (blockId: string) => void;
  getDayRange: (startDay: number, endDay: number) => string;
}

export function MealPlanBlockCard({
  block,
  allRecipes,
  onEdit,
  onDelete,
  getDayRange,
}: MealPlanBlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRecipeName = (recipeId: string) => {
    return allRecipes.find(r => r.id === recipeId)?.name || 'Unknown Recipe';
  };

  const getRecipeNames = (recipeIds: string[]) => {
    return recipeIds.map(id => getRecipeName(id)).join(', ');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary flex-shrink-0" />
              {block.name}
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs w-fit">
                {getDayRange(block.startDay, block.endDay)}
              </Badge>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>{block.rotations.length} rotation{block.rotations.length !== 1 ? 's' : ''}</span>
                {block.snacks && block.snacks.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{block.snacks.length} snack{block.snacks.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-10 w-10 p-0 flex-shrink-0"
            >
              {isExpanded ? '−' : '+'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(block)}
              className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 flex-shrink-0"
              aria-label="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(block.id)}
              className="h-10 w-10 p-0 text-red-600 hover:text-red-700 flex-shrink-0"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* Recipe Rotations */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Recipe Rotations
            </h4>
            {block.rotations.map((rotation) => (
              <div key={rotation.id} className="border-l-4 border-l-primary pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm">{rotation.name}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {rotation.recipes.map((recipeId) => (
                      <Badge key={recipeId} variant="secondary" className="text-xs px-3 py-2">
                        {getRecipeName(recipeId)}
                      </Badge>
                    ))}
                  </div>
                  {rotation.notes && (
                    <p className="text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg">
                      {rotation.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Snacks */}
          {block.snacks && block.snacks.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Snacks
              </h4>
              <div className="flex flex-wrap gap-2">
                {block.snacks.map((recipeId) => (
                  <Badge key={recipeId} variant="outline" className="text-xs px-3 py-2">
                    {getRecipeName(recipeId)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
