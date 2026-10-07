# Delivery performance and media loading

## User behavior

- The Arabic/English presentation and all factual content remain in static HTML. There is no full-screen loading gate.
- The hero image is immediately discoverable in HTML, uses high fetch priority, responsive AVIF and a WebP fallback. Its reserved area has a tiny inline preview.
- Other photographs start near the viewport (100 px normally, 0 px with data saving). Their original dimensions reserve space. The gallery loads the original full-resolution image when zooming in.
- Contextual MG line animations appear after 180 ms, finish within five seconds, and respect reduced motion and the presentation pause. Images offer retry after an error or a 30-second timeout. The surrounding copy remains usable.
- Open the chapter menu → **Data usage → Save data** to request 640 px photographs and economy video. The setting is retained locally when storage is available. Auto mode also observes Save-Data, reported 2G/3G and downlink below 1.6 Mbps. Browsers without Network Information retain manual controls and normal responsive delivery.
- Six original design models require a deliberate download action. The button gives the actual file size (7.4–26.0 MB). Progress comes from received bytes and Content-Length, with no invented percentage. Cancel, switching the ride/view, leaving the viewport during download, or going offline aborts the request. A 20-second transfer stall or 30-second scene preparation timeout offers retry. The Blender poster stays visible.
- An interactive globe loads when visible on a regular connection; data-saving mode first offers the static world preview and city links, with an explicit interactive-load button.
- Video media starts only on play. Its frame/poster are deferred until visible. HLS starts at the low rung; economy limits the forward buffer to 10 seconds (16 maximum), normal mode uses 20/32 seconds. Native HLS uses the economy playlist when requested. The existing quality selector can override the initial choice.
- Video buffering offers cancellation; a continuous 30-second wait becomes a retry state. A fatal HLS network error does not silently start the MP4 fallback. Decoder/format fallback remains available. Offline stops transfers and playback; reconnection requires play to resume from the saved position.
- Loaded content remains usable during connection loss. This is not a service-worker offline installation: a first visit still requires internet access.

## Assets and reproducibility

`npm run assets:performance` generates AVIF/WebP delivery derivatives for 18 source images and a compact Oman flag. It preserves all originals and records source/content SHA-256, dimensions, byte sizes and tiny previews in `src/data/optimized-media.json`. Names contain content hashes. Never overwrite an immutable URL with different bytes.

The Latin-only IBM Plex variable subset retains Latin/extended Latin, punctuation, currency, arrows and the minus sign; Arabic font files and shaping are unchanged. The original fonts and OFL notices are retained. Recreate in an isolated Python environment with fonttools and brotli:

```text
python -m fontTools.subset public/fonts/IBMPlexSans-Variable.woff2 --unicodes=U+0000-024F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2122,U+2190-21FF,U+2212,U+FEFF,U+FFFD --layout-features=* --flavor=woff2 --output-file=<temporary-subset.woff2>
```

Hash the resulting bytes, save as `public/optimized/IBMPlexSans-Latin-<first-12-SHA256>.woff2`, and update the CSS URL. No runtime package is added for this operation.

The short chapter transition uses the browser Animation API instead of loading GSAP for one transition. Three.js and the HLS implementation remain deferred. A completed model's temporary object URL and renderer resources are released on leaving its session.

## VPS configuration

The `/mg-group/` location alone enables gzip for HTML, JS, CSS, JSON, SVG, XML, plain text and the web manifest. Hashed `/_next/static/` and `/optimized/` files use `public, max-age=31536000, immutable`. Other presentation files revalidate (`max-age=0, must-revalidate`). AVIF and the web manifest have explicit MIME types; media byte ranges remain available.

Apply changes with a fresh configuration hash, a recoverable backup, `nginx -t`, a graceful reload and read-back. Release HTML, scripts and derivatives together from the exact CI artifact. Keep the previous release for rollback. Server configuration and each release have separate private receipts.

## Checks

`npm run check:export` includes independent source/derivative hashes, actual image dimensions/aspect ratios, a 120 KB 960 px AVIF hero budget, a 10 KB flag budget, a 120 KB subset font budget and exact model download-size labels. Existing original-asset, video, static SEO and favicon checks remain enabled.

Browser verification covers all 17 slides at mobile and presentation widths, no-JavaScript content, WebP fallback, reduced motion, saved preferences, image failure/retry, model progress/cancellation and a rendered model, native HLS plus the JS HLS path, offline/resume and bounded network-error recovery.

Performance receipts use fresh isolated Chrome contexts, a cold cache, a visible 390×844 viewport at DPR 2, and identical before/after profiles. The constrained profile uses 1.6 Mbps download, 750 Kbps upload, 150 ms latency and 4× CPU slowdown. FCP/LCP/CLS and actual transferred bytes are laboratory observations, not field percentiles or promises for every device. Native Safari/iOS still requires device testing.

Technical references: [LCP delivery guidance](https://web.dev/articles/optimize-lcp), [fetch priority](https://web.dev/articles/fetch-priority), [Network Information availability](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation).
