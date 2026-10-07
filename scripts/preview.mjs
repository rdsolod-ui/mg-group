import http from "node:http";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const base = "/mg-group";
const port = Number(process.argv[2] || 3116);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".pdf": "application/pdf",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".wasm": "application/wasm",
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".mp4": "video/mp4",
  ".m4s": "video/iso.segment",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};
http
  .createServer(async (req, res) => {
    try {
      let url = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (url === base) {
        res.writeHead(308, { Location: base + "/" });
        res.end();
        return;
      }
      if (!url.startsWith(base + "/")) throw Error("route");
      let file = path.resolve(root, "." + url.slice(base.length));
      if (file !== root && !file.startsWith(root + path.sep))
        throw Error("path");
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      res.setHeader(
        "Content-Type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      const { size } = await stat(file);
      res.setHeader("Accept-Ranges", "bytes");
      const range = req.headers.range;
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        const start = match?.[1] ? Number(match[1]) : Math.max(0, size - Number(match?.[2]));
        const end = match?.[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
        if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || start < 0 || start > end || start >= size) {
          res.writeHead(416, { "Content-Range": `bytes */${size}` }); res.end(); return;
        }
        res.writeHead(206, { "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
        if (req.method === "HEAD") res.end();
        else createReadStream(file, { start, end }).pipe(res);
      } else {
        res.setHeader("Content-Length", size);
        if (req.method === "HEAD") res.end();
        else createReadStream(file).pipe(res);
      }
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Preview http://127.0.0.1:${port}${base}/`),
  );
