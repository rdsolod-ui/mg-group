import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const base = "/mg-group";
const port = Number(process.argv[2] || 3116);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".wasm": "application/wasm",
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
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Preview http://127.0.0.1:${port}${base}/`),
  );
