# Standard park media — 2026-10-08

Every park uses the same Map / Photographs / Video tabs (Arabic first, English second). Tabs support arrow keys and Home/End. Map is initially selected and remains a map at completion. Choosing Map again remounts/replays the journey. Photo galleries preserve original/concept/generated captions. Skazka keeps four next-photo thumbnails. Video provides existing Skazka ride films and the original Salalah film; other projects explicitly show that no video has been added.

The automatic map sequence is planet → region → city → exact location. Each larger-scale vector layer zooms toward its geographic center before the next detail layer appears. Self-hosted NASA texture and OSM vectors; no remote runtime mapping service, key or subscription. Reduced motion/save-data use a static local location map. Background/unmounted media stop rendering.

Context data: dated ODbL extracts in public/maps/context; Moscow cases share one source extract. Most context maps show major roads, rivers/coasts and settlements. Nizwa uses a smaller direct OSM API export after broad Overpass requests failed; its context scales are 12 km and 4.5 km half-width and source coverage is indicated in the JSON. These are schematic maps, not satellite imagery or engineering surveys. Update with scripts/build-map-context.py, retaining direct-export cache for Nizwa.
