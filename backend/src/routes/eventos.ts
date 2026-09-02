import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";

const router = Router();

const eventoSchema = z.object({
  cliente: z.string().min(1),
  telefone: z.string().optional(),
  tipoEvento: z.string().min(1),
  data: z.coerce.date(),
  status: z.enum(["ORCAMENTO", "CONFIRMADO", "REALIZADO", "CANCELADO"]).optional(),
  valor: z.coerce.number().nonnegative().optional(),
  valorSinal: z.coerce.number().nonnegative().optional(),
  sinalPago: z.boolean().optional(),
  restantePago: z.boolean().optional(),
  observacoes: z.string().optional(),
});

function comDatasPagamento<T extends { sinalPago?: boolean; restantePago?: boolean }>(data: T) {
  const extra: { sinalPagoEm?: Date | null; restantePagoEm?: Date | null } = {};
  if (data.sinalPago !== undefined) extra.sinalPagoEm = data.sinalPago ? new Date() : null;
  if (data.restantePago !== undefined) extra.restantePagoEm = data.restantePago ? new Date() : null;
  return { ...data, ...extra };
}

router.get("/", async (_req, res) => {
  const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } });
  res.json(eventos);
});

router.get("/:id", async (req, res) => {
  const evento = await prisma.evento.findUnique({ where: { id: req.params.id } });
  if (!evento) return res.status(404).json({ error: "Evento não encontrado" });
  res.json(evento);
});

router.post("/", async (req, res) => {
  const parsed = eventoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const evento = await prisma.evento.create({ data: comDatasPagamento(parsed.data) });
  res.status(201).json(evento);
});

router.put("/:id", async (req, res) => {
  const parsed = eventoSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const evento = await prisma.evento.update({
    where: { id: req.params.id },
    data: comDatasPagamento(parsed.data),
  });
  res.json(evento);
});

router.delete("/:id", async (req, res) => {
  await prisma.evento.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
