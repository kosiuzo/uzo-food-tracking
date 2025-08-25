import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RotateCcw, Calendar, ChefHat, UtensilsCrossed, Copy, Loader2 } from 'lucide-react';
import { MealPlanBlock, Recipe } from '../types';
import { supabase } from '../lib/supabase';

interface BlockReuseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReuseBlock: (block: Omit<MealPlanBlock, 'id'>) => void;
  allRecipes: Recipe[];
  currentWeekStart: string;
  getDayRange: (startDay: number, endDay: number) => string;
}

interface AvailableBlock extends MealPlanBlock {
  weekStart: string;
}

export function BlockReuseDialog({
  open,
  onOpenChange,
  onReuseBlock,
  allRecipes,
  currentWeekStart,
  getDayRange,
}: BlockReuseDialogProps) {
  const [availableBlocks, setAvailableBlocks] = useState<AvailableBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingReuse, setLoadingReuse] = useState(false);

  // Load available blocks from other weeks
  const loadAvailableBlocks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get all meal plan blocks from weeks other than current week
      const { data: blocksData, error: blocksError } = await supabase
        .from('weekly_meal_plans')
        .select(`
          week_start,
          meal_plan_blocks (
            id,
            name,
            start_day,
            end_day,
            recipe_rotations (
              id,
              name,
              notes,
              rotation_recipes (
                recipe_id
              )
            ),
            block_snacks (
              recipe_id
            )
          )
        `)
        .neq('week_start', currentWeekStart)
        .order('week_start', { ascending: false });

      if (blocksError) {
        console.error('Error loading available blocks:', blocksError);
        return;
      }

      const blocks: AvailableBlock[] = [];
      
      blocksData?.forEach(weekPlan => {
        weekPlan.meal_plan_blocks?.forEach(block => {
          blocks.push({
            id: block.id,
            name: block.name,
            startDay: block.start_day,
            endDay: block.end_day,
            rotations: block.recipe_rotations?.map(rotation => ({
              id: rotation.id,
              name: rotation.name,
              notes: rotation.notes || undefined,
              recipes: rotation.rotation_recipes?.map(rr => rr.recipe_id) || [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })) || [],
            snacks: block.block_snacks?.map(snack => snack.recipe_id) || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            weekStart: weekPlan.week_start,
          });
        });
      });

      setAvailableBlocks(blocks);
    } catch (err) {
      console.error('Error in loadAvailableBlocks:', err);
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    if (open) {
      loadAvailableBlocks();
      setSelectedBlockId('');
    }
  }, [open, currentWeekStart, loadAvailableBlocks]);

  const handleReuseBlock = async () => {
    if (!selectedBlockId) return;

    const selectedBlock = availableBlocks.find(block => block.id === selectedBlockId);
    if (!selectedBlock) return;

    try {
      setLoadingReuse(true);

      // Create a copy of the block without the ID and week-specific data
      const blockToReuse: Omit<MealPlanBlock, 'id'> = {
        name: '', // Will be auto-generated
        startDay: selectedBlock.startDay,
        endDay: selectedBlock.endDay,
        rotations: selectedBlock.rotations.map(({ id, created_at, updated_at, ...rotation }) => rotation),
        snacks: selectedBlock.snacks?.length ? selectedBlock.snacks : undefined,
      };

      // Call the reuse function
      onReuseBlock(blockToReuse);
      onOpenChange(false);
    } catch (err) {
      console.error('Error reusing block:', err);
    } finally {
      setLoadingReuse(false);
    }
  };

  const getRecipeName = (recipeId: string) => {
    return allRecipes.find(r => r.id === recipeId)?.name || 'Unknown Recipe';
  };

  const formatWeekDate = (weekStart: string) => {
    const date = new Date(weekStart);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const selectedBlock = availableBlocks.find(block => block.id === selectedBlockId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Reuse Meal Plan Block
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Select a meal plan block from a previous week to reuse in the current week.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading available blocks...</span>
              </div>
            </div>
          ) : availableBlocks.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No blocks available to reuse</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Create meal plan blocks in other weeks first, then you can reuse them here.
              </p>
            </div>
          ) : (
            <>
              {/* Block Selection */}
              <div className="space-y-3">
                <Label htmlFor="block-select" className="text-base font-semibold">
                  Select Block to Reuse
                </Label>
                <Select value={selectedBlockId} onValueChange={setSelectedBlockId}>
                  <SelectTrigger id="block-select" className="w-full">
                    <SelectValue placeholder="Choose a meal plan block..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBlocks.map((block) => (
                      <SelectItem key={block.id} value={block.id}>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{block.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {getDayRange(block.startDay, block.endDay)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Week of {formatWeekDate(block.weekStart)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Block Preview */}
              {selectedBlock && (
                <Card className="border-2 border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Block Preview
                      </div>
                      <div className="flex items-center gap-2 text-sm font-normal">
                        <Calendar className="h-4 w-4" />
                        <Badge variant="outline">
                          {getDayRange(selectedBlock.startDay, selectedBlock.endDay)}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rotations */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        Recipe Rotations ({selectedBlock.rotations.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedBlock.rotations.map((rotation, index) => (
                          <div key={index} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {rotation.name}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {rotation.recipes.map((recipeId) => (
                                <div
                                  key={recipeId}
                                  className="text-sm bg-muted px-2 py-1 rounded"
                                >
                                  {getRecipeName(recipeId)}
                                </div>
                              ))}
                            </div>
                            {rotation.notes && (
                              <div className="text-sm text-muted-foreground italic">
                                {rotation.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Snacks */}
                    {selectedBlock.snacks && selectedBlock.snacks.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          Snacks ({selectedBlock.snacks.length})
                        </h4>
                        <div className="space-y-1">
                          {selectedBlock.snacks.map((recipeId) => (
                            <div
                              key={recipeId}
                              className="text-sm bg-muted/50 px-2 py-1 rounded"
                            >
                              {getRecipeName(recipeId)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Origin Week */}
                    <div className="pt-3 border-t border-muted">
                      <div className="text-sm text-muted-foreground">
                        Originally from week of <strong>{formatWeekDate(selectedBlock.weekStart)}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="w-full sm:w-auto"
            disabled={loadingReuse}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReuseBlock} 
            className="w-full sm:w-auto"
            disabled={!selectedBlockId || loadingReuse}
          >
            {loadingReuse ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Reusing Block...
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Reuse This Block
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}