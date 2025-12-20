import type { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    attempts: number;
    lastAttempt: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs?: number; // Janela de tempo em ms (padrão: 15 minutos)
  maxAttempts?: number; // Máximo de tentativas (padrão: 5)
  message?: string;
  keyGenerator?: (req: Request) => string;
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    maxAttempts = 5,
    message = "Muitas tentativas de login. Tente novamente mais tarde.",
    keyGenerator = (req: Request) => req.ip || "unknown",
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!store[key]) {
      store[key] = { attempts: 0, lastAttempt: now };
    }

    const entry = store[key];

    // Resetar se passou a janela de tempo
    if (now - entry.lastAttempt > windowMs) {
      entry.attempts = 0;
      entry.lastAttempt = now;
    }

    entry.attempts++;
    entry.lastAttempt = now;

    if (entry.attempts > maxAttempts) {
      return res.status(429).json({ message });
    }

    next();
  };
}

// Limpar entradas antigas periodicamente
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;

  for (const key in store) {
    if (now - store[key].lastAttempt > windowMs) {
      delete store[key];
    }
  }
}, 60 * 1000); // Executar a cada minuto
