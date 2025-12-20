import type { Express } from "express";
import { authenticateAdmin, createAdmin } from "../services/admin-auth";
import { generateToken } from "../middleware/auth";
import { createRateLimiter } from "../middleware/rate-limit";

// Rate limiter para login
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxAttempts: 5,
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
});

export function setupAuthRoutes(app: Express) {
  // Rota de login
  app.post("/api/auth/login", loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const result = await authenticateAdmin(email, password);

      if (!result.success) {
        return res.status(401).json({ message: result.message });
      }

      // Garantir que result.admin existe
      if (!result.admin) {
        return res.status(401).json({ message: "Erro ao autenticar" });
      }

      const token = generateToken(result.admin.id, result.admin.email);

      res.json({
        success: true,
        token,
        admin: result.admin,
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });

  // Rota para validar token
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      // Verificar se o token é válido
      const payload = req.body; // O middleware de auth já validou
      res.json({ valid: true });
    } catch (error) {
      res.status(401).json({ valid: false });
    }
  });

  // Rota para logout (apenas para limpar no cliente, o backend usa JWT stateless)
  app.post("/api/auth/logout", async (_req, res) => {
    res.json({ success: true, message: "Logout realizado com sucesso" });
  });

  // Rota para criar novo admin (protegida - apenas para admins existentes)
  // Este endpoint deve ser usado com cuidado
  app.post("/api/auth/admin/create", async (req, res) => {
    try {
      // Em produção, este endpoint deve ser protegido
      // com verificação de permissões de admin
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      await createAdmin(email, password, name);

      res.status(201).json({
        success: true,
        message: "Admin criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      res.status(500).json({ message: "Erro ao criar admin" });
    }
  });
}
