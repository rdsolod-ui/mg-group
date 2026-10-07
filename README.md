# MG Group

An Arabic-first, bilingual corporate presentation of amusement park development, engineering, installation, launch and technical operations. English follows each Arabic content block.

MG Group is the primary brand. AL-SHAHIQ is presented as a company within the group, as identified by the project owner. The head office address was supplied by the owner: Russia, Moscow, 23 Osennyaya Street.

## Website

Intended public route: [MG Group](https://marketing.parkskazka.ru/mg-group/).

The presentation contains seventeen chapters: introduction, scale, engineering, interactive ride models, specialists, lifecycle, geography, eight project case studies, partnership and head office. It supports continuous scrolling, a chapter menu, a Present mode, keyboard navigation, light/dark themes, motion pause and system reduced-motion preferences.

The primary logo is a new geometric MG monogram with a structural M and an open G. Its navy and copper palette combines technical clarity with the human side of amusement destinations. The main signature, white signature, monochrome version and compact mark are true SVG paths with transparent backgrounds. Lettering is outlined; no installed font is required to display the files. The AL-SHAHIQ supporting logo uses a reworked mountain mark and broad-nib Arabic Ruqaa lettering converted to paths.

## Run and build

Node 24.x and the committed npm lockfile are used.

```sh
npm ci
npm run dev
npm run build
npm run typecheck
npm run check:export
npm run preview
```

Development/preview URL: `http://127.0.0.1:3116/mg-group/`. The static build is in `out/`. Next.js exports HTML, CSS and JavaScript; no application server, database or login is required. Nginx serves the production artifact. React and GSAP handle the presentation interface; an on-demand Three.js globe presents the portfolio geography.

## Content and evidence

Portfolio facts and images originate in the ten-page MG GROUP CORP presentation supplied by the owner. `src/data/source-register.json` retains source pages, original metric meanings and unconfirmed dates/stages. `src/data/media.json` records extracted image dimensions and provenance.

The final Arabic/English headlines, ride hooks and editorial boundaries are documented in [the copy deck](docs/COPY-DECK.md). `src/data/presentation-copy.ts` holds the shared presentation copy.

- Eight projects and two countries are listed in the source.
- The 97-ride aggregate is arithmetic across Skazka, Leo Tolstoy, VDNKH, Izmaylovo and Ohta: 60 + 27 + 6 + 3 + 1. Three projects marked under construction and airport activities are excluded.
- Skazka's 1.5 million visits refer specifically to 2024. Other visitation periods are unspecified.
- Minny Gorodok, Al Haffa and Domodedovo retain the source's construction-stage label. Listed opening years do not prove current opening or completion.
- Investment figures are reported project figures, not company valuations or proof that MG Group solely funded them.
- The owner supplied 10 engineers and 54 mechanics on 6 October 2026: 64 technical specialists in total. Certifications and service-level commitments are not supplied or invented.
- The original field “Number of employers” is retained only in the data register for clarification, not used as an engineer/mechanic count.

Seven generated perspective masterplans and an engineering illustration replace the original low-resolution case imagery. They are labelled interpretive visualizations, not surveyed or as-built plans. Salalah uses original owner-supplied DJI photographs and a 24-second adaptive site film, alongside the development concept and 13-element programme plan from the Salalah presentation. Source photography, footage and development concepts remain separately identified. See `docs/VISUAL-SYSTEM-V2.md` for provenance, exact generation prompts and limitations. The original PDF is not redistributed in the site. Khalid is the owner-designated contact in Oman. His owner-supplied WhatsApp number is +968 9610 0010. The QR opens the WhatsApp chat URL; downloading the vCard or project brief sends no message.

## Public assets and licences

Font licences are in `public/licenses/`. IBM Plex and Aref Ruqaa glyph outlines are used in the brand files under their respective OFL terms. Preserve these notices. Portfolio photography, plans, project names and corporate brand materials originate in supplied company material; public visibility does not grant a blanket licence to reuse those assets. No blanket licence is assigned to the portfolio.

## SEO and link previews

The static page includes bilingual search metadata, Open Graph and Twitter cards, accurate Organization/WebSite/WebPage/Service JSON-LD, a canonical sitemap, and a full SVG/ICO/PNG/Apple/Android/maskable icon kit. Three generated photographic previews use the original vector logo and local Arabic/English fonts. See [SEO, sharing and favicon documentation](docs/SEO-AND-SHARING.md) for editable sources, checks, generation provenance and platform limitations.

## Release contract

GitHub CI builds, checks and uploads `mg-group-static-site` with `revision.json` and a file manifest. VPS publication uses that exact artifact, a fresh server baseline, a separate release directory and an atomic route switch. Existing catalog entries and other sites must be preserved. Public publication and live read-back are distinct from a local build. Server administration and private release receipts are kept outside this repository.

Native Arabic editorial review, updated construction stages and actual-room legibility remain separate acceptance items. See `docs/architecture.md` and `docs/qa.md`.

## Ride visualisations

Six supplied CAD/DCC assets are processed through native format readers and Blender: observation wheel, swing carousel, drop tower, Condor, Typhoon and Lightning. The web chapter uses compressed GLB models, 2048px finish textures, local Draco decoders and Blender-rendered posters. Models download only after an explicit load action, with their actual file size, byte progress, cancellation and retry. Animation pauses outside the viewport, with the presentation pause control, and for system reduced-motion preferences. Dragging changes the viewing angle. Typhoon and Lightning show track/structure inspection rather than an unverified train simulation.

These are design visualisations, not verified mechanical or operational simulations. Motion timing is illustrative. The supplied DiscoCoster placement scene contains surrounding site geometry; the ride itself was not found, so it is not presented as a completed attraction model. Source scenes, full Blender masters, native audit logs and large intermediate files are retained outside the public repository. See `docs/ride-production.md` for the production contract and remaining source limitations.

## Official attraction films

Seven attraction cards pair design views with sourced Skazka footage and installation specifications. Five official hero-button films are self-hosted as HLS VOD at 360p, 720p and 1080p, with an economical MP4 fallback. Video starts only after a click, buffers ahead, adapts to available bandwidth and stops requesting segments offscreen or while the presentation is paused. The landscape phone frame is a transparent Cycles render from an editable Blender model in `design/iphone/`.

The wheel page has no current video button; Typhoon has no confirmed matching park page. Those cards keep their design views. Park figures are clearly separated from CAD specifications, including the wheel's 24 operating cabins versus 30 in the supplied model. See `docs/ride-video.md` and `docs/ride-video-sources.json`.

## Loading and constrained connections

See [performance and loading behavior](docs/PERFORMANCE.md) for responsive delivery assets, data-saving controls, media timeouts, server caching, and the browser verification protocol.
