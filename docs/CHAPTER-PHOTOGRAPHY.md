# Chapter photography

Five previously text-only chapters now have bespoke photorealistic illustrations:

| Chapter | Scene | Preserved information |
| --- | --- | --- |
| Scale | A working amusement park with visitors | 97 rides, 8 projects, 2 countries, 1.5m Skazka visits in 2024 |
| Specialists | Mechanics and an engineer inspecting a gearbox | 64 specialists: 10 engineers and 54 mechanics |
| Lifecycle | Plans reviewed beside an observation wheel before launch | Strategy, engineering/installation, launch, operation/maintenance |
| Partnership | A project meeting around a physical park model | Cooperation scopes and AL-SHAHIQ's group membership |
| Contact | A waterfront destination at blue hour | Khalid's WhatsApp QR, contact download and Moscow head-office address |

All five scenes were generated specifically for the presentation. They depict fictional people and settings and are not photographs of actual employees, partners, offices or completed MG Group projects. Each image has a visible Arabic/English generated-illustration caption and descriptive alternative text. Existing documentary Salalah photographs and video retain their separate source classification.

Original generation resolution: 1672 × 941. Responsive WebP variants: 1672, 960 and 640 pixels wide. All five sets total approximately 2.23 MB; the browser selects one variant per image. Images load lazily and have explicit dimensions. No new animation, external service or tracking is introduced.

Exact prompts are in `visual-generation-prompts.json`; classifications, byte sizes and SHA-256 hashes are in `src/data/visual-provenance.json`. PNG masters are retained in the separate production workspace. The chapter layout is implemented in `ChapterPhoto.tsx` and `chapter-photography.css`.
