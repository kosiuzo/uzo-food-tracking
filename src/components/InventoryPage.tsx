import { useState } from 'react';
import { Plus, Search, Filter, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FoodItemCard } from './FoodItemCard';
import { AddEditItemDialog } from './AddEditItemDialog';
import { useInventorySearch } from '../hooks/useInventorySearch';
import { useIsMobile } from '@/hooks/use-mobile';

export function InventoryPage() {
  const {
    items,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    ratingFilter,
    setRatingFilter,
    categories,
    addItem,
    updateItem,
    deleteItem,
    toggleStock,
    usingMockData,
    error,
    loading,
  } = useInventorySearch();

  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');


  const handleFilterApply = () => {
    setIsFilterSheetOpen(false);
  };

  const handleFilterReset = () => {
    setCategoryFilter('all');
    setRatingFilter('all');
    setSortBy('name');
  };

  const emptyStateContent = items.length === 0 && !loading ? (
    searchQuery || categoryFilter !== 'all' || ratingFilter !== 'all' ? (
      // No search results
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No items match</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Try removing a filter or adjusting your search.
        </p>
      </div>
    ) : (
      // No items at all
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No items yet</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Add your first pantry item to get started.
        </p>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>
    )
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-4">

        {/* Action Row */}
        <div className="flex items-center justify-between gap-3">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[80vh]" : ""}>
              <SheetHeader>
                <SheetTitle>Filter & Sort</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={categoryFilter === 'all' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => setCategoryFilter('all')}
                    >
                      All
                    </Badge>
                    {categories.map(category => (
                      <Badge
                        key={category}
                        variant={categoryFilter === category ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Ratings</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'unrated', '5', '4', '3', '2', '1'].map(rating => (
                      <Badge
                        key={rating}
                        variant={ratingFilter === rating ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => setRatingFilter(rating)}
                      >
                        {rating === 'all' ? 'All' : rating === 'unrated' ? 'Unrated' : `${rating} Stars`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Sort</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'name', label: 'Name A-Z' },
                      { value: 'rating', label: 'Rating' },
                      { value: 'recent', label: 'Recently added' }
                    ].map(sort => (
                      <Badge
                        key={sort.value}
                        variant={sortBy === sort.value ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => setSortBy(sort.value)}
                      >
                        {sort.label}
                      </Badge>
                    ))}
                  </div>
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
            aria-label="Add item to inventory"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Mock Data Indicator */}
      {usingMockData && (
        <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <p className="text-sm text-amber-800">
              <strong>Demo Mode:</strong> Showing sample data with beautiful food images.
              Connect to Supabase to see your real inventory.
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

      {/* Search */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
            autoComplete="off"
            inputMode="search"
            aria-label="Search inventory"
          />
        </div>

      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : emptyStateContent ? emptyStateContent : (
          <div className="space-y-4">
            {items.map(item => (
              <FoodItemCard
                key={item.id}
                item={item}
                onEdit={() => setEditingItem(item.id)}
                onDelete={() => deleteItem(item.id)}
                onRatingChange={(rating) => updateItem(item.id, { rating })}
                onUpdateItem={(updates) => updateItem(item.id, updates)}
              />
            ))}
          </div>
        )}
      </div>


      {/* Add/Edit Dialog */}
      <AddEditItemDialog
        open={isAddDialogOpen || editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingItem(null);
          }
        }}
        item={editingItem ? items.find(item => item.id === editingItem) : undefined}
        onSave={async (itemData) => {
          if (editingItem) {
            await updateItem(editingItem, itemData);
          } else {
            await addItem(itemData);
          }
          setIsAddDialogOpen(false);
          setEditingItem(null);
        }}
      />
    </div>
  );
}