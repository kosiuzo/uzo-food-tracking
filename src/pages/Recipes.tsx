import { useState } from 'react';
import { Plus, Search, Clock, Users, Edit, ChevronDown, ChevronUp, Heart, Trash2, Bot, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout } from '../components/Layout';
import { AddRecipeDialog } from '../components/AddRecipeDialog';
import { RecipeGeneratorDialog } from '../components/RecipeGeneratorDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useRecipes } from '../hooks/useRecipes';
import { useFoodInventory } from '../hooks/useFoodInventory';
import { useRecipeTagManagement, useTags } from '../hooks/useTags';
import { useToast } from '@/hooks/use-toast';
import { MEAL_TYPES } from '@/constants/mealTypes';
import { Recipe } from '../types';

export default function Recipes() {
  const { recipes, searchQuery, setSearchQuery, addRecipe, updateRecipe, toggleFavorite, deleteRecipe, usingMockData, error } = useRecipes();
  const { allItems } = useFoodInventory();
  const { allTags } = useTags();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; recipe: Recipe | null }>({ open: false, recipe: null });

  const displayedRecipes = recipes
    .filter(recipe => favoritesOnly ? recipe.is_favorite : true)
    .filter(recipe => {
      if (selectedTagIds.length === 0) return true;
      return selectedTagIds.some(tagId => 
        recipe.tags?.some(tag => tag.id === tagId)
      );
    });
  const toggleRecipeExpansion = (recipeId: string) => {
    setExpandedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe.id);
    setIsAddDialogOpen(true);
  };

  const handleDeleteRecipe = async () => {
    if (!deleteConfirm.recipe) return;
    
    try {
      await deleteRecipe(deleteConfirm.recipe.id);
      toast({
        title: 'Recipe deleted',
        description: `${deleteConfirm.recipe.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete recipe. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRecipeGenerated = async (generatedRecipe: Omit<Recipe, 'id' | 'is_favorite'>) => {
    try {
      await addRecipe(generatedRecipe);
      toast({
        title: 'AI Recipe Added!',
        description: `"${generatedRecipe.name}" has been generated and saved successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save the generated recipe. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recipes</h1>
            <p className="text-muted-foreground">Manage your recipes and favorites</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsGeneratorDialogOpen(true)}
              className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Bot className="h-4 w-4" />
              Generate Recipe with AI
            </Button>
            <Link to="/meal-prep-generator">
              <Button variant="outline" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Meal Prep
              </Button>
            </Link>
          </div>
        </div>

        {/* Mock Data Indicator */}
        {usingMockData && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <p className="text-sm text-amber-800">
                <strong>Demo Mode:</strong> Showing sample recipes with beautiful food images. 
                Connect to Supabase to see your real recipes.
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !usingMockData && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{recipes.length}</div>
            <div className="text-sm text-muted-foreground">Total Recipes</div>
          </div>
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{recipes.filter(r => r.is_favorite).length}</div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Label className="text-sm whitespace-nowrap mb-2 block">Filter by tags:</Label>
            <MultiSelect
              options={allTags.map(tag => ({ label: tag.name, value: tag.id }))}
              onValueChange={setSelectedTagIds}
              defaultValue={selectedTagIds}
              placeholder="Select tags to filter..."
              maxCount={5}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="favorites-only" checked={favoritesOnly} onCheckedChange={setFavoritesOnly} />
            <Label htmlFor="favorites-only" className="text-sm">Favorites only</Label>
          </div>
        </div>

        {/* Recipes List */}
        <div className="space-y-3">
{displayedRecipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recipes found</p>
            </div>
          ) : (
            displayedRecipes.map(recipe => (
              <Card key={recipe.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{recipe.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {recipe.servings} servings
                        </div>
                        {recipe.total_time_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {recipe.total_time_minutes} min
                          </div>
                        )}
                      </div>
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recipe.tags.map((tag) => (
                            <Badge 
                              key={tag.id} 
                              variant="outline" 
                              className="text-xs text-white"
                              style={{ backgroundColor: tag.color, borderColor: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
<div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(recipe.id)}
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          className={`h-4 w-4 ${recipe.is_favorite ? 'text-primary' : ''}`}
                          fill={recipe.is_favorite ? 'currentColor' : 'none'}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRecipe(recipe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm({ open: true, recipe })}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRecipeExpansion(recipe.id)}
                      >
                        {expandedRecipes.has(recipe.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Nutrition per serving */}
                  <div className="flex gap-4 text-xs">
                    <Badge variant="secondary">
                      {recipe.nutrition.calories_per_serving.toFixed(1)} cal
                    </Badge>
                    <span className="text-muted-foreground">
                      P: {recipe.nutrition.protein_per_serving.toFixed(1)}g
                    </span>
                    <span className="text-muted-foreground">
                      C: {recipe.nutrition.carbs_per_serving.toFixed(1)}g
                    </span>
                    <span className="text-muted-foreground">
                      F: {recipe.nutrition.fat_per_serving.toFixed(1)}g
                    </span>
                  </div>

                                    {/* Ingredients list */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-gray-800">Ingredients ({recipe.ingredients.length})</p>
                    </div>
                    <div className="space-y-2.5" aria-live="polite">
                      {(expandedRecipes.has(recipe.id) ? recipe.ingredients : recipe.ingredients.slice(0, 3)).map((ingredient, idx) => {
                        const item = allItems.find(item => item.id === ingredient.item_id);
                        return (
                          <div key={idx} className="flex items-center gap-3 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900">{ingredient.quantity}</span>
                              <span className="text-sm text-gray-500 ml-1">{ingredient.unit}</span>
                              <span className="text-gray-700 ml-2 font-medium">{item?.name || 'Unknown item'}</span>
                            </div>
                          </div>
                        );
                      })}
                      {!expandedRecipes.has(recipe.id) && recipe.ingredients.length > 3 && (
                        <div className="text-xs text-gray-500 ml-9 bg-gray-50 rounded-lg p-2 border border-gray-100">+ {recipe.ingredients.length - 3} more ingredients</div>
                      )}
                    </div>
                  </div>

                  {/* Instructions - only show when expanded */}
                  {expandedRecipes.has(recipe.id) && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-semibold text-gray-800">Instructions</p>
                      </div>
                      <div className="space-y-3">
                        {recipe.instructions.split('\n').filter(step => step.trim()).map((step, idx) => (
                          <div key={idx} className="flex gap-3 text-sm bg-green-50 rounded-lg p-3 border border-green-100">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </div>
                            <div className="text-gray-700 leading-relaxed">{step.trim().replace(/^\d+\.\s*/, '')}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Notes - only show when expanded and notes exist */}
                      {recipe.notes && (
                        <div className="space-y-3 border-t pt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <p className="text-sm font-semibold text-gray-800">Notes</p>
                          </div>
                          <div className="text-sm bg-purple-50 rounded-lg p-3 border border-purple-100">
                            <div className="text-gray-700 leading-relaxed">{recipe.notes}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Floating Add Button */}
        <Button
          className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Add/Edit Recipe Dialog */}
        <AddRecipeDialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) setEditingRecipe(null);
          }}
          onSave={async (recipeData) => {
            const { selectedTagIds, ...recipeWithoutTags } = recipeData;
            
            if (editingRecipe) {
              await updateRecipe(editingRecipe, { ...recipeWithoutTags, selectedTagIds });
            } else {
              await addRecipe({ ...recipeWithoutTags, selectedTagIds });
            }
            setIsAddDialogOpen(false);
            setEditingRecipe(null);
          }}
          editingRecipe={editingRecipe ? recipes.find(r => r.id === editingRecipe) : undefined}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm({ open, recipe: open ? deleteConfirm.recipe : null })}
          title="Delete Recipe"
          description={`Are you sure you want to delete "${deleteConfirm.recipe?.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteRecipe}
          confirmText="Delete"
          variant="destructive"
        />

        {/* Recipe Generator Dialog */}
        <RecipeGeneratorDialog
          open={isGeneratorDialogOpen}
          onOpenChange={setIsGeneratorDialogOpen}
          onRecipeGenerated={handleRecipeGenerated}
        />
      </div>
    </Layout>
  );
}