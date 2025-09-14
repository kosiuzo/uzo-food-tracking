-- Migration: Add feedback JSONB column to recipes for user comments

ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS feedback JSONB;

COMMENT ON COLUMN recipes.feedback IS 'Array of feedback entries: [{"text":"", "date":"ISO string"}]';

-- Update search vector function to include feedback text contents
CREATE OR REPLACE FUNCTION update_recipes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.instructions, '') || ' ' ||
    COALESCE(NEW.notes, '') || ' ' ||
    COALESCE(array_to_string(NEW.ingredient_list, ' '), '') || ' ' ||
    COALESCE((SELECT string_agg(entry->>'text', ' ')
              FROM jsonb_array_elements(COALESCE(NEW.feedback, '[]'::jsonb)) AS entry), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Backfill search_vector for existing recipes to account for feedback
UPDATE recipes SET search_vector = to_tsvector('english', 
  COALESCE(name, '') || ' ' ||
  COALESCE(instructions, '') || ' ' ||
  COALESCE(notes, '') || ' ' ||
  COALESCE(array_to_string(ingredient_list, ' '), '') || ' ' ||
  COALESCE((SELECT string_agg(entry->>'text', ' ')
            FROM jsonb_array_elements(COALESCE(feedback, '[]'::jsonb)) AS entry), '')
);
