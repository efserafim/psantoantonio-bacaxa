import type { Request, Response, NextFunction } from "express";
// @ts-ignore
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  adminId?: string;
  adminEmail?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "24h";

export function generateToken(adminId: string, adminEmail: string): string {
  // @ts-ignore
  return jwt.sign(
    { adminId, adminEmail },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function verifyToken(token: string): { adminId: string; adminEmail: string } | null {
  try {
    // @ts-ignore
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string; adminEmail: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }

  req.adminId = decoded.adminId;
  req.adminEmail = decoded.adminEmail;
  next();
};

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.adminId = decoded.adminId;
      req.adminEmail = decoded.adminEmail;
    }
  }

  next();
};
