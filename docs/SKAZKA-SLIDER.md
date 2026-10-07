# Skazka summer gallery

Six official parkskazka.ru attraction photographs were edited with imagegen on 7 October 2026: observation wheel, Boomerang, Lightning, Sky carousel, Galaxy and Kraken. Each image retains the source ride and camera composition, with summer sunshine, green vegetation and visitors. These are labelled AI-enhanced marketing images in Arabic and English, not documentary attendance evidence.

Source pages, original hashes, generation filenames and delivery hashes are in `skazka-summer-sources.json`. Unmodified source photos and native generated PNGs remain in the external production folder. `scripts/build-skazka-summer.mjs` reproduces delivery files from these generated originals; `scripts/optimize-media.mjs` includes the gallery in general derivative rebuilding.

The gallery shows four upcoming photos to the left, with cyclic previews, previous/next arrows, keyboard arrows, touch swipe and an enlarged viewer. Automatic advance runs every 7.5 seconds after loading and a gentle 850 ms crossfade. It stops while hovered, focused, offscreen, in a dialog, offline, in Save data mode, or with reduced motion. There are no animation launch/pause buttons.

Only the displayed image and requested successor load as large images; previews are 240px WebP. Delivery uses 640/960/1536px AVIF and WebP sources, with a tiny inline preview. The outgoing image remains while the next loads; a failed successor exposes a retry action without removing the last successful image. Full-resolution loading is reserved for the enlarged viewer.

The Skazka GPS and existing Google flight adapter remain attached to the main image. This change does not configure or activate Google Maps credentials.
