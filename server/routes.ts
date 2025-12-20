import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { news, massas, pastorais, capelas } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import multer from "multer";
import express from "express";
import { setupAuthRoutes } from "./routes/auth";
import { authMiddleware } from "./middleware/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication routes
  setupAuthRoutes(app);
  // Ensure uploads directory exists and serve it
  const uploadsDir = path.resolve(import.meta.dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // setup multer for handling multipart uploads
  const storageM = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
      cb(null, unique);
    },
  });
  const upload = multer({ storage: storageM });

  // prefix all routes with /api

  // List published news
  app.get("/api/noticias", async (_req, res) => {
    try {
      const items = await db
        .select()
        .from(news)
        .where(eq(news.status, "published"))
        .limit(20);
      // Sort in application memory
      const sorted = items.sort((a, b) => {
        const dateA = a.published_at || a.created_at || 0;
        const dateB = b.published_at || b.created_at || 0;
        return (dateB as number) - (dateA as number);
      });
      res.json(Array.isArray(sorted) ? sorted : []);
    } catch (e) {
      console.error("Erro ao buscar notícias:", e);
      res.status(500).json([]);
    }
  });

  // Get single news
  app.get("/api/noticias/:id", async (req, res) => {
    try {
      const [item] = await db.select().from(news).where(eq(news.id, req.params.id));
      if (!item) return res.status(404).json({ message: "Notícia não encontrada" });
      res.json(item);
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar notícia" });
    }
  });

  // Create news (accept multipart/form-data with optional image)
  app.post(
    "/api/noticias",
    authMiddleware,
    upload.single("image"),
    async (req: any, res: any) => {
      try {
        const payload = req.body || {};
        const file = req.file;
        const imageUrl = file ? `/uploads/${file.filename}` : payload.imageUrl || null;

        const values = {
          title: payload.title,
          excerpt: payload.excerpt || null,
          content: payload.content || null,
          image_url: imageUrl,
          status: payload.status || "published",
          published_at: payload.publishedAt 
            ? Math.floor(new Date(payload.publishedAt).getTime() / 1000)
            : Math.floor(Date.now() / 1000),
        };

        await db.insert(news).values(values);
        
        // Get the last inserted item
        const [inserted] = await db.select().from(news).orderBy(news.created_at).limit(1);
        res.status(201).json(inserted);
      } catch (e) {
        console.error("Erro ao criar notícia:", e);
        res.status(500).json({ message: "Erro ao criar notícia" });
      }
    },
  );

  // Update news
  app.put("/api/noticias/:id", authMiddleware, async (req, res) => {
    try {
      const payload = req.body;
      await db
        .update(news)
        .set({
          title: payload.title,
          excerpt: payload.excerpt,
          content: payload.content,
          image_url: payload.imageUrl,
          status: payload.status,
          published_at: payload.publishedAt 
            ? Math.floor(new Date(payload.publishedAt).getTime() / 1000)
            : null,
        })
        .where(eq(news.id, req.params.id));

      const [item] = await db.select().from(news).where(eq(news.id, req.params.id));
      res.json(item);
    } catch (e) {
      res.status(500).json({ message: "Erro ao atualizar notícia" });
    }
  });

  // Delete news
  app.delete("/api/noticias/:id", authMiddleware, async (req, res) => {
    try {
      await db.delete(news).where(eq(news.id, req.params.id));
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Erro ao deletar notícia" });
    }
  });

  // ============ MASSAS/MISSAS ============
  app.get("/api/missas", async (_req, res) => {
    try {
      const items = await db.select().from(massas).limit(50);
      res.json(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error("Erro ao buscar missas:", e);
      res.status(500).json([]);
    }
  });

  app.post("/api/missas", authMiddleware, async (req: any, res: any) => {
    try {
      const payload = req.body || {};
      const values = {
        capela_id: payload.capela_id || null,
        day_of_week: payload.day_of_week,
        time: payload.time,
        description: payload.description || null,
      };
      await db.insert(massas).values(values);
      const [inserted] = await db.select().from(massas).limit(1);
      res.status(201).json(inserted);
    } catch (e) {
      console.error("Erro ao criar missa:", e);
      res.status(500).json({ message: "Erro ao criar missa" });
    }
  });

  app.put("/api/missas/:id", authMiddleware, async (req, res) => {
    try {
      const payload = req.body || {};
      const values = {
        capela_id: payload.capela_id || null,
        day_of_week: payload.day_of_week,
        time: payload.time,
        description: payload.description || null,
      };
      await db.update(massas).set(values).where(eq(massas.id, req.params.id));
      const [updated] = await db.select().from(massas).where(eq(massas.id, req.params.id));
      res.json(updated);
    } catch (e) {
      console.error("Erro ao atualizar missa:", e);
      res.status(500).json({ message: "Erro ao atualizar missa" });
    }
  });

  app.delete("/api/missas/:id", authMiddleware, async (req, res) => {
    try {
      await db.delete(massas).where(eq(massas.id, req.params.id));
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Erro ao deletar missa" });
    }
  });

  // ============ PASTORAIS ============
  app.get("/api/pastorais", async (_req, res) => {
    try {
      const items = await db
        .select()
        .from(pastorais)
        .where(eq(pastorais.status, "active"))
        .limit(50);
      res.json(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error("Erro ao buscar pastorais:", e);
      res.status(500).json([]);
    }
  });

  app.get("/api/pastorais/:id", async (req, res) => {
    try {
      const [item] = await db.select().from(pastorais).where(eq(pastorais.id, req.params.id));
      if (!item) return res.status(404).json({ message: "Pastoral não encontrada" });
      res.json(item);
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar pastoral" });
    }
  });

  app.post("/api/pastorais", authMiddleware, upload.single("image"), async (req: any, res: any) => {
    try {
      const payload = req.body || {};
      const file = req.file;
      const imageUrl = file ? `/uploads/${file.filename}` : payload.imageUrl || null;

      const values = {
        name: payload.name,
        description: payload.description || null,
        coordinator: payload.coordinator || null,
        email: payload.email || null,
        phone: payload.phone || null,
        meeting_day: payload.meeting_day || null,
        meeting_time: payload.meeting_time || null,
        image_url: imageUrl,
        status: payload.status || "active",
      };
      await db.insert(pastorais).values(values);
      const [inserted] = await db.select().from(pastorais).limit(1);
      res.status(201).json(inserted);
    } catch (e) {
      console.error("Erro ao criar pastoral:", e);
      res.status(500).json({ message: "Erro ao criar pastoral" });
    }
  });

  app.put("/api/pastorais/:id", authMiddleware, upload.single("image"), async (req: any, res: any) => {
    try {
      const payload = req.body || {};
      const file = req.file;
      const imageUrl = file ? `/uploads/${file.filename}` : payload.image_url || null;

      const values = {
        name: payload.name,
        description: payload.description || null,
        coordinator: payload.coordinator || null,
        email: payload.email || null,
        phone: payload.phone || null,
        meeting_day: payload.meeting_day || null,
        meeting_time: payload.meeting_time || null,
        image_url: imageUrl,
        status: payload.status || "active",
      };
      await db.update(pastorais).set(values).where(eq(pastorais.id, req.params.id));
      const [updated] = await db.select().from(pastorais).where(eq(pastorais.id, req.params.id));
      res.json(updated);
    } catch (e) {
      console.error("Erro ao atualizar pastoral:", e);
      res.status(500).json({ message: "Erro ao atualizar pastoral" });
    }
  });

  app.delete("/api/pastorais/:id", authMiddleware, async (req, res) => {
    try {
      await db.delete(pastorais).where(eq(pastorais.id, req.params.id));
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Erro ao deletar pastoral" });
    }
  });

  // ============ CAPELAS ============
  app.get("/api/capelas", async (_req, res) => {
    try {
      const items = await db
        .select()
        .from(capelas)
        .where(eq(capelas.status, "active"))
        .limit(50);
      res.json(Array.isArray(items) ? items : []);
    } catch (e) {
      console.error("Erro ao buscar capelas:", e);
      res.status(500).json([]);
    }
  });

  app.get("/api/capelas/:id", async (req, res) => {
    try {
      const [item] = await db.select().from(capelas).where(eq(capelas.id, req.params.id));
      if (!item) return res.status(404).json({ message: "Capela não encontrada" });
      res.json(item);
    } catch (e) {
      res.status(500).json({ message: "Erro ao buscar capela" });
    }
  });

  app.post("/api/capelas", authMiddleware, upload.single("image"), async (req: any, res: any) => {
    try {
      const payload = req.body || {};
      const file = req.file;
      const imageUrl = file ? `/uploads/${file.filename}` : payload.imageUrl || null;

      const values = {
        name: payload.name,
        neighborhood: payload.neighborhood || null,
        address: payload.address || null,
        phone: payload.phone || null,
        description: payload.description || null,
        image_url: imageUrl,
        status: payload.status || "active",
      };
      await db.insert(capelas).values(values);
      const [inserted] = await db.select().from(capelas).limit(1);
      res.status(201).json(inserted);
    } catch (e) {
      console.error("Erro ao criar capela:", e);
      res.status(500).json({ message: "Erro ao criar capela" });
    }
  });

  app.put("/api/capelas/:id", authMiddleware, upload.single("image"), async (req: any, res: any) => {
    try {
      const payload = req.body || {};
      const file = req.file;
      const imageUrl = file ? `/uploads/${file.filename}` : payload.image_url || null;

      const values = {
        name: payload.name,
        neighborhood: payload.neighborhood || null,
        address: payload.address || null,
        phone: payload.phone || null,
        description: payload.description || null,
        image_url: imageUrl,
        status: payload.status || "active",
      };
      await db.update(capelas).set(values).where(eq(capelas.id, req.params.id));
      const [updated] = await db.select().from(capelas).where(eq(capelas.id, req.params.id));
      res.json(updated);
    } catch (e) {
      console.error("Erro ao atualizar capela:", e);
      res.status(500).json({ message: "Erro ao atualizar capela" });
    }
  });

  app.delete("/api/capelas/:id", authMiddleware, async (req, res) => {
    try {
      await db.delete(capelas).where(eq(capelas.id, req.params.id));
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Erro ao deletar capela" });
    }
  });

  return httpServer;
}
