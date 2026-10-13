# Home maps

The two introduction items in `public/data/sections/home.json` contain
`map` configuration instead of avatar-sized photos. The gallery retains all four
original photos and their viewer interactions. Both maps are fixed at
43.62781223741581° N, 17.205783017756797° E. Visitors can zoom with a wheel,
two-finger pinch, or the keyboard's plus/minus keys. The maps do not pan or open
the photo viewer. One-finger touch gestures still scroll the page.

`src/components/articles/partials/GalleryMap.jsx` handles the fixed-center
projection, zoom limits, visible tiles, scale, marker, legend and attribution.
The map configuration passes through `ArticleItemDataWrapper.map` and renders
inside `ArticleText`. The explanatory copy sits beside each map on desktop and
below it on narrow screens. Home also uses `settings.layout: "grid"` for all four
benefits and `settings.layout: "cards"` for three full-box navigation links.

## Topographic source

The terrain panel includes a prominent **Open elevation map** link to the public
[topographic-map.com viewer](https://en-gb.topographic-map.com/world/?center=43.62781223741581%2C17.205783017756797&zoom=12&popup=43.62781223741581%2C17.205783017756797).
It opens in a new tab at the villa's exact coordinates and the preview's current
zoom. The public viewer uses [TessaDEM](https://tessadem.com/), with the
Elevation database / Elevation API / OpenStreetMap credits requested by the owner.
No account, API key or paid API integration is added to Villa Bagara.

The public viewer's elevation-overlay request returned HTTP 403 during automated
testing on 2026-10-13. The source is linked directly; no third-party iframe is
embedded. The working on-page overview below keeps its own accurate attribution.

[OpenTopoMap](https://opentopomap.org/about) supplies HTTPS raster tiles, with
OpenStreetMap and SRTM attribution. Only the visible viewport is requested;
ordinary browser caching applies. The map caps the terrain view at
zoom 13 while OpenTopoMap migrates to vector tiles. Replace `tileUrl` and
review the attribution if changing providers. No API key or map library is used.

## Climate source and reproduction

The climate map starts at zoom 6, matching the owner's annotated regional view.
Its supported range remains zoom 6–10, with the villa fixed at the center.

The climate view uses the V3 Köppen–Geiger classification for **1991–2020**,
from [Beck et al. (2023)](https://doi.org/10.1038/s41597-023-02549-6).
The [author's dataset page](https://www.gloh2o.org/koppen/) links to the
[V3 GeoTIFF archive](https://figshare.com/ndownloader/files/61012822).
It is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The original archive member is
`1991_2020/koppen_geiger_0p00833333.tif` (approximately 1 km resolution).
`scripts/build-climate-maps.py` reprojects five centered crops into Web Mercator
(EPSG:3857), using nearest-neighbor sampling and the archive's original
`legend.txt` palette. Water/no-data pixels are transparent. Crops are 2048 × 1024
pixels; the view uses their central area at the matching zoom without stretching.
The climate panel includes a key for the surrounding region's climate classes.

To rebuild, install the optional Python tools (`python -m pip install numpy
Pillow rasterio`), download the V3 archive, then run:

```powershell
python scripts/build-climate-maps.py path/to/koppen_geiger_tif.zip
```

Outputs live in `public/images/villa_bagara/maps/climate/` (about 345 KB total).
The climate view needs no third-party requests at runtime. Edit the coordinates
or dimensions in JSON only together with regenerated crops. The 1 km data cannot
resolve individual buildings; zooming enlarges the climate cells.
