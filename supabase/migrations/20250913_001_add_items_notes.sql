-- Add notes column to items table
-- This allows users to add timestamped notes about food items

ALTER TABLE items ADD COLUMN notes JSONB DEFAULT '[]';

-- Add index for better performance when querying notes
CREATE INDEX idx_items_notes ON items USING GIN (notes);

-- Add comment to document the notes structure
COMMENT ON COLUMN items.notes IS 'Array of note objects with structure: [{"text": "note content", "date": "ISO timestamp"}]';