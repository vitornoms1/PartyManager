import { Gasto } from "../api";
import { CARD_CLASS } from "../utils";

interface Props {
  gastos: Gasto[];
  onDelete: (id: string) => void;
}

export function GastoList({ gastos, onDelete }: Props) {
  if (gastos.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum gasto cadastrado ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {gastos.map((gasto) => (
        <div key={gasto.id} className={CARD_CLASS}>
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{gasto.descricao}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{gasto.categoria}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(gasto.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                gasto.tipo === "FIXO"
                  ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
              }`}
            >
              {gasto.tipo === "FIXO" ? "Fixo do salão" : "De uma festa"}
            </span>
          </div>

          {gasto.evento && (
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              Festa: {gasto.evento.cliente} — {gasto.evento.tipoEvento}
            </p>
          )}

          <div className="flex justify-between items-center mt-3">
            <span className="font-semibold text-red-600 dark:text-red-400">
              - R$ {gasto.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <button
              onClick={() => onDelete(gasto.id)}
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
