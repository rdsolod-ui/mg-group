# Satellite park flights

The eleven park cards use static Esri World Imagery exports, prepared at build time,
and GPS-centred NASA globe previews. They make no runtime Google/Esri API or tile requests.
This applies the self-hosted imagery approach used in the Muscat presentation to the
existing lightweight MG Group flight player. It does not introduce a terrain mesh.

## Geometry and playback

Each park has three north-up images in Web Mercator, centred on the exact coordinates
in `src/data/project-locations.json`. Approximate ground widths are 120 km (region),
16 km (city), and 1.6 km (location). All exports have the same 16:9 aspect ratio.
Detailed frames grow inside broader frames using the same extent ratio. The final
frame zooms another 15 percent. The location pin remains at the common GPS centre.

All four images buffer before the automatic 12.8-second flight starts. Normal images
are 1280 px wide and economy images 640 px. Visibility drives start/reset, background
or dialog pauses preserve progress, and reduced motion settles on the location.
Re-entering the card or changing Photographs -> Map restarts the journey.

## Sources and rights

- Esri World Imagery: Esri, Vantor, Earthstar Geographics, and the GIS User Community.
- NASA/GSFC, Reto Stöckli: planet imagery.
- Imagery acquisition dates vary. These images do not establish construction status,
  land ownership, surveyed boundaries, or current conditions.
- Visible image credits link to `public/maps/satellite/credits.html`.
- Esri imagery retains provider rights; it is not ODbL/open data and is not offered for
  unrestricted redistribution. Do not apply the repository's own-code licence to it.
- Static company marketing maps: https://doc.arcgis.com/en/arcgis-online/reference/static-maps.htm

`sources.json` records source URLs, GPS centres, exact projected extents, retrieval time,
and SHA-256 values for the sources and all 66 optimized derivatives. Original exports
remain in the external production folder, not this repository. Earlier OSM assets
retain their separate ODbL attribution and are preserved unchanged.

## Rebuild

1. `python scripts/build-satellite-flights.py <external-originals-folder>`
2. `node scripts/optimize-satellite-flights.mjs <external-originals-folder>`
3. `npm run build`, `npm run typecheck`, `npm run check:export`.

Do not replace the satellite frames by running the older schematic-preview builder;
it writes to a separate `maps/flight` folder used only for the planet in current flights.
The export check validates all centres, extents, derivative hashes, attribution and
download budgets. Review imagery and actual browser transitions before publishing.
