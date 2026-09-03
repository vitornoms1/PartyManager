import { useMemo, useState } from "react";

import { Dashboard } from "../api";
import {
  chaveMes,
  formatMesLabel,
  CARD_CLASS,
} from "../utils";

import { MonthFilter } from "./MonthFilter";

function formatMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
}

interface Props {
  dashboard: Dashboard;
}

export function DashboardView({
  dashboard,
}: Props) {
  const [filtroMes, setFiltroMes] = useState("");

  const mesesDisponiveis = dashboard.meses.map(
    (m) => m.mes
  );

  const totais = useMemo(() => {
    if (!filtroMes) {
      return {
        receita: dashboard.receitaTotal,
        gasto: dashboard.gastoTotal,
        lucro: dashboard.lucroTotal,
      };
    }

    const mes = dashboard.meses.find(
      (m) => m.mes === filtroMes
    );

    return mes
      ? {
          receita: mes.receita,
          gasto: mes.gasto,
          lucro: mes.lucro,
        }
      : {
          receita: 0,
          gasto: 0,
          lucro: 0,
        };
  }, [filtroMes, dashboard]);

  const porFestaFiltrado = filtroMes
    ? dashboard.porFesta.filter(
        (f) => chaveMes(f.data) === filtroMes
      )
    : dashboard.porFesta;

  return (
    <div className="space-y-3">
      {/* FILTRO */}
      <div className="flex justify-end">
        <MonthFilter
          meses={mesesDisponiveis}
          value={filtroMes}
          onChange={setFiltroMes}
        />
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={CARD_CLASS}>
          <p className="text-[12px] font-medium text-gray-400 dark:text-gray-500">
            {filtroMes
              ? `Receita — ${formatMesLabel(filtroMes)}`
              : "Receita total"}
          </p>

          <p className="mt-1 text-[19px] font-bold tracking-tight tabular-nums text-green-600 dark:text-green-400">
            R$ {formatMoeda(totais.receita)}
          </p>
        </div>

        <div className={CARD_CLASS}>
          <p className="text-[12px] font-medium text-gray-400 dark:text-gray-500">
            {filtroMes
              ? `Gastos — ${formatMesLabel(filtroMes)}`
              : "Gastos totais"}
          </p>

          <p className="mt-1 text-[19px] font-bold tracking-tight tabular-nums text-red-600 dark:text-red-400">
            R$ {formatMoeda(totais.gasto)}
          </p>
        </div>

        <div className={CARD_CLASS}>
          <p className="text-[12px] font-medium text-gray-400 dark:text-gray-500">
            {filtroMes
              ? `Lucro — ${formatMesLabel(filtroMes)}`
              : "Lucro total"}
          </p>

          <p
            className={`
              mt-1
              text-[19px]
              font-bold
              tracking-tight
              tabular-nums
              ${
                totais.lucro >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            `}
          >
            R$ {formatMoeda(totais.lucro)}
          </p>
        </div>
      </div>

      {/* PENDÊNCIAS */}
      <div className={CARD_CLASS}>
        <div className="mb-3">
          <h3 className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Pendências de pagamento
          </h3>

          <p className="mt-0.5 text-[12px] leading-5 text-gray-400 dark:text-gray-500">
            Festas confirmadas ou realizadas com
            sinal ou restante ainda não recebido.
          </p>
        </div>

        {dashboard.pendencias.length === 0 ? (
          <p className="py-5 text-center text-sm text-gray-400 dark:text-gray-500">
            Nenhuma pendência de pagamento.
          </p>
        ) : (
          <div>
            {dashboard.pendencias.map((p) => (
              <div
                key={p.eventoId}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-gray-100
                  py-3
                  last:border-0
                  dark:border-gray-700
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
                    {p.cliente}
                  </p>

                  <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                    {p.tipoEvento} —{" "}
                    {new Date(p.data).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-orange-600 dark:text-orange-400">
                    {!p.sinalPago
                      ? "Sinal pendente"
                      : "Restante pendente"}
                  </p>
                </div>

                <span className="shrink-0 text-[14px] font-bold tabular-nums text-orange-600 dark:text-orange-400">
                  R$ {formatMoeda(p.valorPendente)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LUCRO POR MÊS */}
      {!filtroMes && (
        <div className={CARD_CLASS}>
          <div className="mb-3">
            <h3 className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Lucro por mês
            </h3>

            <p className="mt-0.5 text-[12px] text-gray-400 dark:text-gray-500">
              Receita, gastos e resultado de cada mês.
            </p>
          </div>

          {dashboard.meses.length === 0 ? (
            <p className="py-5 text-center text-sm text-gray-400 dark:text-gray-500">
              Sem dados ainda. Cadastre eventos realizados
              e gastos para ver o lucro por mês.
            </p>
          ) : (
            <div>
              {dashboard.meses.map((m) => (
                <div
                  key={m.mes}
                  className="
                    flex
                    flex-col
                    gap-2
                    border-b
                    border-gray-100
                    py-3
                    last:border-0
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    dark:border-gray-700
                  "
                >
                  <span className="text-[13px] font-semibold text-gray-600 dark:text-gray-300">
                    {formatMesLabel(m.mes)}
                  </span>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                    <span className="tabular-nums text-green-600 dark:text-green-400">
                      +{formatMoeda(m.receita)}
                    </span>

                    <span className="tabular-nums text-red-600 dark:text-red-400">
                      -{formatMoeda(m.gasto)}
                    </span>

                    <span
                      className={`
                        font-bold
                        tabular-nums
                        ${
                          m.lucro >= 0
                            ? "text-gray-800 dark:text-gray-100"
                            : "text-red-700 dark:text-red-400"
                        }
                      `}
                    >
                      = R$ {formatMoeda(m.lucro)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LUCRO POR FESTA */}
      <div className={CARD_CLASS}>
        <div className="mb-3">
          <h3 className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Lucro por festa
          </h3>

          <p className="mt-0.5 text-[12px] leading-5 text-gray-400 dark:text-gray-500">
            Receita da festa menos os gastos vinculados
            a ela.
          </p>
        </div>

        {porFestaFiltrado.length === 0 ? (
          <p className="py-5 text-center text-sm text-gray-400 dark:text-gray-500">
            {filtroMes
              ? "Nenhuma festa realizada nesse mês."
              : 'Nenhuma festa realizada ainda. Marque uma festa como "REALIZADO" para vê-la aqui.'}
          </p>
        ) : (
          <div>
            {porFestaFiltrado.map((f) => (
              <div
                key={f.eventoId}
                className="
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-gray-100
                  py-3
                  last:border-0
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  dark:border-gray-700
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
                    {f.cliente}
                  </p>

                  <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                    {f.tipoEvento} —{" "}
                    {new Date(f.data).toLocaleDateString(
                      "pt-BR",
                      { timeZone: "UTC" }
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                  <span className="tabular-nums text-green-600 dark:text-green-400">
                    +{formatMoeda(f.receita)}
                  </span>

                  <span className="tabular-nums text-red-600 dark:text-red-400">
                    -{formatMoeda(f.gastos)}
                  </span>

                  <span
                    className={`
                      font-bold
                      tabular-nums
                      ${
                        f.lucro >= 0
                          ? "text-gray-800 dark:text-gray-100"
                          : "text-red-700 dark:text-red-400"
                      }
                    `}
                  >
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