import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '../types';

interface TagDialogProps {
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

export function TagDialog({ open, onOpenChange, onSave, editingTag }: TagDialogProps) {
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