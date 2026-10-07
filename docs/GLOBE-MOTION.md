# Interactive portfolio globe and automatic motion

The portfolio has 21 chapters. Chapter 8 is a dedicated satellite globe with the eleven owner-supplied park coordinates. The country chart remains in chapter 7. Neither project status nor the 95 / 64 / 11 source totals changed.

## Routes and interaction

- All markers and arcs use `project-locations.json`, independent of chapter numbers.
- Routes originate at an approximate address point for Moscow HQ, Osennyaya 23: 55.76648, 37.40348. Source: [Moscow address register, row 2104](https://www.mos.ru/upload/documents/files/9349/1_Prilojenie2_ReestrMNO.pdf). This is an address reference, not surveyed office geometry.
- Distances use the Haversine formula with mean Earth radius 6371.0088 km, rounded to whole kilometres. They describe approximate great-circle distances, not driving or flight routes.
- All eleven distances remain readable in a selectable list. The selected arc carries its own distance and destination label; label projection is clamped inside the canvas on small screens.
- Mouse drag rotates; wheel/pinch zooms. The automatic destination tour changes focus every 8.5 seconds, stopping on the first manual interaction. The selected marker continues a gentle pulse.
- A selected destination opens its matching case. Reduced motion disables the tour and pulse but retains manual orbit/zoom. Data saving/offline mode uses a static preview and the distance list.

## Automatic presentation motion

Global, chart, model and map-flight start/pause controls have been removed. Old stored global pause preferences are cleared. Animations run automatically only while relevant and visible; open menus/dialogs and hidden documents suspend them. Reduced-motion preferences remain respected. Manual chart selection holds a sector until deselection or Show all.

The selected 3D design model automatically downloads on normal connections. Data saving, cancellation, error recovery and actual download progress remain. Documentary-video controls still govern the actual films.

## Google flight boundary

The existing Google Maps adapter now handles the official void return value of `stopCameraAnimation()` safely, automatically starts on case entry, reveals the map, crossfades after arrival and releases the scene. The final creative has a subtle looping edge glow and GPS pulse, with no repeated map requests. Elapsed-time transitions retain their duration at low frame rates.

Real Google flights require the owner's configured Maps project, billing and restricted browser key. The account inspected on 7 October 2026 presented Google Cloud trial registration requiring terms acceptance and card verification. These actions were handed to the owner. No trial, billing or key was created, and the production fallback must not be represented as a working Google flight.

Local SDK fixtures verify event handling, exact camera destination, automatic arrival/fade and cleanup with methods returning void. They cannot establish authorization, real Google imagery, coverage or live camera performance. See [PARK-FLIGHTS.md](PARK-FLIGHTS.md) for activation.

## Acceptance

`check-globe.mjs` checks known geodesic examples, all eleven rounded distances, symmetric distances, arc endpoints, arc clearance above Earth and exported chapter/control contracts. Existing media, SEO, chart and location checks remain required. Browser checks cover desktop/mobile layout, manual orbit/zoom, project navigation, reduced motion, automatic loading, chart labels and Google-free fallback. Real Google coverage and native Safari/device performance remain separate acceptance items.
