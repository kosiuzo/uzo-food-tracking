Got it — here’s the simplified PRD + migration with serving_unit_type as an ENUM that’s auto‑set in the app layer (no DB trigger). The app preselects the type based on the user’s chosen serving_unit via a small mapping.

PRD: Serving Quantity & Serving Unit with App‑Filled ENUM Type

Goal

Add two inputs to every item so recipes can do reliable volume math:
	•	serving_quantity (number)
	•	serving_unit (text)

Keep existing serving_size_grams.
Add serving_unit_type as an ENUM: 'volume' | 'weight' | 'package', set by the application based on the selected serving_unit.

⸻

Data Model (PostgreSQL)

1) Enum and columns

-- 1) Create enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'serving_unit_type') THEN
    CREATE TYPE serving_unit_type AS ENUM ('volume', 'weight', 'package');
  END IF;
END$$;

-- 2) Add columns (nullable for back-compat)
ALTER TABLE items
  ADD COLUMN serving_quantity     numeric NULL,
  ADD COLUMN serving_unit         text    NULL,
  ADD COLUMN serving_unit_type    serving_unit_type NULL;  -- set by app

-- (serving_size_grams already exists; keep as-is)

No triggers. The app assigns serving_unit_type whenever serving_unit is provided.

⸻

App Behavior

A) Unit → Type mapping (app-side; authoritative)

// Lowercased, singular keys recommended
const UNIT_TO_TYPE: Record<string, 'volume'|'weight'|'package'> = {
  // volume
  tsp: 'volume', tbsp: 'volume', cup: 'volume', 'fl_oz': 'volume',
  ml: 'volume', l: 'volume',
  // weight
  g: 'weight', kg: 'weight', oz: 'weight', lb: 'weight',
  // package / count
  pouch: 'package', bar: 'package', bottle: 'package', pack: 'package',
  piece: 'package', scoop: 'package', slice: 'package', can: 'package'
};

B) Create/Update flow
	1.	User selects serving_unit (dropdown with common units; free‑text allowed if you want).
	2.	App normalizes the unit to a key (e.g., "Tbsp" → "tbsp").
	3.	App sets serving_unit_type = UNIT_TO_TYPE[normalizedUnit] (or rejects if unknown).
	4.	Save serving_quantity, serving_unit (original casing if you prefer), serving_unit_type, and serving_size_grams (if available).

C) Validation (service layer)
	•	If serving_quantity or serving_unit is provided → require both plus a resolvable serving_unit_type.
	•	serving_quantity > 0.
	•	If the unit is not in UNIT_TO_TYPE, reject with a friendly message or prompt to pick a supported unit.
	•	serving_size_grams can be missing at create time, but note conversions to grams won’t work until it’s filled.

⸻

Conversions (kept simple)

Derive grams per unit (when all present)

grams_per_unit = serving_size_grams / serving_quantity

Volume conversion factors (normalize to cups)

const toCup = (qty: number, unit: string): number => {
  const u = unit.toLowerCase().replace(/\s+/g, '_');
  if (u === 'cup')   return qty;
  if (u === 'tbsp')  return qty / 16;
  if (u === 'tsp')   return qty / 48;
  if (u === 'ml')    return qty / 240;
  if (u === 'fl_oz') return qty / 8;   // US
  if (u === 'l' || u === 'liter') return qty * 4.227; // 1 liter = 4.227 US cups
  throw new Error(`Unsupported volume unit: ${unit}`);
};

Example: recipe math
	•	Item (rice): serving_quantity=0.25, serving_unit='cup', serving_unit_type='volume', serving_size_grams=45
→ grams_per_cup = 45 / 0.25 = 180 g
	•	Recipe uses 2 cups → 2 × 180 = 360 g → scale macros accordingly.
	•	Item (pouch snack): serving_quantity=1, serving_unit='pouch', serving_unit_type='package', serving_size_grams=28
→ only scale by count: 1.5 pouches = 42 g. No volume conversion.

⸻

Minimal API Examples

Create/Update (client → server)

{
  "name": "Long-grain Rice",
  "serving_size_grams": 45,
  "serving_quantity": 0.25,
  "serving_unit": "cup",
  "serving_unit_type": "volume"  // set by app using UNIT_TO_TYPE
}

{
  "name": "Olive Oil",
  "serving_size_grams": 14,
  "serving_quantity": 1,
  "serving_unit": "Tbsp",
  "serving_unit_type": "volume"
}

{
  "name": "Fruit Snacks",
  "serving_size_grams": 28,
  "serving_quantity": 1,
  "serving_unit": "pouch",
  "serving_unit_type": "package"
}


⸻

Acceptance Criteria
	•	DB has new columns; no triggers used.
	•	App always sets serving_unit_type (ENUM) from the selected serving_unit.
	•	Items with volume units + serving_size_grams allow recipe inputs (tsp/tbsp/cup/ml/fl_oz) to convert to grams.
	•	Package units scale only by count.
	•	Existing rows without the new fields continue to work as before.

⸻

If you want, I can also provide a one‑file SQL migration that’s idempotent and a tiny UI snippet (unit dropdown + type auto‑fill) to drop into your form.