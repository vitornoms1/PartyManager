import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";

const router = Router();

const planoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  preco: z.coerce.number().nonnegative(),
  itens: z.string().optional(),
  ativo: z.boolean().optional(),
});

router.get("/", async (_req, res) => {
  const planos = await prisma.plano.findMany({ orderBy: { criadoEm: "desc" } });
  res.json(planos);
});

router.get("/:id", async (req, res) => {
  const plano = await prisma.plano.findUnique({ where: { id: req.params.id } });
  if (!plano) return res.status(404).json({ error: "Plano não encontrado" });
  res.json(plano);
});

router.post("/", async (req, res) => {
  const parsed = planoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const plano = await prisma.plano.create({ data: parsed.data });
  res.status(201).json(plano);
});

router.put("/:id", async (req, res) => {
  const parsed = planoSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const plano = await prisma.plano.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(plano);
});

router.delete("/:id", async (req, res) => {
  await prisma.plano.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
