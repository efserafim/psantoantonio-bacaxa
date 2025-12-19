import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  console.log("📁 Looking for dist at:", distPath);
  console.log("📁 CWD:", process.cwd());
  console.log("📁 dist exists?", fs.existsSync(path.resolve(process.cwd(), "dist")));
  console.log("📁 dist/public exists?", fs.existsSync(distPath));
  
  if (!fs.existsSync(distPath)) {
    // Try to list what's in dist
    const distParent = path.resolve(process.cwd(), "dist");
    if (fs.existsSync(distParent)) {
      console.log("📁 Contents of dist:", fs.readdirSync(distParent));
    }
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
