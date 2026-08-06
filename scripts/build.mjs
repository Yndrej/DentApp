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
}

cpSync(join(root, "documents"), join(publicDir, "documents"), { recursive: true });
cpSync(join(root, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));

writeFileSync(join(serverDir, "index.js"), `
export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) return response;
    }

    const url = new URL(request.url);
    if (!url.pathname.includes(".")) {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
    }

    return new Response("Not found", { status: 404 });
  }
};
`.trimStart());
