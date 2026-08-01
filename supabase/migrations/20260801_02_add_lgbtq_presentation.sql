-- QMZ WERKZ: add LGBTQ as a third Gender option for Skins (Faces/Tattoos),
-- with its own Fem-Masc / Masc-Fem presentation sub-choice.
--
-- Run this in the Supabase SQL editor, after the first migration
-- (20260801_add_product_gender_and_reorganize_categories.sql).
--
-- Updated taxonomy:
--   FiveM > Skins > Faces/Tattoos > Male / Female / LGBTQ
--                                              -> Fem-Masc / Masc-Fem
--
-- Same as before: no CHECK constraint, so this can't reject future inserts.
-- The admin form dropdowns are what keep values consistent going forward.

ALTER TABLE products ADD COLUMN IF NOT EXISTS gender_detail text;

-- No data backfill needed here - no existing products use gender='LGBTQ' yet.

-- Verify afterward:
-- select name, platform, category, subcategory, gender, gender_detail from products order by created_at desc;
