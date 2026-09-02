import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Não autenticado" });

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json({ error: "Sessão inválida ou expirada" });
  }
}
