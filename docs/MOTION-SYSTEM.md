# MG Group motion and charts

The presentation uses one restrained motion system across all 17 chapters. Native SVG/CSS scenes and the existing GSAP/Three.js stack are used; no animation service, video background or new dependency is required.

## Motion coverage

| Area | Added motion |
| --- | --- |
| All chapters | Slow architectural background rings; active-chapter entrance; visible-chapter scheduling |
| Opening | Observation wheel with counter-rotating cabins, coaster car and a subtle light cycle |
| Scale | Five-segment doughnut, proportional bars, a moving ring marker and cyclic emphasis |
| Engineering | Mechanical gears, drive components and a transmission signal |
| Attractions | Existing model animation retained under the shared pause/visibility control |
| Specialists | Two-segment technical-team chart and source-derived percentages |
| Lifecycle | Four process icons, travelling signal and sequential step emphasis |
| Geography | Slow rotation of the existing satellite globe; Russia/Oman project chart |
| Eight cases | Photo-frame accents; operating-portfolio share bars or source-programme indicators |
| Partnership | A connected-group diagram beside AL-SHAHIQ |
| Contact | A small connection signal in the contact card; QR remains stationary |

Photographic light accents never alter documentary provenance. Masterplan images remain fully inspectable in the existing gallery. Decorative diagrams are illustrative, not engineering simulation, live telemetry or construction-progress evidence.

## Data integrity

- Operating attractions: 60 + 27 + 6 + 3 + 1 = **97** across five source cases. Shares are calculated against 97; construction projects and airport activities are excluded.
- Technical team: **10 engineers + 54 mechanics = 64 specialists**. Shares: 15.6% and 84.4%, rounded to one decimal place.
- Country mix: **7 Russian projects + 1 Oman project = 8 projects**. These are counts, not revenue, investment or workload shares.
- Source-programme values for construction projects remain 35 rides, 3 rides and 10 airport activities. Animated decorative marks do not express completion percentages.
- No attendance trend is drawn: the source only dates Skazka visits to 2024, and periods for other cases are unspecified.

All values come from `src/data/source-register.json`. The chart paths, bar widths, values and denominators stay fixed throughout a loop. Animation changes emphasis and markers only. Every chart has a bilingual legend, accessible value description and keyboard-operable segment highlighting. Totals remain stable when a segment is selected.

## Motion controls

The existing Pause/Resume control stops all newly added loops and automatic 3D motion. Its preference is stored locally. Opening a menu, notes or gallery pauses ambient motion. Hidden document state and offscreen/inactive chapters stop automatic animation; the globe uses demand rendering while paused. Once loaded, its scene remains mounted to preserve the camera and avoid repeated HTML-label teardown. Reduced-motion preference keeps charts and scenes readable without loops. It takes precedence over Resume, while manually requested video playback remains available.

Premium entrances use a 650 ms ease-out with an 80 ms stagger. Repeating sequences typically last 8–32 seconds; the globe turns more slowly. No numeric counter repeatedly resets, no chart distorts its proportions, and no QR code moves.

## Implementation

- `src/data/motion-data.ts`: source-derived chart values and ring geometry.
- `src/components/MotionCharts.tsx`: doughnuts, bars and case indicators.
- `src/components/MotionScenes.tsx`: editable vector scenes.
- `src/components/useMotionVisibility.ts`: document/intersection state.
- `src/app/motion.css`: timing, responsive layouts, theme colors and reduced motion.
- `Experience.tsx`, `ProjectVisual.tsx`, `PortfolioGlobe.tsx`, `PortfolioGlobeScene.tsx`: integration with the existing presentation.

Validation covers chart totals and stable geometry, segment selection, all-chapter loop scoping, pause/resume/persistence, modal and simulated document visibility, reduced motion, dark/light themes and responsive presentation layouts. Physical display acceptance, native Arabic editorial review and native Safari/iPhone remain separate checks.
