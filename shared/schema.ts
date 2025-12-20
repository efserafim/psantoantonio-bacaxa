import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Admin table
export const admins = sqliteTable("admins", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  name: text("name"),
  status: text("status").default("active"), // active, inactive
  last_login: integer("last_login"),
  created_at: integer("created_at").default(sql`(strftime('%s', 'now'))`),
  updated_at: integer("updated_at").default(sql`(strftime('%s', 'now'))`),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  email: true,
  password_hash: true,
  name: true,
  status: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// News table
export const news = sqliteTable("news", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  image_url: text("image_url"),
  status: text("status").default("published"),
  published_at: integer("published_at"),
  created_at: integer("created_at").default(sql`(strftime('%s', 'now'))`),
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  excerpt: true,
  content: true,
  image_url: true,
  status: true,
  published_at: true,
});

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Mass/Missa table
export const massas = sqliteTable("massas", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  capela_id: text("capela_id"),
  day_of_week: text("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  time: text("time").notNull(), // HH:MM format
  description: text("description"),
  created_at: integer("created_at").default(sql`(strftime('%s', 'now'))`),
});

export const insertMassaSchema = createInsertSchema(massas).pick({
  capela_id: true,
  day_of_week: true,
  time: true,
  description: true,
});

export type InsertMassa = z.infer<typeof insertMassaSchema>;
export type Massa = typeof massas.$inferSelect;

// Pastoral table
export const pastorais = sqliteTable("pastorais", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description"),
  coordinator: text("coordinator"),
  email: text("email"),
  phone: text("phone"),
  meeting_day: text("meeting_day"),
  meeting_time: text("meeting_time"),
  image_url: text("image_url"),
  status: text("status").default("active"),
  created_at: integer("created_at").default(sql`(strftime('%s', 'now'))`),
});

export const insertPastoralSchema = createInsertSchema(pastorais).pick({
  name: true,
  description: true,
  coordinator: true,
  email: true,
  phone: true,
  meeting_day: true,
  meeting_time: true,
  image_url: true,
  status: true,
});

export type InsertPastoral = z.infer<typeof insertPastoralSchema>;
export type Pastoral = typeof pastorais.$inferSelect;

// Chapel/Capela table
export const capelas = sqliteTable("capelas", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  neighborhood: text("neighborhood"),
  address: text("address"),
  phone: text("phone"),
  description: text("description"),
  image_url: text("image_url"),
  status: text("status").default("active"),
  created_at: integer("created_at").default(sql`(strftime('%s', 'now'))`),
});

export const insertCapelaSchema = createInsertSchema(capelas).pick({
  name: true,
  neighborhood: true,
  address: true,
  phone: true,
  description: true,
  image_url: true,
  status: true,
});

export type InsertCapela = z.infer<typeof insertCapelaSchema>;
export type Capela = typeof capelas.$inferSelect;
