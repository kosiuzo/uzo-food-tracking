import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { useToast } from '@/hooks/use-toast';
import { Tag } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tag: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => void;
  editingTag?: Tag | null;
}

const COLOR_PRESETS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#10b981', // emerald
  '#22c55e', // green
  '#059669', // teal
  '#dc2626', // red
  '#f97316', // orange
  '#6366f1', // indigo
  '#ec4899', // pink
  '#eab308', // yellow
  '#14b8a6', // cyan
  '#84cc16', // lime
  '#6b7280', // gray
];

function TagFormDialog({ open, onOpenChange, onSave, editingTag }: TagFormDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setColor(editingTag.color);
      setDescription(editingTag.description || '');
    } else {
      setName('');
      setColor('#3b82f6');
      setDescription('');
    }
  }, [editingTag, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        color,
        description: description.trim() || undefined,
      });
      
      // Reset form
      setName('');
      setColor('#3b82f6');
      setDescription('');
    } catch (error) {
      console.error('Failed to save tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingTag ? 'Edit Tag' : 'Add New Tag'}
          </DialogTitle>
          <DialogDescription>
            {editingTag 
              ? 'Update the tag details below.'
              : 'Create a new tag to organize your recipes.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Name *</Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., vegetarian, high-protein, quick-meal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-color">Color</Label>
            <div className="space-y-3">
              <Input
                id="tag-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-12 w-20"
              />
              
              {/* Color Presets */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Color presets:</p>
                <div className="grid grid-cols-7 gap-2">
                  {COLOR_PRESETS.map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      onClick={() => setColor(presetColor)}
                      className={`h-8 w-8 rounded-md border-2 transition-all ${
                        color === presetColor 
                          ? 'border-foreground scale-110' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: presetColor }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-description">Description</Label>
            <Textarea
              id="tag-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this tag..."
              rows={3}
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-3 border rounded-md bg-muted/50">
              <div 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {name || 'Tag name'}
              </div>
              {(description || name) && (
                <p className="text-sm text-muted-foreground mt-2">
                  {description || 'Tag description'}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingTag ? 'Update Tag' : 'Create Tag')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TagDialog({ open, onOpenChange }: TagManagementDialogProps) {
  const { tags, searchQuery, setSearchQuery, addTag, updateTag, deleteTag, isDeleting, usingMockData, error } = useTags();
  const { toast } = useToast();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; tag: Tag | null }>({ open: false, tag: null });

  const handleAddTag = () => {
    setEditingTag(null);
    setIsFormDialogOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsFormDialogOpen(true);
  };

  const handleDeleteTag = async () => {
    if (!deleteConfirm.tag) return;
    
    try {
      await deleteTag(deleteConfirm.tag.id);
      toast({
        title: 'Tag deleted',
        description: `"${deleteConfirm.tag.name}" has been deleted successfully.`,
      });
      setDeleteConfirm({ open: false, tag: null });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tag. It may be used by existing recipes.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveTag = async (tagData: Omit<Tag, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingTag) {
        await updateTag({ id: editingTag.id, updates: tagData });
        toast({
          title: 'Tag updated',
          description: `"${tagData.name}" has been updated successfully.`,
        });
      } else {
        await addTag(tagData);
        toast({
          title: 'Tag created',
          description: `"${tagData.name}" has been created successfully.`,
        });
      }
      setIsFormDialogOpen(false);
      setEditingTag(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingTag ? 'update' : 'create'} tag. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Create, edit, and delete tags to organize your recipes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden">
            {/* Mock Data Indicator */}
            {usingMockData && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Demo Mode:</strong> Showing sample tags. Connect to Supabase to manage real tags.
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && !usingMockData && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">{error.message || 'Failed to load tags'}</p>
              </div>
            )}

            {/* Header with Add Button and Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button onClick={handleAddTag} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Tag
              </Button>
              
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tags List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
              {(!tags || tags.length === 0) ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No tags match your search' : 'No tags created yet'}
                  </p>
                </div>
              ) : (
                tags?.map((tag) => (
                  <Card key={tag.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="text-white border-0"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </Badge>
                        </div>
                        {tag.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {tag.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTag(tag)}
                          disabled={usingMockData}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm({ open: true, tag })}
                          disabled={usingMockData || isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Form Dialog */}
      <TagFormDialog
        open={isFormDialogOpen}
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open) setEditingTag(null);
        }}
        onSave={handleSaveTag}
        editingTag={editingTag}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, tag: open ? deleteConfirm.tag : null })}
        title="Delete Tag"
        description={`Are you sure you want to delete the tag "${deleteConfirm.tag?.name}"? This action cannot be undone and will remove this tag from all recipes.`}
        onConfirm={handleDeleteTag}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}