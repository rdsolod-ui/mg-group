# MG Group motion and charts

The presentation uses one restrained motion system across all 17 chapters. Native SVG/CSS scenes and the existing GSAP/Three.js stack are used; no animation service, video background or new dependency is required.

## Motion coverage

| Area | Added motion |
| --- | --- |
| All chapters | Slow architectural background rings; active-chapter entrance; visible-chapter scheduling |
| Opening | Documentary-style project visual and national flags; decorative ride plaque removed |
| Scale | Large extruded doughnut with sequentially exploded sectors and synchronized legend |
| Engineering | Actual Skazka wheel photograph; no fictional hub or decorative transmission |
| Attractions | Existing model animation retained under the shared pause/visibility control |
| Specialists | Two-segment technical-team chart and source-derived percentages |
| Lifecycle | Four labelled project stages with sequential progress underlines |
| Geography | Slow rotation of the existing satellite globe; Russia/Oman project chart |
| Eight cases | Photo-frame accents; operating-portfolio share bars or source-programme indicators |
| Partnership | A connected-group diagram beside AL-SHAHIQ |
| Contact | A small connection signal in the contact card; QR remains stationary |

Photographic light accents never alter documentary provenance. Masterplan images remain fully inspectable in the existing gallery. Decorative diagrams are illustrative, not engineering simulation, live telemetry or construction-progress evidence.

## Data integrity

- Operating attractions: 60 + 27 + 6 + 1 + 1 = **95** across five source cases. Shares are calculated against 95; construction projects and airport activities are excluded.
- Technical team: **10 engineers + 54 mechanics = 64 specialists**. Shares: 15.6% and 84.4%, rounded to one decimal place.
- Country mix: **7 Russian projects + 1 Oman project = 8 projects**. These are counts, not revenue, investment or workload shares.
- Construction-labelled cases: Minny Gorodok retains 35 rides and the airport 10 activities. The owner corrected Salalah on 7 October 2026 to one wheel plus two arcade stalls, shown separately. This does not independently confirm an updated completion stage.
- No attendance trend is drawn: the source only dates Skazka visits to 2024, and periods for other cases are unspecified.

All values come from `src/data/source-register.json`. Sector angles and totals stay fixed throughout a loop; sectors move outward sequentially. Extruded SVG layers create depth without another WebGL scene. Every chart has a bilingual legend, accessible value description and keyboard-operable highlighting. A selected sector pauses automatic cycling until deselected. Shared pause, visibility and reduced-motion controls apply.

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
