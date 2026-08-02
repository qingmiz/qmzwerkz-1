-- QMZ WERKZ: category reorganization
--
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
--
-- Scope: FiveM products only, per the requested taxonomy:
--   FiveM
--     -> Skins
--          -> Faces  -> Male / Female
--          -> Tattoos -> Male / Female
--     -> Scripts        (no subcategory)
--     -> Road Mods      (no subcategory)
--     -> Custom Weapons (no subcategory)
--
-- IMVU / Web Development / other platforms are untouched.
-- No CHECK constraint is added on purpose, so this can't reject future
-- inserts if new categories get added later - the admin form dropdowns
-- (not the database) are what keep values consistent going forward.

-- 1. New column. `category` and `subcategory` already exist and are
--    already used by the admin product form / API - only `gender` is new.
ALTER TABLE products ADD COLUMN IF NOT EXISTS gender text;

-- 2. Recategorize the one existing Skins product. "kira" was tagged with
--    the freeform category='Face' (no consistent taxonomy before this).
--    Confirmed with the site owner: kira is a female face preset.
UPDATE products
SET category = 'Skins',
    subcategory = 'Faces',
    gender = 'Female'
WHERE name = 'kira';

-- 3. No change needed for qmz hud / qmz_watermark - confirmed they're both
--    Scripts, which is already correct (platform='FiveM', category='Scripts')
--    and Scripts doesn't use subcategory/gender.

-- Verify afterward:
-- select name, platform, category, subcategory, gender from products order by created_at desc;
