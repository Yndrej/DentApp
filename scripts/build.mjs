import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const publicDir = join(dist, "public");
const serverDir = join(dist, "server");

rmSync(dist, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });
mkdirSync(serverDir, { recursive: true });
mkdirSync(join(dist, ".openai"), { recursive: true });

for (const file of ["index.html", "app.js", "styles.css", "data.js", "manifest.json", "supabase-config.js"]) {
  cpSync(join(root, file), join(publicDir, file));
  cpSync(join(root, file), join(dist, file));
}

cpSync(join(root, "documents"), join(publicDir, "documents"), { recursive: true });
cpSync(join(root, "documents"), join(dist, "documents"), { recursive: true });
cpSync(join(root, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));

const assetFiles = [
  ["index.html", "text/html; charset=utf-8"],
  ["app.js", "application/javascript; charset=utf-8"],
  ["styles.css", "text/css; charset=utf-8"],
  ["data.js", "application/javascript; charset=utf-8"],
  ["manifest.json", "application/manifest+json; charset=utf-8"],
  ["supabase-config.js", "application/javascript; charset=utf-8"],
  ["documents/demontaz.pdf", "application/pdf"],
  ["documents/odovzdavaci-protokol.pdf", "application/pdf"],
  ["documents/servisny-protokol.pdf", "application/pdf"],
  ["documents/skolenie.pdf", "application/pdf"],
];

const assets = Object.fromEntries(assetFiles.map(([file, contentType]) => {
  const base64 = readFileSync(join(root, file)).toString("base64");
  return [`/${file}`, { contentType, base64 }];
}));

writeFileSync(join(serverDir, "index.js"), `
const ASSETS = ${JSON.stringify(assets)};

function bytesFromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname === "/" || !url.pathname.includes(".") ? "/index.html" : url.pathname;
    const asset = ASSETS[path];

    if (!asset) return new Response("Not found", { status: 404 });

    return new Response(bytesFromBase64(asset.base64), {
      headers: {
        "content-type": asset.contentType,
        "cache-control": "no-store"
      }
    });
  }
};
`.trimStart());
