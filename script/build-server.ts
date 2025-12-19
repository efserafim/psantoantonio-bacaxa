import { build as viteBuild } from "vite";
import { mkdir, cp } from "fs/promises";

async function buildAll() {
  // Build client
  console.log("building client...");
  await viteBuild();

  // Copy server and shared to dist
  console.log("copying server files...");
  await mkdir("dist", { recursive: true });
  
  try {
    await cp("server", "dist/server", { recursive: true });
    console.log("✓ Server copied");
  } catch (e) {
    console.warn("Server copy warning:", e);
  }
  
  try {
    await cp("shared", "dist/shared", { recursive: true });
    console.log("✓ Shared copied");
  } catch (e) {
    console.warn("Shared copy warning:", e);
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});



