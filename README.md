# Horizontizer

A tiny p5.js web app that turns any image into a single vertical
slice, stretched across the screen — a "horizontized" view of the
original picture.

## What it does

- Loads a default image (`beach.jpg`) on startup.
- Downscales the image to a 100 x 400 strip.
- Picks one vertical column (controlled by the **position** slider),
  applies a configurable **blur**, and stretches that column to fill
  the whole canvas.
- Optional **animate** mode sweeps the position back and forth
  automatically.

## Usage

- **Upload image** — load any image from your device.
- **position** slider — choose the horizontal slice [0..1].
- **blur** slider — smooth the slice (0–10).
- **animate** checkbox — auto-sweep the position.
- **Save image** button — download the canvas as `horizontized.png`.
- **Spacebar** — toggle fullscreen.

## Running

Static site, no build step. Serve the folder over HTTP (service
workers require it) and open `index.html`:

    python3 -m http.server

Then visit <http://localhost:8000>.

## Files

- `index.html` — page shell, loads p5.js 1.11.3 (CDN) and the sketch.
- `mySketch.js` — all app logic: rendering, UI, input, animation.
- `sw.js` — cache-first service worker for offline use.
- `manifest.json` — PWA metadata (installable, standalone display).

## Notes

- Works offline after the first load (service worker cache).
- The service worker caches each asset individually, so a single
  failed request (e.g. the CDN) cannot break offline support.
- Relative paths are used throughout, so the app can be served from
  a subdirectory as well as a domain root.
