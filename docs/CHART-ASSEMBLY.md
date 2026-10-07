# Three-dimensional portfolio charts

The portfolio, technical team and geography chapters use solid data sculptures with a shared assembly timeline. The previous stacked SVG extrusion is replaced by actual depth-tested Three.js geometry. The team and country charts now occupy the main visual column; the workshop illustration and interactive globe provide context alongside the copy.

## Source data

`src/data/motion-data.ts` derives values from the existing source register. No new business metrics are inferred:

- Operating rides: **95 = 60 + 27 + 6 + 1 + 1** across five cases.
- Technical staff: **64 = 10 engineers + 54 mechanics**.
- Portfolio projects: **8 = 7 Russia + 1 Oman**; this is a project count, not a claim that all projects are completed.

Angular proportions are computed from full-precision values. Small shares retain their actual angle. Percentages are rounded individually to one decimal place and therefore need not sum to exactly 100.0%. The central total and source table remain available throughout the animation.

## Implementation

- `src/components/chart-assembly.ts`: precise angles and deterministic timeline phases.
- `src/components/ChartAssemblyScene.tsx`: extruded sectors, small inset bevels, subtly crowned reflective faces, studio environment generated locally, base plate, shadows and frame-controlled transforms.
- `src/components/MotionCharts.tsx`: accessible bilingual HTML, selection, visibility, loading/error boundaries, network preferences and lazy scene import.
- `src/app/assembly-charts.css`: stage, responsive legends, labels, short-screen and 4K layouts.
- `scripts/check-charts.mjs`: source totals, angular coverage, all focus phases, bounded movement and continuity across the loop boundary.

The animation assembles the parts, focuses them sequentially, then opens the assembly before repeating. The repeat boundary has matching positions. A single scene clock drives the geometry, active callout and connector; labels update only at focus changes. Selecting a legend item holds it until Show all or deselection. Each manual transition settles, then on-demand rendering stops. Global pause, chart pause, tab visibility and chapter visibility are respected.

Canvas rendering is mounted only for the active visible chart, and disposed when leaving it. Device pixel ratio is bounded; sustained low frame rate lowers it to 1. The scene generates its own environment map, with no remote HDR, font, model or texture dependency. Shared renderer code uses the already pinned React Three Fiber and Three.js versions; no new runtime package is added.

The geometry uses the documented [Three.js extrusion options](https://threejs.org/docs/pages/ExtrudeGeometry.html). Idle rendering follows [React Three Fiber's demand-rendering contract](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## Resilience and accessibility

Static transparent WebP captures of the same assembled scenes are provided for desktop and mobile. They are content-hashed, lazy-loaded and backed by a lightweight SVG plus the complete HTML source table. Reduced motion and Save data use the static presentation without downloading the chart scene. A missing image retains the vector fallback. A failed scene import, initialization timeout or WebGL context loss retains the data and offers a bounded retry. No-JavaScript reading retains the static charts and values.

Arabic precedes English. The complete data description accompanies the image; the independently focusable legend uses native buttons with pressed states. Automatic focus changes are not live-announced. Keyboard handling stays within the chart controls rather than advancing the slideshow.

## Verification

Build, type checking and the export/SEO/asset integrity checks remain required. Browser acceptance covers the three totals, all categories including both 1/95 shares, local/global pause, remount, desktop/short-screen/4K/mobile layouts, theme changes, reduced motion, Save data and WebGL loss/retry. Inspect contact sheets for assembly, focused sectors and return; moving matrices alone do not establish visual quality.

Dated captures, actual results, delivery sizes and the publication receipt are kept outside the public repository in `C:/Users/admin/Documents/mg-group-production/chart-assembly-20261007/`. Native Safari/iPhone and a physical conference display require separate verification; browser emulation is not a native-device test.
# Central labels

The 95 / 64 / 8 totals and Arabic/English units remain HTML above the WebGL surface. Explicit local layers place the scene below connectors, totals and controls. A compact dark centre and fixed line heights keep the units inside the ring opening, including at 720p and on mobile. Poster images inherit their picture's visibility after load so a loaded preview cannot remain visible behind the animated scene.
