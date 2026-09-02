import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";

const router = Router();

const gastoSchema = z
  .object({
    descricao: z.string().min(1),
    categoria: z.string().min(1),
    tipo: z.enum(["FIXO", "EVENTO"]),
    valor: z.coerce.number().nonnegative(),
    data: z.coerce.date(),
    eventoId: z.string().optional().nullable(),
  })
  .refine((data) => data.tipo === "EVENTO" ? !!data.eventoId : true, {
    message: "Selecione a festa para um gasto vinculado a evento",
    path: ["eventoId"],
  })
  .transform((data) => ({
    ...data,
    eventoId: data.tipo === "FIXO" ? null : data.eventoId,
  }));

router.get("/", async (_req, res) => {
  const gastos = await prisma.gasto.findMany({
    orderBy: { data: "desc" },
    include: { evento: { select: { cliente: true, tipoEvento: true } } },
  });
  res.json(gastos);
});

router.get("/:id", async (req, res) => {
  const gasto = await prisma.gasto.findUnique({ where: { id: req.params.id } });
  if (!gasto) return res.status(404).json({ error: "Gasto não encontrado" });
  res.json(gasto);
});

router.post("/", async (req, res) => {
  const parsed = gastoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const gasto = await prisma.gasto.create({ data: parsed.data });
  res.status(201).json(gasto);
});

router.put("/:id", async (req, res) => {
  const parsed = gastoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const gasto = await prisma.gasto.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(gasto);
});

router.delete("/:id", async (req, res) => {
  await prisma.gasto.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
