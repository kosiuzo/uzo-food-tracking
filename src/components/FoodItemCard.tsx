import { MoreVertical, Edit, Trash2, MessageSquare, Plus, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FoodItem } from '../types';
import { StarRating } from './StarRating';
import { QuickNoteDialog } from './QuickNoteDialog';
import { getFoodItemImage, getDefaultImageByCategory } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  // Reset error state when item.image_url changes
  useEffect(() => {
    setHasTriedFallback(false);
  }, [item.image_url, item.id]);

  // Only show image if the item has a real image_url (not empty/null)
  const hasRealImage = item.image_url && item.image_url.trim() !== '';
  const currentImageUrl = getFoodItemImage(item.image_url, item.category);
  const notesCount = item.notes?.length || 0;

  return (
    <Card className="border rounded-xl hover:shadow-sm transition-shadow">
      <div className="flex gap-3 p-4">
        {/* Thumbnail */}
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {hasRealImage ? (
            <img
              src={currentImageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!hasTriedFallback && item.image_url && item.image_url.trim() !== '') {
                  setHasTriedFallback(true);
                  target.src = getDefaultImageByCategory(item.category);
                }
              }}
              onLoad={() => {
                setHasTriedFallback(false);
              }}
              key={item.image_url || 'default'}
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <StickyNote className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Brand */}
          <h3 className="font-bold text-base line-clamp-2 leading-tight">{item.name}</h3>
          {item.brand && (
            <p className="text-sm text-muted-foreground font-medium mt-0.5">{item.brand}</p>
          )}

          {/* Meta Row: Category + Rating */}
          <div className="flex items-center gap-8 mt-1">
            <Badge variant="secondary" className="text-xs rounded-full px-2 py-1">
              {item.category}
            </Badge>
            <div className="flex items-center gap-1" aria-label={`Rating ${item.rating || 0} out of 5`}>
              <StarRating
                rating={item.rating || 0}
                onRatingChange={onRatingChange}
                size="sm"
              />
            </div>
          </div>

          {/* Notes Preview */}
          {notesCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 mt-2 text-sm text-muted-foreground hover:text-foreground justify-start gap-2"
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
              aria-label={`${isNotesExpanded ? 'Hide' : 'Show'} notes for this item`}
            >
              <StickyNote className="h-3 w-3" />
              {isNotesExpanded ? 'Hide notes' : `Show notes (${notesCount})`}
            </Button>
          ) : (
            onUpdateItem && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 mt-2 text-sm text-muted-foreground hover:text-foreground justify-start gap-2"
                onClick={() => setIsQuickNoteOpen(true)}
              >
                <StickyNote className="h-3 w-3" />
                Add note
              </Button>
            )
          )}

          {/* Expanded Notes */}
          {isNotesExpanded && notesCount > 0 && (
            <div className="mt-3 space-y-2 pl-5 border-l-2 border-muted">
              {item.notes
                ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((note, index) => (
                  <div key={`${note.date}-${index}`} className="text-sm">
                    <p className="text-foreground leading-relaxed">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
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
              {onUpdateItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => setIsQuickNoteOpen(true)}
                >
                  <Plus className="h-3 w-3" />
                  Add note
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Overflow Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              aria-label="More actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit item
            </DropdownMenuItem>
            {onUpdateItem && (
              <DropdownMenuItem onClick={() => setIsQuickNoteOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add note
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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