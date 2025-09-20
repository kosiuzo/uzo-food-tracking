import { useState, useEffect, useRef } from 'react';
import { Search, Clock, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MealLog } from '../types';
import { getTodayLocalDate } from '@/lib/utils';

interface MealRelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealLogs: MealLog[];
  onRelogMeal: (mealLog: MealLog, multiplier: number, notes?: string, eatenOn?: string) => Promise<void>;
}

export function MealRelogDialog({ open, onOpenChange, mealLogs, onRelogMeal }: MealRelogDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealLog | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [eatenOn, setEatenOn] = useState(getTodayLocalDate());
  const [isRelogging, setIsRelogging] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSelectedMeal(null);
      setMultiplier(1);
      setAdditionalNotes('');
      setEatenOn(getTodayLocalDate());
      setIsKeyboardVisible(false);
    }
  }, [open]);

  // Handle keyboard visibility on mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        // Detect if keyboard is likely visible on mobile
        const isMobile = window.innerWidth <= 768;
        const heightDifference = window.screen.height - window.innerHeight;
        const keyboardThreshold = 150; // Adjust this value as needed

        if (isMobile && heightDifference > keyboardThreshold) {
          setIsKeyboardVisible(true);
        } else {
          setIsKeyboardVisible(false);
        }
      }
    };

    // Handle focus events to scroll input into view
    const handleFocus = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setTimeout(() => {
          e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 300); // Delay to allow keyboard animation
      }
    };

    if (open) {
      window.addEventListener('resize', handleResize);
      document.addEventListener('focusin', handleFocus);
      handleResize(); // Check initial state
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [open]);

  // Filter meals based on search query
  const filteredMeals = mealLogs.filter(meal =>
    meal.meal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.items?.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get unique meals by name (most recent version of each meal)
  const uniqueMeals = filteredMeals.reduce((acc, meal) => {
    const existing = acc.find(m => m.meal_name === meal.meal_name);
    if (!existing || new Date(meal.created_at) > new Date(existing.created_at)) {
      const filtered = acc.filter(m => m.meal_name !== meal.meal_name);
      filtered.push(meal);
      return filtered;
    }
    return acc;
  }, [] as MealLog[]);

  const handleMealSelect = (meal: MealLog) => {
    setSelectedMeal(meal);
  };

  const handleRelogMeal = async () => {
    if (!selectedMeal) return;

    try {
      setIsRelogging(true);

      // Create notes combining original notes and additional notes
      const combinedNotes = [
        selectedMeal.notes,
        additionalNotes && `Re-logged with ${multiplier}x multiplier: ${additionalNotes}`
      ].filter(Boolean).join(' | ');

      await onRelogMeal(selectedMeal, multiplier, combinedNotes, eatenOn);

      toast({
        title: 'Meal re-logged successfully',
        description: `${selectedMeal.meal_name} (${multiplier}x) has been logged for ${eatenOn === getTodayLocalDate() ? 'today' : eatenOn}.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to re-log meal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRelogging(false);
    }
  };

  const adjustMultiplier = (delta: number) => {
    setMultiplier(Math.max(0.25, multiplier + delta));
  };

  const formatDate = (dateString: string) => {
    const today = getTodayLocalDate();
    if (dateString === today) return 'Today';

    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-2xl ${isKeyboardVisible ? 'max-h-[50vh]' : 'max-h-[90vh]'} overflow-y-auto`}
        style={isKeyboardVisible ? {
          position: 'fixed',
          top: '10px',
          transform: 'translateX(-50%)',
          left: '50%'
        } : undefined}
      >
        <DialogHeader>
          <DialogTitle>Re-log Previous Meal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="space-y-2">
            <Label htmlFor="meal-search">Search Meals</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                id="meal-search"
                placeholder="Search by meal name or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoComplete="off"
                inputMode="search"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-2">
              <Label>Search Results ({uniqueMeals.length} meals)</Label>
              <div className={`${isKeyboardVisible ? 'max-h-32' : 'max-h-64'} overflow-y-auto space-y-2`}>
                {uniqueMeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No meals found matching "{searchQuery}"
                  </p>
                ) : (
                  uniqueMeals.map((meal) => (
                    <Card
                      key={meal.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedMeal?.id === meal.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleMealSelect(meal)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{meal.meal_name}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(meal.eaten_on)}
                          </div>
                        </div>

                        {/* Items */}
                        {meal.items && meal.items.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {meal.items.slice(0, 3).map((item, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {item.length > 15 ? item.substring(0, 15) + '...' : item}
                              </Badge>
                            ))}
                            {meal.items.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{meal.items.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Nutrition */}
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span>{meal.macros?.calories?.toFixed(0) || 0} cal</span>
                          <span>P: {meal.macros?.protein?.toFixed(1) || 0}g</span>
                          <span>C: {meal.macros?.carbs?.toFixed(1) || 0}g</span>
                          <span>F: {meal.macros?.fat?.toFixed(1) || 0}g</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Selected Meal Details */}
          {selectedMeal && (
            <div className="space-y-4 border-t pt-4">
              <Label>Selected Meal Details</Label>

              <Card className="p-4 bg-primary/5">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{selectedMeal.meal_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Originally eaten on {formatDate(selectedMeal.eaten_on)}
                    </p>
                  </div>

                  {/* All Items */}
                  {selectedMeal.items && selectedMeal.items.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Items:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedMeal.items.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Original Notes */}
                  {selectedMeal.notes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Original Notes:</p>
                      <p className="text-sm">{selectedMeal.notes}</p>
                    </div>
                  )}

                  {/* Nutrition - Updated with multiplier */}
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium">
                      {((selectedMeal.macros?.calories || 0) * multiplier).toFixed(1)} cal
                    </span>
                    <span>P: {((selectedMeal.macros?.protein || 0) * multiplier).toFixed(1)}g</span>
                    <span>C: {((selectedMeal.macros?.carbs || 0) * multiplier).toFixed(1)}g</span>
                    <span>F: {((selectedMeal.macros?.fat || 0) * multiplier).toFixed(1)}g</span>
                  </div>
                </div>
              </Card>

              {/* Quantity Multiplier */}
              <div className="space-y-2">
                <Label>Quantity Multiplier</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustMultiplier(-0.25)}
                    disabled={multiplier <= 0.25}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-medium">{multiplier}x</span>
                    <p className="text-xs text-muted-foreground">
                      ~{Math.round((selectedMeal.macros?.calories || 0) * multiplier)} calories
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustMultiplier(0.25)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1, 1.5, 2].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={multiplier === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMultiplier(value)}
                      className="flex-1"
                    >
                      {value}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="eaten-on">Date to Log</Label>
                <Input
                  id="eaten-on"
                  type="date"
                  value={eatenOn}
                  onChange={(e) => setEatenOn(e.target.value)}
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additional-notes"
                  placeholder="Add any notes about this re-logged meal..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRelogMeal}
                  disabled={isRelogging}
                  className="flex-1"
                >
                  {isRelogging ? 'Re-logging...' : `Re-log ${multiplier}x`}
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!selectedMeal && !searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                Search for a previously logged meal to re-log it with optional quantity adjustments.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}