import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const eventosRealizados = await prisma.evento.findMany({
    where: { status: "REALIZADO" },
    select: {
      id: true,
      cliente: true,
      tipoEvento: true,
      valor: true,
      data: true,
      gastos: { select: { valor: true } },
    },
  });
  const gastos = await prisma.gasto.findMany({ select: { valor: true, data: true } });

  const receitaTotal = eventosRealizados.reduce((sum, e) => sum + e.valor, 0);
  const gastoTotal = gastos.reduce((sum, g) => sum + g.valor, 0);
  const lucroTotal = receitaTotal - gastoTotal;

  const porFesta = eventosRealizados
    .map((e) => {
      const gastosEvento = e.gastos.reduce((sum, g) => sum + g.valor, 0);
      return {
        eventoId: e.id,
        cliente: e.cliente,
        tipoEvento: e.tipoEvento,
        data: e.data,
        receita: e.valor,
        gastos: gastosEvento,
        lucro: e.valor - gastosEvento,
      };
    })
    .sort((a, b) => a.data.getTime() - b.data.getTime());

  const porMes = new Map<string, { receita: number; gasto: number }>();

  function chave(data: Date) {
    return `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, "0")}`;
  }

  for (const e of eventosRealizados) {
    const k = chave(e.data);
    const atual = porMes.get(k) ?? { receita: 0, gasto: 0 };
    atual.receita += e.valor;
    porMes.set(k, atual);
  }

  for (const g of gastos) {
    const k = chave(g.data);
    const atual = porMes.get(k) ?? { receita: 0, gasto: 0 };
    atual.gasto += g.valor;
    porMes.set(k, atual);
  }

  const meses = Array.from(porMes.entries())
    .map(([mes, v]) => ({ mes, receita: v.receita, gasto: v.gasto, lucro: v.receita - v.gasto }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  const eventosComPendencia = await prisma.evento.findMany({
    where: {
      status: { in: ["CONFIRMADO", "REALIZADO"] },
      OR: [{ sinalPago: false }, { restantePago: false }],
    },
    select: {
      id: true,
      cliente: true,
      tipoEvento: true,
      data: true,
      valor: true,
      valorSinal: true,
      sinalPago: true,
      restantePago: true,
    },
    orderBy: { data: "asc" },
  });

  const pendencias = eventosComPendencia.map((e) => ({
    eventoId: e.id,
    cliente: e.cliente,
    tipoEvento: e.tipoEvento,
    data: e.data,
    sinalPago: e.sinalPago,
    restantePago: e.restantePago,
    valorPendente: !e.sinalPago ? e.valor : e.valor - e.valorSinal,
  }));

  res.json({ receitaTotal, gastoTotal, lucroTotal, meses, porFesta, pendencias });
});

export default router;
