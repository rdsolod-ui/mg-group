> Current implementation: [self-hosted free flights](FREE-PARK-FLIGHTS.md). No Google or ArcGIS key is required. The provider setup below is historical.

> Provider update, 2026-10-08: ArcGIS selected by the owner. See [current setup and validation status](ARCGIS-FLIGHTS.md). Google instructions below are historical.

# Park location flights

## Scope and source

On 7 October 2026 the owner supplied nine exact GPS points, including a new planned observation wheel in Blagoveshchensk. Coordinates are preserved in `src/data/project-locations.json` and in each source-register entry. Display labels use five decimals; Google Maps links and camera targets use the original numeric precision.

The portfolio now contains eleven projects (eight Russia, three Oman) and twenty-one chapters. The operating attraction total remains 95. Blagoveshchensk has one **planned**, **not yet built** wheel; its budget, height, opening date and staff are unknown and are not displayed as zero.

## Interaction

- Only the active, visible case can load a map. The Maps SDK is lazy-loaded once and the individual scene is released on completion or departure.
- Camera starts at a 24,000 km range. A nine-second `flyCameraTo` targets the supplied GPS point, followed by a 0.9-second destination hold and a 1.4-second smooth crossfade.
- Camera ranges and tilts are presentation choices, not engineering dimensions or a claim of survey accuracy.
- Flights start automatically when entering a case. Dialogs and document visibility suspend the camera and fade; return uses the remaining duration. There are no start, pause, skip or replay controls. Re-entering the case creates a fresh scene.
- Data saving, detected slow connections, offline state and reduced motion show the creative directly. SDK loading is bounded (15 seconds), map readiness is bounded (20 seconds), and an absent arrival event has a bounded recovery. Error returns to the creative; the next chapter visit can retry.
- Google attribution stays inside the map. A 0.9-second map reveal precedes the flight; after the final crossfade a gentle edge glow and GPS-icon pulse repeat without additional map requests. The exact-coordinate link stays below the map.

## Google activation

Set `MG_GOOGLE_MAPS_BROWSER_KEY` as a GitHub Actions secret before building. The workflow passes it as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. This is intentionally a browser key, visible in the delivered JavaScript; protect it with website/referrer and API restrictions, not secrecy. Do not commit it in `.env`, source, documentation or a receipt.

Enable Maps JavaScript API and billing in the owner's chosen Google Cloud project. Restrict the production key to `https://marketing.parkskazka.ru/*` and the Maps JavaScript API. Use a separate development key if local verification is required. Billing/account selection needs the owner; no project is created automatically.

With no key, builds succeed and **no Google map or flight is activated**. The creative and exact Google Maps destination link remain available. This fallback is not a replacement-map provider and must not be reported as a completed Google animation.

After activation, verify actual coverage, credits, camera arrival and visual quality at all eleven locations on the live origin. SDK-fixture tests validate control logic only; they do not prove Google authorization, imagery availability or native mobile performance.

Official references checked 7 October 2026: [Maps 3D setup](https://developers.google.com/maps/documentation/javascript/3d/get-started), [camera animation](https://developers.google.com/maps/documentation/javascript/3d/animate-camera), [3D reference](https://developers.google.com/maps/documentation/javascript/reference/3d-map).

## Visual endpoints

Existing generated project creatives remain labelled as interpretive. Blagoveshchensk has a newly generated single-wheel concept, not an approved site design. Salalah has an AI lighting interpretation of the original `salalah-coast.webp` photo, with its own generated label; original photography and the original site film remain accessible in separate tabs. Asset hashes, derivative sizes and source categories are recorded in `visual-provenance.json` and `optimized-media.json`.

### Generation prompts

Blagoveshchensk brief: photorealistic aerial concept of one white observation wheel in a landscaped riverside park in Blagoveshchensk, Russian Far East; sunset, plausible hub, supports, radial spokes and hanging cabins. Do not add rollercoasters or present the surroundings as a surveyed site. No text or logos. Prospective, unbuilt illustrative design.

Salalah editing brief: use the original project drone photograph as the geometric and site reference. Preserve the two broad central bearing rings, horizontal axle and service platforms, white A-frame supports, rim, enclosed round gondolas, buildings, palms and parking. Refine lighting into a warm cinematic sunset. No new rides, changed wheel mechanism or invented engineering details. This is an artistic lighting interpretation, not documentary photography.

Original generation outputs and production QA are kept outside the public repository. Delivery images use AVIF/WebP with 640, 960 and 1672 pixel variants and small placeholders.

The subsequent owner update adds planned Nizwa and Riyam projects, bringing the coordinate set to eleven. See [OMAN-PLANNED.md](OMAN-PLANNED.md) for the photo/concept distinction and unknown Riyam ride count.
