# PDF download

The header links directly to `public/downloads/MG-Group-Presentation.pdf` with a native download attribute. The PDF is a static Arabic-first, English-second edition of all 21 chapters, dated 7 October 2026. Videos link back to the website; web animations become stills.

To refresh: build the site, run `scripts/build-pdf-html.py` (Python with lxml), serve out with the preview script, then print `/mg-group/pdf-preview.html` in Chromium with CSS page size and backgrounds enabled. Inspect every page before replacing the public PDF. Rebuild afterwards so the temporary HTML is excluded from deployment. Keep selectable text and transparency layers when optimizing image data; do not remove referenced graphics as orphan objects.

Verified: 21 landscape pages, all-page rendering review, local build/typecheck/export checks, responsive header at 320 px. The PDF is downloaded only on demand and is not preloaded.
