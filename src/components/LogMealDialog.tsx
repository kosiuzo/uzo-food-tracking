import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Utensils, Loader2, Sparkles, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MealLog } from '../types';
import { useMealLogs } from '../hooks/useMealLogs';

interface LogMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (mealLog: Omit<MealLog, 'id'>) => void;
  editingMealLog?: MealLog;
  addMealLogFromItems?: (items: string[], notes?: string, rating?: number) => Promise<MealLog>;
  addBatchMealLogsFromItems?: (mealEntries: Array<{ items: string[]; notes?: string; rating?: number }>) => Promise<MealLog[]>;
}

interface MealEntry {
  id: string;
  items: string[];
  notes?: string;
  rating?: number;
  aiResult?: {
    meal_name: string;
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  isProcessing?: boolean;
}

export function LogMealDialog({
  open,
  onOpenChange,
  onSave,
  editingMealLog,
  addMealLogFromItems: propAddMealLogFromItems,
  addBatchMealLogsFromItems: propAddBatchMealLogsFromItems
}: LogMealDialogProps) {
  const { toast } = useToast();

  // Use props if provided, otherwise fall back to hook (for backward compatibility)
  const fallbackHook = useMealLogs();
  const addMealLogFromItems = propAddMealLogFromItems || fallbackHook.addMealLogFromItems;
  const addBatchMealLogsFromItems = propAddBatchMealLogsFromItems || fallbackHook.addBatchMealLogsFromItems;

  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemInputs, setItemInputs] = useState<Record<string, string>>({});

  // Initialize form when dialog opens or editing meal log changes
  useEffect(() => {
    if (editingMealLog) {
      // Editing mode - populate with existing meal log
      setMealEntries([{
        id: '1',
        items: editingMealLog.items,
        notes: editingMealLog.notes,
        rating: editingMealLog.rating,
        aiResult: {
          meal_name: editingMealLog.meal_name,
          macros: editingMealLog.macros,
        },
      }]);
    } else if (open) {
      // New meal log - start with one empty entry
      const newEntryId = Date.now().toString();
      setMealEntries([{
        id: newEntryId,
        items: [],
      }]);
      setItemInputs({ [newEntryId]: '' });
    }
  }, [editingMealLog, open]);

  const addMealEntry = () => {
    const newEntryId = Date.now().toString();
    setMealEntries(prev => [...prev, {
      id: newEntryId,
      items: [],
    }]);
    setItemInputs(prev => ({ ...prev, [newEntryId]: '' }));
  };

