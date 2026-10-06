# Russia and Oman flags

Two gently waving national flags identify the countries represented in the portfolio. They appear on the desktop opening slide and in Geography on desktop/mobile. They are separate from company branding and project metrics.

## Source artwork

- Russia: original lightweight SVG reconstruction of the three equal horizontal white, blue and red bands, in a 3:2 rectangle, following the [Russian state-symbols website](https://flag.kremlin.ru/). That source explicitly says the blue/red shades are not regulated; this asset uses conventional #0039A6 and #D52B1E.
- Oman: the original 2000 × 1143 JPEG linked by the [Oman Foreign Ministry downloads page](https://www.fm.gov.om/en/ministry/media/downloads/), fetched on 2026-10-07 from https://www.fm.gov.om/wp-content/uploads/Flag_of_OmanMin-of-Info.jpg. Its exact aspect ratio, colors, vertical hoist stripe and white national emblem are retained. No emblem was approximated, generated, extracted as a separate corporate mark or mirrored for RTL.

## Animation and accessibility

`src/components/NationalFlags.tsx` samples each full flag into 32 adjacent CSS strips. A 6.8-second travelling wave grows from a fixed hoist, with phased fabric shading. Artwork is locally hosted, with no remote dependency or new JavaScript library. Arabic labels precede English. Each flag has one accessible image name; decorative strips and poles are hidden from assistive technology.

Existing active-chapter/viewport/document/dialog scheduling and global Pause control apply to the loops. Pause freezes the current frame. Reduced motion displays the complete original flat artwork and disables the waving layer. Flag ratios and orientation do not change with language or theme.

The editable Russian artwork is `public/flags/russia.svg`; official Omani artwork is `public/flags/oman.jpg`. Motion and responsive layout live in `src/app/motion.css`.
