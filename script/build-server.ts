import { build as viteBuild } from "vite";
import { execSync } from "child_process";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

async function buildAll() {
  // Build client
  console.log("building client...");
  await viteBuild();

  // Compile server TypeScript to JavaScript
  console.log("compiling server...");
  execSync("npx tsc server/index.ts --outDir dist --module commonjs --target es2020 --skipLibCheck", {
    stdio: "inherit"
  });
  
  // Compile shared TypeScript
  console.log("compiling shared...");
  execSync("npx tsc shared/schema.ts --outDir dist --module commonjs --target es2020 --skipLibCheck", {
    stdio: "inherit"
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});


