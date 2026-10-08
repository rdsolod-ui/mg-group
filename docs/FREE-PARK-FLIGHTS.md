# Self-hosted park flights

The owner requires no paid mapping subscription or payments. This implementation makes no runtime calls to Google, ArcGIS, tile providers or Overpass. R3F/Three.js uses the existing local NASA/GSFC Earth texture. Eleven local OpenStreetMap extracts are rendered into SVG site plans; the original extracts and ODbL attribution are supplied in public/maps. Google Maps links remain optional outbound GPS links and do not incur API usage.

Sequence: globe rotates and zooms to owner GPS -> schematic local street/building/landuse map -> existing project creative. These are not detailed satellite images. Nizwa has sparse OSM coverage; unseen infrastructure is not invented. Data is a static 2026-10-08 snapshot, not real time.

Existing VPS/storage/bandwidth remains the hosting infrastructure; no new subscriptions, payment account, API key or billable request is required. Local media loads on demand. Offline/reduced motion/economy mode retains the creative.

Data: https://www.openstreetmap.org/copyright
Public-domain globe provenance is retained from the existing portfolio globe. Regenerate maps with scripts/build-open-maps.py and scripts/render-open-maps.py (only maintenance, never visitor requests). Minny Gorodok was downloaded using the official OSM map export after Overpass timeouts.
