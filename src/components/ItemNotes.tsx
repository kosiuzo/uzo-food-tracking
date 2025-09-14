import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, X, Calendar } from 'lucide-react';
import { ItemNote } from '../types';

interface ItemNotesProps {
  notes: ItemNote[];
  onNotesChange: (notes: ItemNote[]) => void;
  readonly?: boolean;
}

export function ItemNotes({ notes, onNotesChange, readonly = false }: ItemNotesProps) {
  const [newNoteText, setNewNoteText] = useState('');

  const addNote = () => {
    if (!newNoteText.trim()) return;

    const newNote: ItemNote = {
      text: newNoteText.trim(),
      date: new Date().toISOString(),
    };

    onNotesChange([...notes, newNote]);
    setNewNoteText('');
  };

  const removeNote = (index: number) => {
    onNotesChange(notes.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      addNote();
    }
  };

  return (
    <div className="space-y-3">
      <Label>Notes</Label>

      {/* Add new note */}
      {!readonly && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add a note about this item..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addNote}
              disabled={!newNoteText.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Cmd/Ctrl + Enter to quickly add note
          </p>
        </div>
      )}

      {/* Notes list */}
      {notes.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notes
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((note, index) => (
              <Card key={`${note.date}-${index}`} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{note.text}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(note.date)}
                    </div>
                  </div>
                  {!readonly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNote(notes.indexOf(note))}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-md">
          No notes added yet
        </p>
      )}
    </div>
  );
}