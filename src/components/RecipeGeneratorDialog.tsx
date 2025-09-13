import React, { useState } from 'react';
import { Bot, Plus, Loader2, Search, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GroupedMultiSelect, OptionGroup, GroupedOption } from '@/components/ui/grouped-multi-select';
import { useToast } from '@/hooks/use-toast';
import { Recipe, FoodItem, RecipeIngredient } from '../types';
import { useInventorySearch } from '../hooks/useInventorySearch';
import { useTags } from '../hooks/useTags';
import { RecipePreviewDialog } from './RecipePreviewDialog';
// calculateRecipeNutrition not used here; parsing uses aiJson utilities
import { parseFirstJsonObject } from '../lib/aiJson';
import { CUISINE_STYLES, DIETARY_RESTRICTIONS } from '../lib/constants';

interface RecipeGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeGenerated: (recipe: Omit<Recipe, 'id' | 'is_favorite'> & { tagIds?: string[] }) => void;
}


export function RecipeGeneratorDialog({ open, onOpenChange, onRecipeGenerated }: RecipeGeneratorDialogProps) {
  const [customIngredients, setCustomIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<FoodItem[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [useInventoryOnly, setUseInventoryOnly] = useState(false);
  const [servings, setServings] = useState('4');
  const [cuisineStyle, setCuisineStyle] = useState('none');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('paleo');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Omit<Recipe, 'id' | 'is_favorite'> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { allItems } = useInventorySearch();
  const { allTags } = useTags();

  // Group items by category for the GroupedMultiSelect (in-stock items only)
  const groupedIngredients: OptionGroup = React.useMemo(() => {
    const groups: OptionGroup = {};
    
    // Filter to only include in-stock items
    allItems.filter(item => item.in_stock).forEach(item => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({
        label: item.name, // Only show name, no brand
        value: item.id,
      });
    });
    
    // Sort items within each category by name
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.label.localeCompare(b.label));
    });
    
    return groups;
  }, [allItems]);

  // Handle ingredient selection from MultiSelect
  const handleIngredientSelectionChange = (selectedIds: string[]) => {
    setSelectedIngredientIds(selectedIds);
    
    // Update selectedIngredients array based on selection
    const newSelectedIngredients = selectedIds.map(itemId => {
      return allItems.find(item => item.id === itemId)!;
    }).filter(Boolean);
    
    setSelectedIngredients(newSelectedIngredients);
  };

  const generateRecipe = async () => {
    const hasCustomIngredients = customIngredients.trim().length > 0;
    const hasSelectedIngredients = selectedIngredients.length > 0;
    
    if (!hasCustomIngredients && !hasSelectedIngredients) {
      toast({
        title: 'No ingredients',
        description: 'Please enter at least one ingredient to generate a recipe.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Combine custom ingredients and inventory ingredients
      const customIngredientsList = customIngredients.split(',').map(s => s.trim()).filter(Boolean);
      const allIngredientNames = [
        ...customIngredientsList,
        ...selectedIngredients.map(item => item.name)
      ];
      
      // Create user prompt with selected ingredients and available tags
      const availableTagsList = allTags.map(tag => tag.name).join(', ');
      
      const userPrompt = `Create a ${dietaryRestrictions !== 'none' ? dietaryRestrictions : 'healthy'} recipe using these ingredients:
${allIngredientNames.map(name => `- ${name}`).join('\n')}

Target: serves ${servings || '4'}${cuisineStyle && cuisineStyle !== 'none' ? `, ${cuisineStyle} style` : ''}, total time ≈ 30-45 minutes.
${additionalNotes ? `\nAdditional requirements: ${additionalNotes}` : ''}

Available tags to choose from: ${availableTagsList}

Please auto-assign relevant tags from the available list based on the recipe characteristics (diet type, meal category, cooking method, etc.).

IMPORTANT:
- Use specific measurements in both ingredients AND instructions (e.g., "2 tsp oregano", "3 tbsp olive oil").
- Calculate accurate nutrition values based on the specific ingredients and quantities used.

Output: Return a single JSON object ONLY. No explanations, no markdown, no code fences.`;

      // Call OpenRouter API with streamlined approach
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "FoodTracker Recipe Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "microsoft/mai-ds-r1:free",
          "temperature": 0.3,
          "top_p": 0.9,
          "max_tokens": 2000,
          // Prefer JSON mode if the route honors it
          "response_format": { "type": "json_object" },
          "messages": [
            {
              "role": "system",
              "content": `Return only valid JSON. Output a single JSON object, with no code fences and no extra text. Use this exact schema:
{
  "name": "Recipe Name",
  "instructions": "Step by step cooking instructions as one paragraph.",
  "servings": 4,
  "total_time_minutes": 30,
  "ingredient_list": ["2 cups flour", "1 tsp salt", "3 large eggs"],
  "nutrition": {
    "calories_per_serving": 350,
    "protein_per_serving": 12,
    "carbs_per_serving": 45,
    "fat_per_serving": 8
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- Only include ingredients in the recipe that you actually use in the instructions.
- Don't feel obligated to use every ingredient provided - only use what makes sense for the recipe.
- CRITICAL: Ingredient quantities must match exactly what's used in instructions. If instructions say "1 tsp salt", ingredients must list "1 tsp salt", not "As needed salt".
- Calculate realistic nutrition values based on the specific ingredients and quantities used.
- Select relevant tags from the available tags list provided by the user.
- Do not add any commentary before or after the JSON.`
            },
            {
              "role": "user",
              "content": userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content as string | undefined;
      if (!generatedText || typeof generatedText !== 'string') {
        console.error('AI returned empty or invalid content:', generatedText);
        throw new Error('Failed to parse AI response');
      }

      // Try to extract JSON from the response (robust)
      let parsedRecipe: {
        name: string;
        instructions: string;
        servings: number;
        total_time_minutes: number;
        ingredient_list: string[];
        nutrition: {
          calories_per_serving: number;
          protein_per_serving: number;
          carbs_per_serving: number;
          fat_per_serving: number;
        };
        tags?: string[];
      };
      try {
        parsedRecipe = parseFirstJsonObject(generatedText);
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON:', parseError);
        console.warn('Raw AI response:', generatedText);
        
        // Notify user about the failure
        toast({
          title: 'AI Generation Failed',
          description: 'Failed to generate recipe. Please try again or check your API configuration.',
          variant: 'destructive',
        });
        
        // Don't create fallback recipe - just throw the error
        throw new Error('Failed to parse AI response');
      }

      // Validate nutrition data
      const nutrition = parsedRecipe.nutrition || {
        calories_per_serving: 300,
        protein_per_serving: 10,
        carbs_per_serving: 30,
        fat_per_serving: 10
      };

      // Parse and format instructions properly
      const formatInstructions = (instructions: string) => {
        // First handle any escaped newlines
        let formatted = instructions.replace(/\\n/g, '\n');
        
        // If instructions are in a single paragraph with "Step X:" format, split them
        if (formatted.includes('Step ') && !formatted.includes('\n')) {
          // Split by "Step X:" pattern and rejoin with newlines
          formatted = formatted
            .split(/Step \d+:\s*/)
            .filter(step => step.trim().length > 0)
            .map((step, index) => `${index + 1}. ${step.trim()}`)
            .join('\n');
        } 
        // If instructions are in a single paragraph with sentences, split by periods
        else if (!formatted.includes('\n') && formatted.includes('.')) {
          // Split by sentences and create numbered steps
          const sentences = formatted
            .split('.')
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0);
          
          if (sentences.length > 1) {
            formatted = sentences
              .map((sentence, index) => `${index + 1}. ${sentence}.`)
              .join('\n');
          }
        }
        
        return formatted;
      };

      // Map AI-suggested tags to actual tag IDs
      const suggestedTagIds: string[] = [];
      if (parsedRecipe.tags && Array.isArray(parsedRecipe.tags)) {
        parsedRecipe.tags.forEach(tagName => {
          const matchingTag = allTags.find(tag => 
            tag.name.toLowerCase() === tagName.toLowerCase()
          );
          if (matchingTag) {
            suggestedTagIds.push(matchingTag.id);
          }
        });
      }

      const finalRecipe = {
        name: parsedRecipe.name,
        instructions: formatInstructions(parsedRecipe.instructions),
        servings: parsedRecipe.servings || parseInt(servings) || 4,
        total_time_minutes: parsedRecipe.total_time_minutes || 30,
        ingredients: [], // Empty for AI recipes
        ingredient_list: parsedRecipe.ingredient_list || allIngredientNames,
        nutrition_source: 'ai_generated' as const,
        nutrition: nutrition,
        tagIds: suggestedTagIds
      };

      setGeneratedRecipe(finalRecipe);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Recipe generation failed:', error);
      
      // More specific error handling
      if (error instanceof Error && error.message.includes('API request failed')) {
        toast({
          title: 'API Connection Failed',
          description: 'Unable to connect to AI service. Please check your internet connection and API configuration.',
          variant: 'destructive',
        });
      } else if (error instanceof Error && error.message.includes('Failed to parse')) {
        // Parsing error notification already shown above
      } else {
        toast({
          title: 'Generation Failed',
          description: 'Unable to generate recipe. Please try again with different ingredients.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const adjustServings = (increment: boolean) => {
    const currentValue = parseInt(servings) || 4;
    const newValue = increment ? currentValue + 1 : Math.max(1, currentValue - 1);
    setServings(newValue.toString());
  };

  const resetForm = () => {
    setSelectedIngredients([]);
    setSelectedIngredientIds([]);
    setServings('4');
    setCuisineStyle('none');
    setDietaryRestrictions('paleo');
    setAdditionalNotes('');
    setGeneratedRecipe(null);
    setShowPreview(false);
  };

  const handleAcceptRecipe = () => {
    if (generatedRecipe) {
      onRecipeGenerated(generatedRecipe);
      resetForm();
      onOpenChange(false);
      
      toast({
        title: 'Recipe saved!',
        description: 'Your AI-generated recipe has been saved successfully.',
      });
    }
  };

  const handleDeclineRecipe = () => {
    setShowPreview(false);
    setGeneratedRecipe(null);
    
    toast({
      title: 'Recipe declined',
      description: 'You can generate a new recipe with different parameters.',
    });
  };

  const handleClose = () => {
    if (!isGenerating) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showPreview} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Generate Recipe with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Custom Ingredients Input */}
          <div className="space-y-3">
            <Label>Custom Ingredients</Label>
            <p className="text-sm text-muted-foreground">
              Enter ingredients you want to use (comma-separated)
            </p>
            <Input
              value={customIngredients}
              onChange={(e) => setCustomIngredients(e.target.value)}
              placeholder="e.g., chicken breast, olive oil, garlic, bell peppers"
              disabled={isGenerating}
              className="w-full"
            />
          </div>

          {/* Optional: Ingredients from Inventory */}
          <div className="space-y-3">
            <Label>+ Ingredients from Your Inventory (optional)</Label>
            <GroupedMultiSelect
              optionGroups={groupedIngredients}
              onValueChange={handleIngredientSelectionChange}
              defaultValue={selectedIngredientIds}
              placeholder="Search and select in-stock ingredients..."
              maxCount={3}
            />
          </div>

          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings">Number of Servings</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustServings(false)}
                disabled={isGenerating}
                className="h-9 w-9 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="servings"
                type="text"
                placeholder="e.g. 4 or 4-6"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                disabled={isGenerating}
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustServings(true)}
                disabled={isGenerating}
                className="h-9 w-9 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cuisine Style */}
          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Style (optional)</Label>
            <Select value={cuisineStyle} onValueChange={setCuisineStyle} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a cuisine style..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No preference</SelectItem>
                {CUISINE_STYLES.map((style) => (
                  <SelectItem key={style} value={style.toLowerCase()}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Restrictions (optional)</Label>
            <Select value={dietaryRestrictions} onValueChange={setDietaryRestrictions} disabled={isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select dietary restriction..." />
              </SelectTrigger>
              <SelectContent>
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <SelectItem key={restriction.value} value={restriction.value}>
                    {restriction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special preferences, cooking methods, or requirements (e.g., 'make it spicy', 'one-pot meal', 'kid-friendly')..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              disabled={isGenerating}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={generateRecipe}
              disabled={(!customIngredients.trim() && selectedIngredients.length === 0) || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Recipe
                </>
              )}
            </Button>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      <RecipePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        recipe={generatedRecipe}
        onAccept={handleAcceptRecipe}
        onDecline={handleDeclineRecipe}
        ingredients={selectedIngredients}
      />
    </>
  );
}
