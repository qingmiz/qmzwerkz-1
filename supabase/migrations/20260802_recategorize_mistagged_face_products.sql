-- QMZ WERKZ: fix face products that got saved as category="Scripts"
--
-- Root cause (now fixed in code): the admin "Add Product" / "Edit Product"
-- forms used to default the Category dropdown to "Scripts" for every new
-- FiveM product. If you added a face preset without deliberately changing
-- that dropdown to "Skins", it silently saved with category="Scripts" -
-- which is why Tracey/Nyxann/D'ejah/Candy/etc. were all showing under
-- "SCRIPTS" on the shop page and weren't reachable through the new
-- Skins -> Faces -> Gender filters. The filter code itself is fine; the
-- underlying data just needs correcting, the same way "kira" already was.
--
-- STEP 1 - run this first and check the results before updating anything:
select id, name, platform, category, subcategory, gender, gender_detail
from products
where lower(trim(name)) in (
  'candy', 'carli', 'carly',
  'd''ejah', 'dejah',
  'keke', 'kk',
  'nyxann',
  'tracey', 'tracy',
  'tyla'
)
order by name;

-- STEP 2 - once the SELECT above looks right (all of these are female face
-- presets, per what you told me earlier - "all faces are female havent
-- added any males yet"), run this UPDATE:
update products
set category = 'Skins',
    subcategory = 'Faces',
    gender = 'Female'
where lower(trim(name)) in (
  'candy', 'carli', 'carly',
  'd''ejah', 'dejah',
  'keke', 'kk',
  'nyxann',
  'tracey', 'tracy',
  'tyla'
);

-- Not touched on purpose: qmz hud / qmz_watermark stay category="Scripts"
-- (you confirmed those are Scripts, not skins). kira was already fixed in
-- an earlier migration.

-- Verify afterward:
-- select name, platform, category, subcategory, gender from products order by created_at desc;
