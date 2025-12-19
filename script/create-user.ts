import { db } from "../server/db";
import { users } from "../shared/schema";
import crypto from "crypto";

// Simples hash para demonstração (use bcrypt em produção)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function createUser() {
  try {
    const username = "pascomlavinia";
    const password = "123456";
    
    // Hash da senha
    const hashedPassword = hashPassword(password);
    
    // Inserir usuário
    await db.insert(users).values({
      username,
      password: hashedPassword,
    });
    
    console.log("✅ Usuário criado com sucesso!");
    console.log(`Username: ${username}`);
    console.log(`Senha: ${password}`);
    process.exit(0);
  } catch (error: any) {
    if (error.message.includes("UNIQUE")) {
      console.log("⚠️ Usuário já existe!");
    } else {
      console.error("❌ Erro ao criar usuário:", error);
    }
    process.exit(1);
  }
}

createUser();
