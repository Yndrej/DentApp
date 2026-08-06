import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
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

writeFileSync(join(serverDir, "index.js"), `
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) return response;

      if (!url.pathname.includes(".")) {
        for (const path of ["/index.html", "/public/index.html"]) {
          const fallback = await env.ASSETS.fetch(new Request(new URL(path, url), request));
          if (fallback.status !== 404) return fallback;
        }
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
`.trimStart());
