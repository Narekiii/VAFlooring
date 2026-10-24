# Design source

Everything needed to rebuild the brand assets and illustrative imagery. None of this is
part of the website build; it is kept here so the work can be edited and regenerated.

## Logo (`logo/`)

- `logo.py` defines the monogram geometry (stroke weights, slope, crossbar position) and
  outlines the wordmark from Libre Baskerville (SIL Open Font License).
- `build_logo.py` writes every SVG variation, favicons and `logo-paths.ts`, then copies them
  into `public/brand/`, `src/app/` and `src/components/brand/`.
- `build_brand_reference.py` regenerates `docs/brand-reference.html`.

```bash
pip install fonttools playwright pillow && python3 -m playwright install chromium
python3 design-source/logo/build_logo.py
python3 design-source/logo/build_brand_reference.py
```

## Illustrative renderings (`renders/`)

Original 3D scenes built with Blender's Python module (Cycles). They are illustrations,
labelled as such on the site, and should be replaced with V & A Flooring photography.

```bash
pip install bpy numpy scipy pillow
python3 design-source/renders/textures.py          # procedural floor textures (slow)
python3 design-source/renders/textures.py samples
python3 design-source/renders/scene_hero.py         # add --preview for a quick low-res test
CAM=WIDE python3 design-source/renders/scene_hero.py
CAM=B python3 design-source/renders/scene_hero.py   # alternate angles: hero, adu, corridor
python3 design-source/renders/export_images.py      # converts to JPEGs in src/assets/images
```

## Open Graph image (`og/`)

`build_og.py` composes `src/app/opengraph-image.jpg` from the hero image and logo.
