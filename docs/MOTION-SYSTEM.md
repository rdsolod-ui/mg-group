# MG Group motion and charts

The presentation uses one restrained motion system across all 21 chapters. Native SVG/CSS scenes and the existing GSAP/Three.js stack are used; no animation service, video background or new dependency is required.

## Motion coverage

| Area | Added motion |
| --- | --- |
| All chapters | Slow architectural background rings; active-chapter entrance; visible-chapter scheduling |
| Opening | Documentary-style project visual and national flags; decorative ride plaque removed |
| Scale | Large extruded doughnut with sequentially exploded sectors and synchronized legend |
| Engineering | Actual Skazka wheel photograph; no fictional hub or decorative transmission |
| Attractions | Existing model animation retained under the shared visibility/dialog scheduling |
| Specialists | Two-segment technical-team chart and source-derived percentages |
| Lifecycle | Four labelled project stages with sequential progress underlines |
| Geography | Russia/Oman project chart and flags; a separate globe chapter provides the destination tour and manual orbit/zoom |
| Eleven cases | Photo-frame accents; operating-portfolio share bars or source-programme indicators |
| Partnership | A connected-group diagram beside AL-SHAHIQ |
| Contact | A small connection signal in the contact card; QR remains stationary |

Photographic light accents never alter documentary provenance. Masterplan images remain fully inspectable in the existing gallery. Decorative diagrams are illustrative, not engineering simulation, live telemetry or construction-progress evidence.

## Data integrity

- Operating attractions: 60 + 27 + 6 + 1 + 1 = **95** across five source cases. Shares are calculated against 95; construction projects and airport activities are excluded.
- Technical team: **10 engineers + 54 mechanics = 64 specialists**. Shares: 15.6% and 84.4%, rounded to one decimal place.
- Country mix: **8 Russian projects + 3 Oman projects = 11 projects**. These are counts, not revenue, investment or workload shares.
- Construction-labelled cases: Minny Gorodok retains 35 rides and the airport 10 activities. The owner corrected Salalah on 7 October 2026 to one wheel plus two arcade stalls, shown separately. This does not independently confirm an updated completion stage.
- No attendance trend is drawn: the source only dates Skazka visits to 2024, and periods for other cases are unspecified.

All values come from `src/data/source-register.json`. Sector angles and totals stay fixed throughout a loop; sectors move outward sequentially. The three charts now use real Three.js geometry with a shared scene timeline, reflective materials and a static capture fallback; see [CHART-ASSEMBLY.md](CHART-ASSEMBLY.md). Every chart has a bilingual legend, accessible value description and keyboard-operable highlighting. A selected sector pauses automatic cycling until deselected. Visibility, dialog and reduced-motion scheduling apply.

## Motion controls

The owner requested automatic animation with no start/pause buttons. Global, chart, model and flight animation controls have been removed, including the stored global pause preference. Opening a menu, notes or gallery suspends ambient motion. Hidden documents and offscreen/inactive chapters stop animation. Reduced motion keeps all values and scenes readable without loops; mouse orbit remains available. Selected design models load automatically on normal connections. Actual documentary-video playback retains its media controls.

Premium entrances use a 650 ms ease-out with an 80 ms stagger. Repeating sequences typically last 8–32 seconds; the globe focuses a new destination every 8.5 seconds until manual interaction. No numeric counter repeatedly resets, no chart distorts its proportions, and no QR code moves.

## Implementation

- `src/data/motion-data.ts`: source-derived chart values and ring geometry.
- `src/components/MotionCharts.tsx`: doughnuts, bars and case indicators.
- `src/components/MotionScenes.tsx`: editable vector scenes.
- `src/components/useMotionVisibility.ts`: document/intersection state.
- `src/app/motion.css`: timing, responsive layouts, theme colors and reduced motion.
- `Experience.tsx`, `ProjectVisual.tsx`, `PortfolioGlobe.tsx`, `PortfolioGlobeScene.tsx`: integration with the existing presentation.

Validation covers chart totals and stable geometry, segment selection, all-chapter loop scoping, automatic start and absence of animation-control buttons, modal and simulated document visibility, reduced motion, dark/light themes and responsive presentation layouts. Physical display acceptance, native Arabic editorial review and native Safari/iPhone remain separate checks.
