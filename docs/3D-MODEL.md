# Travence Atlantis 3D model: status and what is still needed

## What ships now
The suitcase in the hero is built in code (`src/components/hero3d/SuitcaseModel.jsx`)
from the four Atlantis photographs (Cyan, Blue, Khakhi, Grey). It is a real WebGL
model with these separate, named parts: `shell-front`, `shell-rear`, `zip-seam`,
`brand-plate`, `top-handle`, `side-handle`, `trolley-handle` (telescopic, animated),
`lock`, `zip-puller-a/b`, and four `wheels` units (swivelling dual wheels).
Proportions use the listed 66 x 42 x 28 cm. Swirl ribs and the compass emblem are
matched by eye from the photos and rendered as a generated normal map.

## What the photographs do NOT show (so it is not modelled)
- Rear panel: it reuses the front swirl as an assumption.
- Interior / compartments: not modelled, so there is no Interior hotspot.
- Underside, wheel close-ups, handle button, lock close-up, zip tooth detail.
- Exact lock type on the case (copy uses only "TSA Lock" from products.js).

## To replace it with a production GLB
Provide a `.glb` (Draco or Meshopt compressed, KTX2 textures, ideally under 2 MB) with
the node names above, plus 6-8 extra photos: rear, left side, right side, top,
underside, wheel close-up, handle/lock close-up, and interior. Save it as
`public/models/travence-suitcase.glb`. The scene, hotspots and UI do not need to change
except swapping `SuitcaseModel` for a `useGLTF` loader.
