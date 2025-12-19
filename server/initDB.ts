import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db";
import { news, massas, pastorais, capelas } from "@shared/schema";
import { sql } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    const dbPath = path.resolve(__dirname, "../parish.db");
    const sqlite = new Database(dbPath);

    // Create tables
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'published',
        published_at INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS massas (
        id TEXT PRIMARY KEY,
        capela_id TEXT,
        day_of_week TEXT NOT NULL,
        time TEXT NOT NULL,
        description TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS pastorais (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        coordinator TEXT,
        email TEXT,
        phone TEXT,
        meeting_day TEXT,
        meeting_time TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'active',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS capelas (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        neighborhood TEXT,
        address TEXT,
        phone TEXT,
        description TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'active',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Check if data already exists
    const newsCount = sqlite.prepare("SELECT COUNT(*) as count FROM news").get() as any;
    const massaCount = sqlite.prepare("SELECT COUNT(*) as count FROM massas").get() as any;
    const pastoralCount = sqlite.prepare("SELECT COUNT(*) as count FROM pastorais").get() as any;
    const capelaCount = sqlite.prepare("SELECT COUNT(*) as count FROM capelas").get() as any;

    // Insert sample capelas
    if (capelaCount.count === 0) {
      const capelaStmt = sqlite.prepare(`
        INSERT INTO capelas (id, name, neighborhood, address, phone, description, status, created_at)
        VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?)
      `);

      const capelasData = [
        { name: "Capela do Centro", neighborhood: "Centro", address: "Rua Principal, 100", phone: "(11) 3000-0000", description: "Capela localizada no centro da cidade" },
        { name: "Capela da Vila", neighborhood: "Vila Nova", address: "Avenida Secundária, 250", phone: "(11) 3000-0001", description: "Capela no bairro da Vila Nova" },
        { name: "Capela do Bairro", neighborhood: "Bairro Novo", address: "Rua da Esperança, 50", phone: "(11) 3000-0002", description: "Capela no bairro novo" },
      ];

      for (const cap of capelasData) {
        capelaStmt.run(cap.name, cap.neighborhood, cap.address, cap.phone, cap.description, "active", Math.floor(Date.now() / 1000));
      }
    }

    // Insert sample massas
    if (massaCount.count === 0) {
      const massaStmt = sqlite.prepare(`
        INSERT INTO massas (id, capela_id, day_of_week, time, description, created_at)
        VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?)
      `);

      const massasData = [
        { day: "0", time: "07:00", desc: "Missa do Domingo de manhã" },
        { day: "0", time: "09:00", desc: "Missa do Domingo" },
        { day: "0", time: "19:00", desc: "Missa do Domingo à noite" },
        { day: "3", time: "19:00", desc: "Missa de quarta-feira" },
        { day: "5", time: "19:00", desc: "Missa de sexta-feira" },
        { day: "6", time: "18:00", desc: "Missa de sábado" },
      ];

      for (const m of massasData) {
        massaStmt.run(null, m.day, m.time, m.desc, Math.floor(Date.now() / 1000));
      }
    }

    // Insert sample pastorais
    if (pastoralCount.count === 0) {
      const pastoralStmt = sqlite.prepare(`
        INSERT INTO pastorais (id, name, description, coordinator, email, phone, meeting_day, meeting_time, status, created_at)
        VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const pastoraisData = [
        {
          name: "Pastoral Familiar",
          description: "Pastoral dedicada ao apoio às famílias da comunidade",
          coordinator: "Maria da Silva",
          email: "pastoral.familiar@email.com",
          phone: "(11) 98000-0000",
          meeting_day: "Terça-feira",
          meeting_time: "19:00"
        },
        {
          name: "Pastoral da Saúde",
          description: "Cuidados pastorais com enfermos e hospitalizados",
          coordinator: "João Santos",
          email: "pastoral.saude@email.com",
          phone: "(11) 98000-0001",
          meeting_day: "Quarta-feira",
          meeting_time: "14:00"
        },
        {
          name: "Pastoral de Liturgia",
          description: "Organização de celebrações e funções litúrgicas",
          coordinator: "Padre Lucas",
          email: "pastoral.liturgia@email.com",
          phone: "(11) 98000-0002",
          meeting_day: "Segunda-feira",
          meeting_time: "19:30"
        },
        {
          name: "Grupo de Oração",
          description: "Encontros de oração e reflexão espiritual",
          coordinator: "Ana Paula",
          email: "grupo.oracao@email.com",
          phone: "(11) 98000-0003",
          meeting_day: "Quinta-feira",
          meeting_time: "19:00"
        },
      ];

      for (const p of pastoraisData) {
        pastoralStmt.run(
          p.name,
          p.description,
          p.coordinator,
          p.email,
          p.phone,
          p.meeting_day,
          p.meeting_time,
          "active",
          Math.floor(Date.now() / 1000)
        );
      }
    }

    // Insert sample news if empty
    if (newsCount.count === 0) {
      const newsStmt = sqlite.prepare(`
        INSERT INTO news (id, title, excerpt, content, image_url, status, published_at, created_at)
        VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?)
      `);

      const sampleNews = [
        {
          title: "Bem-vindo à Paróquia",
          excerpt: "Celebramos 50 anos de serviço à comunidade",
          content: "Neste ano especial, celebramos cinco décadas de dedicação ao serviço pastoral.",
          imageUrl: null,
        },
        {
          title: "Festa de Santo Antônio",
          excerpt: "Confira a programação da festa de Santo Antônio deste ano",
          content: "A festa será celebrada com missas, procissão e atividades comunitárias.",
          imageUrl: null,
        },
      ];

      const now = Math.floor(Date.now() / 1000);
      for (let i = 0; i < sampleNews.length; i++) {
        const item = sampleNews[i];
        newsStmt.run(
          item.title,
          item.excerpt,
          item.content,
          item.imageUrl,
          "published",
          now - (i * 86400),
          now - (i * 86400)
        );
      }
    }

    sqlite.close();
    console.log("✓ Database initialized with all tables and sample data");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
