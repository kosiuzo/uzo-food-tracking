import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ItemNote, FoodItem } from '../types';
import { logger } from '@/lib/logger';

interface QuickNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FoodItem;
  onSave: (updatedItem: Partial<FoodItem>) => void;
}

export function QuickNoteDialog({ open, onOpenChange, item, onSave }: QuickNoteDialogProps) {
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!noteText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newNote: ItemNote = {
        text: noteText.trim(),
        date: new Date().toISOString(),
      };

      const existingNotes = item.notes || [];
      const updatedNotes = [newNote, ...existingNotes];

      await onSave({ notes: updatedNotes });

      setNoteText('');
      onOpenChange(false);
    } catch (error) {
      logger.error('Error saving note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNoteText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Note for {item.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!noteText.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}