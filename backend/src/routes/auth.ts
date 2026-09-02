import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../prisma";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const usuario = await prisma.usuario.findUnique({ where: { email: parsed.data.email } });
  if (!usuario) return res.status(401).json({ error: "Email ou senha inválidos" });

  const senhaCorreta = await bcrypt.compare(parsed.data.senha, usuario.senhaHash);
  if (!senhaCorreta) return res.status(401).json({ error: "Email ou senha inválidos" });

  const token = jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
  res.json({ token, nome: usuario.nome });
});

export default router;
