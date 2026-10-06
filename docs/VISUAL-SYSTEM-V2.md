# MG Group visual system v2

## Design brief

The page presents park engineering, assembly, commissioning and operations to an international audience. Arabic remains first, followed by English. Existing company metrics, project stages, brand marks and verified ride media remain intact.

The visual emphasis is the complete destination: large, detailed aerial masterplans with the surrounding landscape and circulation visible. Domodedovo uses an indoor roof-off cutaway. Salalah uses actual owner-supplied photography and footage alongside clearly identified materials from its separate development presentation.

## Visual direction

- Preserve the established MG Group palette: deep blue `#102d40`, structural blue `#163a50`, white `#f4f8fa`, muted blue-grey `#bcd0db`, copper `#f4a473`.
- Preserve IBM Plex Sans Arabic and IBM Plex Sans, with Arabic headings leading the hierarchy.
- Wider image column and complete 16:9 aerial views; quiet source captions outside the image. No decorative pins obscuring equipment.
- One clear visual gesture: detailed site-scale imagery. Facts and controls remain restrained.
- Fullscreen gallery offers 100–300% inspection, keyboard-accessible controls and scrollable detail. The perspective views are rendered images, not navigable CAD models.
- Replace the schematic world silhouette with an on-demand 3D globe. No automatic spinning; city links remain usable without WebGL.

## Source boundaries

Seven new park/venue visualizations and one engineering illustration were produced with the built-in image generation tool. They are interpretive views based on the supplied PDF, not surveyed plans, engineering drawings or evidence of completed construction. Layouts and unspecified equipment are illustrative. The source counts remain corporate-presentation metrics, not counts independently verified by generated imagery.

Salalah photography comes from the owner's original DJI media. Web conversions preserve the composition and do not add generated objects. The 24-second site film contains four six-second excerpts at original speed with no generated frames or added soundtrack. `salalah-film-sources.json` records filenames, source hashes and edit points.

The Salalah development image and the 13-element plan are imported from the existing Salalah presentation. The 13 elements include the existing wheel and amenities, not 13 new rides. They do not replace the separate Al Haffa corporate metrics or establish that all proposed construction is complete.

Native generated images are 1672 × 941; they are not advertised as 4K. Web delivery includes 640/960-pixel versions and the full generated resolution. Documentary photos retain up to 2400 pixels; the supplied programme plan retains 3300 pixels.

## Provenance and implementation

- `src/data/visual-provenance.json`: source hashes, classifications and output hashes.
- `docs/visual-generation-prompts.json`: exact prompts and generation mode.
- `src/data/project-visuals.ts`: bilingual captions and gallery associations.
- `src/components/ProjectVisual.tsx`: project imagery, Salalah tabs and image inspection.
- `src/components/PortfolioGlobe*.tsx`: satellite globe, approximate city coordinates and accessible project links.
- `public/films/salalah`: HLS 360p/720p/1080p and progressive MP4 fallback, using the established bounded-buffer player.

Globe texture: [NASA Blue Marble, July 2004 composite](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/), NASA/GSFC, Reto Stöckli. Historical composite, not live satellite imagery. Rendering follows the [React Three Fiber on-demand guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

Private production originals, intermediate video clips and receipts remain outside the public repository in the adjacent `mg-group-production/visual-overhaul` directory. Original supplied CAD and documentary files are preserved.
