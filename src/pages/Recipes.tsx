import { useState } from 'react';
import { Plus, Search, Clock, Users, Heart, MoreVertical, Filter, Wand2, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Layout } from '../components/Layout';
import { AddRecipeDialog } from '../components/AddRecipeDialog';
import { RecipeGeneratorDialog } from '../components/RecipeGeneratorDialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useRecipes } from '../hooks/useRecipes';
import { useTags } from '../hooks/useTags';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Recipe } from '../types';

export default function Recipes() {
  const { recipes, searchQuery, setSearchQuery, performSearch, addRecipe, updateRecipe, toggleFavorite, deleteRecipe, usingMockData, error } = useRecipes();
  const { allTags } = useTags();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('all');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [activeTagFilter, setActiveTagFilter] = useState('All');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; recipe: Recipe | null }>({ open: false, recipe: null });

  // Filter state
  const [filterSearchQuery, setFilterSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('Any');
  const [servingsFilter, setServingsFilter] = useState('Any');
  const [sortBy, setSortBy] = useState('A–Z');

  // Predefined tag options for quick filtering
  const predefinedTags = ['All', 'High-Protein', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Keto', '30-min', '5-ingred'];

  // Helper function to get ingredient count for both regular and AI-generated recipes
  const getIngredientCount = (recipe: Recipe): number => {
    if (recipe.ingredient_list && recipe.ingredient_list.length > 0) {
      return recipe.ingredient_list.length;
    }
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      return recipe.ingredients.length;
    }
    return 0;
  };

  // Enhanced filtering logic
  const filteredRecipes = recipes
    .filter(recipe => {
      // View mode filter (all vs favorites)
      if (viewMode === 'favorites' && !recipe.is_favorite) return false;

      // Search filter (from filter sheet)
      if (filterSearchQuery) {
        const query = filterSearchQuery.toLowerCase();
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const ingredientMatch = recipe.ingredient_list?.some(ing =>
          ing.toLowerCase().includes(query)
        ) || false;
        const tagMatch = recipe.tags?.some(tag =>
          tag.name.toLowerCase().includes(query)
        ) || false;
        if (!nameMatch && !ingredientMatch && !tagMatch) return false;
      }

      // Tag filter
      if (activeTagFilter !== 'All') {
        const hasMatchingTag = recipe.tags?.some(tag =>
          tag.name.toLowerCase().includes(activeTagFilter.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      // Multi-select tag filter (from filter sheet)
      if (selectedTagIds.length > 0) {
        const hasSelectedTag = selectedTagIds.some(tagId =>
          recipe.tags?.some(tag => tag.id === tagId)
        );
        if (!hasSelectedTag) return false;
      }

      // Time filter
      if (timeFilter !== 'Any' && recipe.total_time_minutes) {
        const timeLimit = parseInt(timeFilter.replace(/[^0-9]/g, ''));
        if (recipe.total_time_minutes > timeLimit) return false;
      }

      // Servings filter
      if (servingsFilter !== 'Any') {
        if (servingsFilter === '1–2' && recipe.servings > 2) return false;
        if (servingsFilter === '3–4' && (recipe.servings < 3 || recipe.servings > 4)) return false;
        if (servingsFilter === '5+' && recipe.servings < 5) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'A–Z':
          return a.name.localeCompare(b.name);
        case 'Recently added':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'Cook time':
          return (a.total_time_minutes || Infinity) - (b.total_time_minutes || Infinity);
        case 'Favorites':
          return (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0);
        default:
          return 0;
      }
    });

  const favoriteCount = recipes.filter(r => r.is_favorite).length;
  

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
      setDeleteConfirm({ open: false, recipe: null });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete recipe. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleFilterApply = () => {
    setIsFilterSheetOpen(false);
  };

  const handleFilterReset = () => {
    setFilterSearchQuery('');
    setSelectedTagIds([]);
    setTimeFilter('Any');
    setServingsFilter('Any');
    setSortBy('A–Z');
  };

  const handleFavoriteToggle = async (recipe: Recipe) => {
    try {
      await toggleFavorite(recipe.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite. Please try again.',
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

  const emptyStateContent = filteredRecipes.length === 0 ? (
    filterSearchQuery || activeTagFilter !== 'All' || selectedTagIds.length > 0 || viewMode === 'favorites' ? (
      // No search results
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recipes match</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Try removing a tag or changing filters.
        </p>
      </div>
    ) : (
      // No recipes at all
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No recipes yet</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Start by creating a recipe or importing one.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => setIsGeneratorDialogOpen(true)} className="gap-2">
            <Wand2 className="h-4 w-4" />
            Create with AI
          </Button>
          <Button variant="secondary" onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add manually
          </Button>
        </div>
      </div>
    )
  ) : null;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">

        {/* Action Row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[90vh]" : ""}>
                <SheetHeader>
                  <SheetTitle>Filter & Sort</SheetTitle>
                </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Search name, ingredients, tags"
                    value={filterSearchQuery}
                    onChange={(e) => setFilterSearchQuery(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Tags</label>
                  <MultiSelect
                    options={allTags.map(tag => ({ label: tag.name, value: tag.id }))}
                    onValueChange={setSelectedTagIds}
                    defaultValue={selectedTagIds}
                    placeholder="Select tags..."
                    maxCount={3}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Cook time</label>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="<= 15 min">≤ 15 min</SelectItem>
                      <SelectItem value="<= 30 min">≤ 30 min</SelectItem>
                      <SelectItem value="<= 45 min">≤ 45 min</SelectItem>
                      <SelectItem value="<= 60 min">≤ 60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Servings</label>
                  <Select value={servingsFilter} onValueChange={setServingsFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="1–2">1–2</SelectItem>
                      <SelectItem value="3–4">3–4</SelectItem>
                      <SelectItem value="5+">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A–Z">A–Z</SelectItem>
                      <SelectItem value="Recently added">Recently added</SelectItem>
                      <SelectItem value="Cook time">Cook time</SelectItem>
                      <SelectItem value="Favorites">Favorites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleFilterApply} className="flex-1">
                    Apply
                  </Button>
                  <Button variant="outline" onClick={handleFilterReset}>
                    Reset
                  </Button>
                </div>
              </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsGeneratorDialogOpen(true)}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Create with AI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add manually
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode} className="bg-muted rounded-lg p-1">
            <ToggleGroupItem value="all" className="text-sm px-4 py-2 rounded-md">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="favorites" className="text-sm px-4 py-2 rounded-md">
              Favorites
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Tag Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {predefinedTags.map(tag => (
            <Badge
              key={tag}
              variant={activeTagFilter === tag ? 'default' : 'secondary'}
              className="whitespace-nowrap cursor-pointer rounded-full"
              onClick={() => setActiveTagFilter(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Mock Data Indicator */}
      {usingMockData && (
        <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
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
        <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Row */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-brand">{recipes.length}</div>
            <div className="text-sm text-muted-foreground font-medium">Total</div>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{favoriteCount}</div>
            <div className="text-sm text-muted-foreground font-medium">Favorites</div>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="px-4 pb-20">
        {emptyStateContent ? emptyStateContent : (
          <div className="space-y-3">
            {filteredRecipes.map(recipe => (
              <Card key={recipe.id} className="border rounded-xl hover:shadow-sm transition-shadow">
                <div className="flex gap-3 p-4" onClick={() => window.location.href = `/recipes/${recipe.id}`}>
                  {/* Thumbnail */}
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <div className="h-full w-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-bold text-base line-clamp-2 leading-tight">{recipe.name}</h3>

                    {/* Meta Row: Servings + Time */}
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      {recipe.total_time_minutes && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{recipe.total_time_minutes} min</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipe.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs rounded-full px-2 py-0.5"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {recipe.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                            +{recipe.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Favorite Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-11 w-11 p-0 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(recipe);
                      }}
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`h-5 w-5 ${recipe.is_favorite ? 'text-pink-600 fill-current' : 'text-muted-foreground'}`}
                      />
                    </Button>

                    {/* More Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-11 w-11 p-0 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditRecipe(recipe);
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement duplicate functionality
                        }}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({ open: true, recipe });
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>


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
