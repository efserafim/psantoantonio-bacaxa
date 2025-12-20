import { db } from "../db";
import { admins } from "@shared/schema";
import { createAdmin } from "../services/admin-auth";

export async function seedAdmins() {
  try {
    // Verificar se já existe um admin
    const existingAdmins = await db.select().from(admins);

    if (existingAdmins.length > 0) {
      console.log("✅ Admins já existem no banco de dados");
      return;
    }

    console.log("🌱 Criando admin padrão...");

    // Criar admin padrão
    // IMPORTANTE: Alterar a senha em produção!
    await createAdmin(
      "admin@paroquia.com",
      "senha123456",
      "Administrador Padrão"
    );

    console.log("✅ Admin padrão criado com sucesso");
    console.log("📧 Email: admin@paroquia.com");
    console.log("🔑 IMPORTANTE: Altere a senha imediatamente em produção!");
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
  }
}
