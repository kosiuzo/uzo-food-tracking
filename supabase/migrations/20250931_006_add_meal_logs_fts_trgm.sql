-- Migration: Add FTS (tsvector) + trigram search support for meal_logs
-- - Adds search_vector tsvector column populated from meal_name, items, notes
-- - Creates trigger to maintain search_vector on insert/update
-- - Backfills existing rows
-- - Adds GIN index on search_vector (FTS)
-- - Enables pg_trgm and adds trigram indexes for substring matching

-- 1) Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2) Add search_vector column if missing
ALTER TABLE meal_logs
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 3) Function to update search_vector from relevant fields
CREATE OR REPLACE FUNCTION update_meal_logs_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.meal_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.items, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.notes, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4) Trigger to keep search_vector updated
DROP TRIGGER IF EXISTS trigger_meal_logs_search_vector_update ON meal_logs;
CREATE TRIGGER trigger_meal_logs_search_vector_update
  BEFORE INSERT OR UPDATE ON meal_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_meal_logs_search_vector();

-- 5) Backfill existing rows (idempotent)
UPDATE meal_logs SET search_vector =
  setweight(to_tsvector('english', COALESCE(meal_name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(items, ' '), '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(notes, '')), 'C')
WHERE search_vector IS NULL
   OR search_vector = ''::tsvector;

-- 6) FTS index
CREATE INDEX IF NOT EXISTS idx_meal_logs_search_vector ON meal_logs USING gin (search_vector);

-- 7) Trigram indexes for substring search fallbacks
CREATE INDEX IF NOT EXISTS idx_meal_logs_meal_name_trgm ON meal_logs USING gin (meal_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_meal_logs_notes_trgm ON meal_logs USING gin (notes gin_trgm_ops);

-- Note: We rely on FTS to search items via search_vector. If you want
-- trigram substring search on items, consider adding a generated column:
--   ALTER TABLE meal_logs ADD COLUMN items_text TEXT GENERATED ALWAYS AS (array_to_string(items, ' ')) STORED;
--   CREATE INDEX idx_meal_logs_items_text_trgm ON meal_logs USING gin (items_text gin_trgm_ops);
-- and query with items_text.ilike.*term* via REST/PostgREST.

