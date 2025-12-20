// @ts-ignore
import bcrypt from "bcrypt";
import { db } from "../db";
import { admins } from "@shared/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  // @ts-ignore
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // @ts-ignore
  return bcrypt.compare(password, hash);
}

export async function createAdmin(email: string, password: string, name?: string) {
  const passwordHash = await hashPassword(password);
  
  try {
    await db.insert(admins).values({
      email,
      password_hash: passwordHash,
      name,
      status: "active",
    });
    
    return { success: true, message: "Admin criado com sucesso" };
  } catch (error) {
    throw new Error("Erro ao criar admin");
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<{ success: boolean; message: string; admin?: { id: string; email: string; name?: string } }> {
  try {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (!admin) {
      return { success: false, message: "Email ou senha inválidos" };
    }

    if (admin.status !== "active") {
      return { success: false, message: "Admin desativado" };
    }

    const isPasswordValid = await verifyPassword(password, admin.password_hash);
    if (!isPasswordValid) {
      return { success: false, message: "Email ou senha inválidos" };
    }

    // Atualizar último login
    await db
      .update(admins)
      .set({ last_login: Math.floor(Date.now() / 1000) })
      .where(eq(admins.id, admin.id));

    return {
      success: true,
      message: "Admin autenticado com sucesso",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name || undefined,
      },
    };
  } catch (error) {
    throw new Error("Erro ao autenticar admin");
  }
}

export async function getAdminById(id: string) {
  try {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);

    return admin || null;
  } catch (error) {
    return null;
  }
}
