# Architecture and communication

The narrative begins with engineering and technical delivery, then presents project evidence. The company is positioned across development, engineering coordination, ride installation, launch, maintenance and operations. The owner's current team figures are visible: 10 engineers + 54 mechanics = 64 technical specialists. Qualifications and guaranteed outcomes are not invented.

## Chapters

1. MG Group: from engineering to experience.
2. Evidence at scale: 95 rides in five case studies, eight portfolio projects, two countries; Skazka visitation for 2024 separately.
3. Engineering, installation, technical launch and maintenance.
4. Seven attraction cards: five official park films, sourced installation figures and six source-derived design models.
5. Engineers, mechanics and installation/operations teams.
6. Strategy/design → engineering/installation → launch → operation/maintenance.
7. Russia–Oman portfolio geography, with an accessible location list.
8–15. Skazka, Leo Tolstoy, VDNKH, Izmaylovo, Ohta, Minny Gorodok, Al Haffa and Domodedovo.
16. Cooperation scopes and AL-SHAHIQ within the group.
17. Khalid's Oman contact card with WhatsApp QR, downloadable vCard, Moscow head office and a project brief.

Each case uses a common component: complete perspective masterplan, location, name, scope statement, large metrics, group role, opening year as listed and stage/source note. Construction-stage visitation figures are not displayed as achieved results. Galleries open on user action with 100–300% detail inspection. Salalah has separate site-photo, site-film, development-concept and programme-plan modes.

## Implementation

- Next.js static export with `/mg-group` base path.
- Shared React shell: header, chapter navigation, Present, theme and dialogs.
- GSAP only for a short presentation transition; all nonessential motion respects pause and reduced motion.
- A detailed generated engineering illustration complements seven interpretive masterplans. Salalah keeps documentary photography/footage separate from its presentation concepts. Asset provenance and generation prompts are versioned.
- The satellite globe loads only while its section is visible and uses on-demand rendering without automatic rotation. Accessible city links and an image error fallback remain available.
- The requested ride chapter lazy-loads compressed Blender GLB assets with React Three Fiber, local Draco decoding, PBR environment lighting and a rendered poster fallback. Only the active model animates; offscreen and reduced-motion states pause rendering.
- Park-film mode uses native HLS or a dynamically imported hls.js player, self-hosted adaptive video segments and an economical MP4 fallback. A transparent Blender-rendered landscape device surrounds the live HTML video. Heavy media is loaded only after a play or design-view action.
- Local WOFF2 fonts, WebP images and all-path brand SVGs.
- Semantic sections, paired language blocks, focusable controls and native dialog focus management.
- Production metadata, canonical URL and sharing preview; no tracker, external form submission, CRM or application API is included.

Technical patterns are adapted from the owner's Muscat presentation. Muscat-specific scenes, land proposals, metrics, approvals and deployment paths are not reused as MG Group facts.
