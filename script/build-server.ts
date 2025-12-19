import { build as viteBuild } from "vite";
import { mkdir, cp } from "fs/promises";
import path from "path";

async function buildAll() {
  // Build client
  console.log("building client...");
  await viteBuild();

  // Copy server files to dist
  console.log("copying server files...");
  await mkdir("dist", { recursive: true });
  await cp("server", "dist/server", { recursive: true });
  await cp("shared", "dist/shared", { recursive: true });
  
  // Create entry point
  const entryPoint = `import('./server/index.ts');`;
  await mkdir("dist", { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

