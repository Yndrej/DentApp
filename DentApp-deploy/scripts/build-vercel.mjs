import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of ["index.html", "app.js", "styles.css", "data.js", "manifest.json", "supabase-config.js"]) {
  cpSync(join(root, file), join(dist, file));
}

cpSync(join(root, "documents"), join(dist, "documents"), { recursive: true });
