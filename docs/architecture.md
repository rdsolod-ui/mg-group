# Architecture and communication

The narrative begins with engineering and technical delivery, then presents project evidence. The company is positioned across development, engineering coordination, ride installation, launch, maintenance and operations. The owner's current team figures are visible: 10 engineers + 54 mechanics = 64 technical specialists. Qualifications and guaranteed outcomes are not invented.

## Chapters

1. MG Group: from engineering to experience.
2. Evidence at scale: 97 rides in five case studies, eight portfolio projects, two countries; Skazka visitation for 2024 separately.
3. Engineering, installation, technical launch and maintenance.
4. Engineers, mechanics and installation/operations teams.
5. Strategy/design → engineering/installation → launch → operation/maintenance.
6. Russia–Oman portfolio geography, with an accessible location list.
7–14. Skazka, Leo Tolstoy, VDNKH, Izmaylovo, Ohta, Minny Gorodok, Al Haffa and Domodedovo.
15. Cooperation scopes and AL-SHAHIQ within the group.
16. Khalid's Oman contact card with WhatsApp QR, downloadable vCard, Moscow head office and a project brief.

Each case uses a common component: image, location, name, scope statement, large metrics, group role, opening year as listed and stage/source note. Construction-stage visitation figures are not displayed as achieved results. Galleries open on user action.

## Implementation

- Next.js static export with `/mg-group` base path.
- Shared React shell: header, chapter navigation, Present, theme and dialogs.
- GSAP only for a short presentation transition; all nonessential motion respects pause and reduced motion.
- SVG engineering illustration and schematic geography avoid unnecessary 3D loading.
- Local WOFF2 fonts, WebP images and all-path brand SVGs.
- Semantic sections, paired language blocks, focusable controls and native dialog focus management.
- Production metadata, canonical URL and sharing preview; no tracker, external form submission, CRM or application API is included.

Technical patterns are adapted from the owner's Muscat presentation. Muscat-specific scenes, land proposals, metrics, approvals and deployment paths are not reused as MG Group facts.
