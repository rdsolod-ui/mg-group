# Attraction films and device mockup

Source verification: 6 October 2026 UTC / 7 October in the owner's Dubai timezone. The owner requested the videos linked by the hero buttons on parkskazka.ru. Exact public page URLs, video URLs and observed specifications are recorded in `ride-video-sources.json`.

| Presentation card | Operating example | Film | Relation to design model |
|---|---|---|---|
| Wheel | Observation wheel | Not available on current source page | 24 operating cabins; supplied model has 30 |
| Swing carousel | Sky carousel | Official hero film | Related swing-ride configuration; not asserted to be identical |
| Drop tower | Zvezdopad | Official hero film | Same ride family; colour and details differ |
| Condor | Smerch | Official hero film | Condor arrangement identified visually |
| Typhoon | Not identified | No confirmed source | Supplied track model only |
| Lightning | Lightning | Official hero film | Name and attraction confirmed |
| Disco Coaster | Galaktika | Official hero film | Placement source contains no ride geometry |

## Media delivery

- Self-hosted HLS VOD: 360p Economy, 720p, 1080p High; Auto adapts using measured throughput. No upscaling. Original durations and audio are retained; 50fps material is converted to 25fps for web delivery.
- Keyframes and variant boundaries align at four seconds. Each rendition ends with a complete VOD playlist. MP4 fallback uses economical 360p and a front-loaded `moov` atom for progressive playback.
- Original files and SHA-256 receipts remain in the owner's private production workspace. Large source/intermediate videos are not committed.
- Native HLS is preferred when supported. Otherwise hls.js is loaded on the first play action. Fatal stream errors have bounded retries and then a visible fixed-quality fallback; final failure offers manual retry.
- No video payload before a click. Only the selected film is mounted. Offscreen, document-hidden and presentation-pause states pause playback and stop loading; resuming is explicit.
- The player exposes actual decoded resolution, buffered ranges, seeking, audio, fullscreen and quality choice. Native Safari manages its own forward buffer; JavaScript-controlled playback targets 20 seconds with a 32-second cap and an eight-second back buffer.

## Blender frame

An original modern iPhone-like shell was modelled in Blender 5.2.1: satin titanium, polished chamfers, glass border, antenna seams, buttons, camera lens and speaker mesh. It is an illustrative presentation object, not official Apple CAD.

The final frame is 2400×1240, Cycles with up to 256 adaptive samples and denoising. Its display and background have true alpha. The lossless WebP is about 171 KiB. Exact orthographic registration is stored in `public/device/iphone-landscape.json`; the live HTML video sits beneath the rendered bezel and sensor island. `object-fit: contain` preserves all footage without cropping.

## Acceptance

Check all five films for decoded frame progress, duration/audio, switching 1080p↔360p, seeking, pause and cleanup. Test a throttled 700 Kbit/s / 150ms connection, failure/fallback/manual retry and zero media requests before play. Inspect desktop, short presentation screens, mobile, light theme and fullscreen. Confirm all six existing design views remain accessible and that no film/specifications are invented for missing sources.

Native Safari/iPhone hardware and native Arabic editorial review remain separate acceptance items. Browser emulation and a synthetic visibility event do not establish those results.
