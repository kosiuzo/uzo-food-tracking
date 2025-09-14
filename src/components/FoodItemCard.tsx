import { MoreVertical, Edit, Trash2, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FoodItem } from '../types';
import { StarRating } from './StarRating';
import { QuickNoteDialog } from './QuickNoteDialog';
import { getFoodItemImage, getDefaultImageByCategory } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface FoodItemCardProps {
  item: FoodItem;
  onEdit: () => void;
  onDelete: () => void;
  onRatingChange?: (rating: number) => void;
  onUpdateItem?: (updates: Partial<FoodItem>) => void;
}

export function FoodItemCard({ item, onEdit, onDelete, onRatingChange, onUpdateItem }: FoodItemCardProps) {
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);

  // Reset error state when item.image_url changes
  useEffect(() => {
    setHasTriedFallback(false);
  }, [item.image_url, item.id]);

  // Only show image if the item has a real image_url (not empty/null)
  const hasRealImage = item.image_url && item.image_url.trim() !== '';
  const currentImageUrl = getFoodItemImage(item.image_url, item.category);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Image - only show if item has a real image */}
        {hasRealImage && (
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={currentImageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Only fallback if we haven't tried yet and it's not already the default
                const target = e.target as HTMLImageElement;
                if (!hasTriedFallback && item.image_url && item.image_url.trim() !== '') {
                  setHasTriedFallback(true);
                  target.src = getDefaultImageByCategory(item.category);
                }
              }}
              onLoad={() => {
                // Reset error states when image loads successfully
                setHasTriedFallback(false);
              }}
              key={item.image_url || 'default'} // Force re-render when image URL changes
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg break-words leading-tight">{item.name}</h3>
              {item.brand && (
                <p className="text-sm text-muted-foreground mt-0.5">{item.brand}</p>
              )}
            </div>
            
            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category and Rating */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            
            <div className="flex items-center gap-2">
              <StarRating
                rating={item.rating}
                onRatingChange={onRatingChange}
                size="md"
              />
              {item.rating > 0 && (
                <span className="text-sm font-medium text-muted-foreground">
                  {item.rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Ingredients */}
          {item.ingredients && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium">Ingredients:</span> {item.ingredients}
              </p>
            </div>
          )}

          {/* Notes display */}
          {item.notes && item.notes.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{item.notes.length} note{item.notes.length !== 1 ? 's' : ''}</span>
                </div>
                {onUpdateItem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsQuickNoteOpen(true)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {item.notes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 2)
                  .map((note, index) => (
                    <div key={`${note.date}-${index}`} className="text-xs bg-muted/50 rounded px-2 py-1">
                      <p className="text-foreground text-xs leading-tight">{note.text}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">
                        {new Date(note.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))
                }
                {item.notes.length > 2 && (
                  <p className="text-[10px] text-muted-foreground pl-2">
                    +{item.notes.length - 2} more note{item.notes.length - 2 !== 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick note button when no notes exist */}
          {(!item.notes || item.notes.length === 0) && onUpdateItem && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsQuickNoteOpen(true)}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add note
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Note Dialog */}
      {onUpdateItem && (
        <QuickNoteDialog
          open={isQuickNoteOpen}
          onOpenChange={setIsQuickNoteOpen}
          item={item}
          onSave={onUpdateItem}
        />
      )}
    </Card>
  );
}