  const removeMealEntry = (id: string) => {
    setMealEntries(prev => prev.filter(entry => entry.id !== id));
    setItemInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[id];
      return newInputs;
    });
  };

  const addItemToEntry = (entryId: string, item: string) => {
    if (!item.trim()) return;

    setMealEntries(prev => prev.map(entry =>
      entry.id === entryId
        ? { ...entry, items: [...entry.items, item.trim()], aiResult: undefined }
        : entry
    ));

    // Clear the input for this entry
    setItemInputs(prev => ({ ...prev, [entryId]: '' }));
  };

  const removeItemFromEntry = (entryId: string, itemIndex: number) => {
    setMealEntries(prev => prev.map(entry =>
      entry.id === entryId
        ? {
            ...entry,
            items: entry.items.filter((_, index) => index !== itemIndex),
            aiResult: undefined
          }
        : entry
    ));
  };

  const updateEntryNotes = (entryId: string, notes: string) => {
    setMealEntries(prev => prev.map(entry =>
      entry.id === entryId ? { ...entry, notes } : entry
    ));
  };

  const updateEntryRating = (entryId: string, rating: number) => {
    setMealEntries(prev => prev.map(entry =>
      entry.id === entryId ? { ...entry, rating } : entry
    ));
  };

  const resetEntry = (entryId: string) => {
    setMealEntries(prev => prev.map(entry =>
      entry.id === entryId
        ? { ...entry, items: [], notes: '', rating: undefined, aiResult: undefined, isProcessing: false }
        : entry
    ));
    setItemInputs(prev => ({ ...prev, [entryId]: '' }));
  };

  const resetAllEntries = () => {
    const newEntryId = Date.now().toString();
    setMealEntries([{
      id: newEntryId,
      items: [],
    }]);
    setItemInputs({ [newEntryId]: '' });
  };

  const processEntryWithAI = async (entryId: string) => {
    const entry = mealEntries.find(e => e.id === entryId);
    if (!entry || entry.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add some food items before processing with AI",
        variant: "destructive",
      });
      return;
    }

    // Mark this entry as processing
    setMealEntries(prev => prev.map(e =>
      e.id === entryId ? { ...e, isProcessing: true } : e
    ));

    try {
      const result = await addMealLogFromItems(entry.items, entry.notes, entry.rating);

      // Update the entry with AI result
      setMealEntries(prev => prev.map(e =>
        e.id === entryId
          ? {
              ...e,
              isProcessing: false,
              aiResult: {
                meal_name: result.meal_name,
                macros: result.macros,
              }
            }
          : e
      ));

      toast({
        title: "Success!",
        description: `Meal "${result.meal_name}" has been logged successfully.`,
      });

    } catch (error) {
      setMealEntries(prev => prev.map(e =>
        e.id === entryId ? { ...e, isProcessing: false } : e
      ));

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process meal with AI",
        variant: "destructive",
      });
    }
  };

  const processBatchWithAI = async () => {
    const validEntries = mealEntries.filter(entry => entry.items.length > 0);

    if (validEntries.length === 0) {
      toast({
        title: "Error",
        description: "Please add food items to at least one meal before processing",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const batchData = validEntries.map(entry => ({
        items: entry.items,
        notes: entry.notes,
        rating: entry.rating,
      }));

      const results = await addBatchMealLogsFromItems(batchData);

      // Update entries with AI results
      setMealEntries(prev => prev.map((entry, index) => {
        const validIndex = validEntries.findIndex(ve => ve.id === entry.id);
        if (validIndex !== -1 && results[validIndex]) {
          return {
            ...entry,
            aiResult: {
              meal_name: results[validIndex].meal_name,
              macros: results[validIndex].macros,
            }
          };
        }
        return entry;
      }));

      toast({
        title: "Success!",
        description: `${results.length} meal${results.length !== 1 ? 's' : ''} logged successfully.`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process meals with AI",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleItemInputKeyPress = (e: React.KeyboardEvent, entryId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemToEntry(entryId, itemInputs[entryId] || '');
    }
  };

  const canProcessBatch = mealEntries.some(entry => entry.items.length > 0) && !isProcessing;
  const hasMultipleEntries = mealEntries.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {editingMealLog ? 'Edit Meal Log' : 'Log Meals with AI'}
          </DialogTitle>
          <DialogDescription>
            Add food items to each meal and let AI calculate nutrition and generate meal names.
            You can log multiple meals at once!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {mealEntries.map((entry, entryIndex) => (
            <Card key={entry.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">
                  Meal {entryIndex + 1}
                  {entry.aiResult && (
                    <Badge variant="secondary" className="ml-2">
                      <Check className="h-3 w-3 mr-1" />
                      Processed
                    </Badge>
                  )}
                </h3>

                <div className="flex items-center gap-2">
                  {!editingMealLog && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => processEntryWithAI(entry.id)}
                      disabled={entry.items.length === 0 || entry.isProcessing}
                      className="flex items-center gap-1"
                    >
                      {entry.isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {entry.isProcessing ? 'Processing...' : 'Process with AI'}
                    </Button>
                  )}

                  {mealEntries.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeMealEntry(entry.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Food Items Input */}
              <div className="space-y-3">
                <Label>Food Items</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 2 eggs, 1 slice bread, 1 tbsp butter"
                    value={itemInputs[entry.id] || ''}
                    onChange={(e) => setItemInputs(prev => ({ ...prev, [entry.id]: e.target.value }))}
                    onKeyPress={(e) => handleItemInputKeyPress(e, entry.id)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addItemToEntry(entry.id, itemInputs[entry.id] || '')}
                    disabled={!(itemInputs[entry.id] || '').trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Display Added Items */}
                {entry.items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.items.map((item, itemIndex) => (
                      <Badge
                        key={itemIndex}
                        variant="secondary"
                        className="text-sm px-3 py-1 flex items-center gap-1"
                      >
                        {item}
                        <button
                          onClick={() => removeItemFromEntry(entry.id, itemIndex)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Result Display */}
              {entry.aiResult && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Meal Logged Successfully!</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-primary" />
                    <span className="font-medium">{entry.aiResult.meal_name}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Calories:</span> {entry.aiResult.macros.calories}
                    </div>
                    <div>
                      <span className="font-medium">Protein:</span> {entry.aiResult.macros.protein}g
                    </div>
                    <div>
                      <span className="font-medium">Carbs:</span> {entry.aiResult.macros.carbs}g
                    </div>
                    <div>
                      <span className="font-medium">Fat:</span> {entry.aiResult.macros.fat}g
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetEntry(entry.id)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Log Another Meal
                    </Button>
                  </div>
                </div>
              )}

              {/* Notes and Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    value={entry.notes || ''}
                    onChange={(e) => updateEntryNotes(entry.id, e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating (optional)</Label>
                  <Select
                    value={entry.rating?.toString() || ''}
                    onValueChange={(value) => updateEntryRating(entry.id, value ? parseFloat(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate this meal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">⭐ 1 - Poor</SelectItem>
                      <SelectItem value="2">⭐⭐ 2 - Fair</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 3 - Good</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 4 - Very Good</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}

          {/* Add Another Meal Button */}
          {!editingMealLog && (
            <Button
              type="button"
              variant="outline"
              onClick={addMealEntry}
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Meal
            </Button>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {!editingMealLog && hasMultipleEntries && (
              <Button
                type="button"
                onClick={processBatchWithAI}
                disabled={!canProcessBatch}
                className="w-full flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : `Process All ${mealEntries.length} Meals`}
              </Button>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Close
              </Button>

              {!editingMealLog && mealEntries.some(entry => entry.aiResult) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAllEntries}
                  className="flex-1 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Start Fresh
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}