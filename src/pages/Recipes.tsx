import { useState } from 'react';
import { Plus, Search, Clock, Users, Edit, Heart, Trash2, Bot, Utensils, Tag } from 'lucide-react';
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
import { TagDialog } from '../components/TagDialog';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeTagManagement, useTags } from '../hooks/useTags';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '../types';

export default function Recipes() {
  const { recipes, searchQuery, setSearchQuery, performSearch, addRecipe, updateRecipe, toggleFavorite, deleteRecipe, usingMockData, error } = useRecipes();
  const { allTags } = useTags();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
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

  const handleRecipeGenerated = async (generatedRecipe: Omit<Recipe, 'id' | 'is_favorite'> & { tagIds?: string[] }) => {
    try {
      const { tagIds, ...recipeData } = generatedRecipe;
      await addRecipe({ 
        ...recipeData, 
        selectedTagIds: tagIds 
      });
      toast({
        title: 'AI Recipe Added!',
        description: `"${generatedRecipe.name}" has been generated and saved successfully with auto-assigned tags.`,
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => setIsTagDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Tag className="h-4 w-4" />
            Manage Tags
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsGeneratorDialogOpen(true)}
            className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Bot className="h-4 w-4" />
            Generate Recipe with AI
          </Button>
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
            placeholder="Search recipes by name, instructions, or ingredients..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              // Use enhanced search if available, otherwise fall back to basic filtering
              if (performSearch) {
                performSearch(value, selectedTagIds.map(id => parseInt(id)));
              }
            }}
            className="pl-10"
          />
          {!usingMockData && searchQuery && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="secondary" className="text-xs">
                Full-text search
              </Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Label className="text-sm whitespace-nowrap mb-2 block">Filter by tags:</Label>
            <MultiSelect
              options={allTags.map(tag => ({ label: tag.name, value: tag.id }))}
              onValueChange={(tagIds) => {
                setSelectedTagIds(tagIds);
                // Trigger search with updated tag filter
                if (performSearch && searchQuery) {
                  performSearch(searchQuery, tagIds.map(id => parseInt(id)));
                }
              }}
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
                <div className="space-y-4">
                  {/* Enhanced Header Section */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg sm:text-xl text-foreground leading-tight">{recipe.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{recipe.servings} servings</span>
                        </div>
                        {recipe.total_time_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{recipe.total_time_minutes} min</span>
                          </div>
                        )}
                      </div>
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {recipe.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs text-white font-medium"
                              style={{ backgroundColor: tag.color, borderColor: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Action Buttons - Mobile Optimized */}
                    <div className="flex gap-2">
                      {/* Cook Button - Primary Action */}
                      <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90" aria-label="Cook this recipe">
                        <Link to={`/recipes/${recipe.id}`}>
                          <Utensils className="h-4 w-4" />
                        </Link>
                      </Button>
                      {/* Heart Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(recipe.id)}
                        aria-label="Toggle favorite"
                        className="hover:bg-pink-50 hover:text-pink-600"
                      >
                        <Heart
                          className={`h-4 w-4 ${recipe.is_favorite ? 'text-pink-600' : ''}`}
                          fill={recipe.is_favorite ? 'currentColor' : 'none'}
                        />
                      </Button>
                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRecipe(recipe)}
                        aria-label="Edit recipe"
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm({ open: true, recipe })}
                        className="text-destructive hover:text-destructive hover:bg-red-50"
                        aria-label="Delete recipe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Nutrition Display */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Nutrition per serving
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                        <div className="text-xl font-bold text-blue-600">{recipe.nutrition.calories_per_serving.toFixed(0)}</div>
                        <div className="text-xs text-gray-600 font-medium">Calories</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                        <div className="text-xl font-bold text-green-600">{recipe.nutrition.protein_per_serving.toFixed(1)}g</div>
                        <div className="text-xs text-gray-600 font-medium">Protein</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
                        <div className="text-xl font-bold text-orange-600">{recipe.nutrition.carbs_per_serving.toFixed(1)}g</div>
                        <div className="text-xs text-gray-600 font-medium">Carbs</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
                        <div className="text-xl font-bold text-purple-600">{recipe.nutrition.fat_per_serving.toFixed(1)}g</div>
                        <div className="text-xs text-gray-600 font-medium">Fat</div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Summary Info */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-700">Ready to cook</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {recipe.ingredients.length} ingredients • {recipe.instructions.split('\n').filter(step => step.trim()).length} steps
                      </div>
                    </div>
                    {recipe.notes && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 italic">"{recipe.notes}"</p>
                      </div>
                    )}
                  </div>
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

        {/* Tag Management Dialog */}
        <TagDialog
          open={isTagDialogOpen}
          onOpenChange={setIsTagDialogOpen}
        />
      </div>
    </Layout>
  );
}
