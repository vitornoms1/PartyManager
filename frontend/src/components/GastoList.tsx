import { Gasto } from "../api";
import { CARD_CLASS } from "../utils";

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  );
}

interface Props {
  gastos: Gasto[];
  onDelete: (id: string) => void;
}

export function GastoList({ gastos, onDelete }: Props) {
  if (gastos.length === 0) {
    return (
      <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-10">
        Nenhum gasto cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {gastos.map((gasto) => (
        <div
          key={gasto.id}
          className={`${CARD_CLASS} hover:border-gray-200 dark:hover:border-gray-600 transition-colors`}
        >
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                {gasto.descricao}
              </h3>

              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
                {gasto.categoria}
              </p>

              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                {new Date(gasto.data).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </p>
            </div>

            <span
              className={`
                inline-flex items-center
                text-[12px]
                font-semibold
                px-2.5 py-1
                rounded-full
                whitespace-nowrap
                ${
                  gasto.tipo === "FIXO"
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200"
                    : "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                }
              `}
            >
              {gasto.tipo === "FIXO"
                ? "Fixo do salão"
                : "De uma festa"}
            </span>
          </div>

          {gasto.evento && (
            <p className="text-[13px] text-purple-600 dark:text-purple-400 mt-2">
              Festa: {gasto.evento.cliente} — {gasto.evento.tipoEvento}
            </p>
          )}

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-[15px] font-bold text-red-600 dark:text-red-400 tabular-nums">
              - R${" "}
              {gasto.valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>

            <button
              type="button"
              onClick={() => onDelete(gasto.id)}
              aria-label={`Excluir gasto ${gasto.descricao}`}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-full
                text-red-600
                dark:text-red-400
                hover:bg-red-50
                dark:hover:bg-red-900/30
                transition-colors
              "
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}