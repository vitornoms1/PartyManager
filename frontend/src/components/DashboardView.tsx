import { useMemo, useState } from "react";
import { Dashboard } from "../api";
import { chaveMes, formatMesLabel, CARD_CLASS } from "../utils";
import { MonthFilter } from "./MonthFilter";

function formatMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

interface Props {
  dashboard: Dashboard;
}

export function DashboardView({ dashboard }: Props) {
  const [filtroMes, setFiltroMes] = useState("");

  const mesesDisponiveis = dashboard.meses.map((m) => m.mes);

  const totais = useMemo(() => {
    if (!filtroMes) {
      return { receita: dashboard.receitaTotal, gasto: dashboard.gastoTotal, lucro: dashboard.lucroTotal };
    }
    const mes = dashboard.meses.find((m) => m.mes === filtroMes);
    return mes
      ? { receita: mes.receita, gasto: mes.gasto, lucro: mes.lucro }
      : { receita: 0, gasto: 0, lucro: 0 };
  }, [filtroMes, dashboard]);

  const porFestaFiltrado = filtroMes
    ? dashboard.porFesta.filter((f) => chaveMes(f.data) === filtroMes)
    : dashboard.porFesta;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <MonthFilter meses={mesesDisponiveis} value={filtroMes} onChange={setFiltroMes} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={CARD_CLASS}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filtroMes ? `Receita — ${formatMesLabel(filtroMes)}` : "Receita total"}
          </p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">R$ {formatMoeda(totais.receita)}</p>
        </div>
        <div className={CARD_CLASS}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filtroMes ? `Gastos — ${formatMesLabel(filtroMes)}` : "Gastos totais"}
          </p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">R$ {formatMoeda(totais.gasto)}</p>
        </div>
        <div className={CARD_CLASS}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filtroMes ? `Lucro — ${formatMesLabel(filtroMes)}` : "Lucro total"}
          </p>
          <p className={`text-xl font-bold ${totais.lucro >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            R$ {formatMoeda(totais.lucro)}
          </p>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Pendências de pagamento</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          Festas confirmadas ou realizadas com sinal ou restante ainda não recebido
        </p>
        {dashboard.pendencias.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhuma pendência de pagamento. 🎉</p>
        ) : (
          <div className="space-y-2">
            {dashboard.pendencias.map((p) => (
              <div key={p.eventoId} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{p.cliente}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {p.tipoEvento} — {new Date(p.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {!p.sinalPago ? "Sinal pendente" : "Restante pendente"}
                  </p>
                </div>
                <span className="font-semibold text-orange-600 dark:text-orange-400">R$ {formatMoeda(p.valorPendente)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!filtroMes && (
        <div className={CARD_CLASS}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Lucro por mês</h3>
          {dashboard.meses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Sem dados ainda. Cadastre eventos realizados e gastos para ver o lucro por mês.
            </p>
          ) : (
            <div className="space-y-2">
              {dashboard.meses.map((m) => (
                <div key={m.mes} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{formatMesLabel(m.mes)}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600 dark:text-green-400">+{formatMoeda(m.receita)}</span>
                    <span className="text-red-600 dark:text-red-400">-{formatMoeda(m.gasto)}</span>
                    <span className={`font-semibold ${m.lucro >= 0 ? "text-gray-800 dark:text-gray-100" : "text-red-700 dark:text-red-400"}`}>
                      = R$ {formatMoeda(m.lucro)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={CARD_CLASS}>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Lucro por festa</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          Receita da festa menos os gastos vinculados a ela (não inclui gastos fixos do salão)
        </p>
        {porFestaFiltrado.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {filtroMes
              ? "Nenhuma festa realizada nesse mês."
              : 'Nenhuma festa realizada ainda. Marque uma festa como "REALIZADO" para vê-la aqui.'}
          </p>
        ) : (
          <div className="space-y-2">
            {porFestaFiltrado.map((f) => (
              <div key={f.eventoId} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{f.cliente}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {f.tipoEvento} — {new Date(f.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">+{formatMoeda(f.receita)}</span>
                  <span className="text-red-600 dark:text-red-400">-{formatMoeda(f.gastos)}</span>
                  <span className={`font-semibold ${f.lucro >= 0 ? "text-gray-800 dark:text-gray-100" : "text-red-700 dark:text-red-400"}`}>
                    = R$ {formatMoeda(f.lucro)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
