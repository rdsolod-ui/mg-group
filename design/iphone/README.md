# Landscape phone frame

Editable original presentation model made with Blender 5.2.1. It is inspired by a modern iPhone silhouette; no third-party product CAD is included.

Render in a separate background Blender process, not in a user's open scene:

```sh
blender --background --factory-startup --python design/iphone/build_phone.py -- final
python design/iphone/finalize_assets.py
```

The second command requires Pillow. It converts the rendered PNG losslessly, verifies the display alpha and registration, and writes `public/device/iphone-landscape.webp` and its JSON screen coordinates. Preview mode is available by replacing `final` with `preview` in the first command; a preview is not suitable as input to the full-resolution finalizer.

The live video remains an HTML video beneath the image. The orthographic camera, open display geometry and exact CSS screen rectangle keep the footage aligned without a realtime 3D rendering cost.
