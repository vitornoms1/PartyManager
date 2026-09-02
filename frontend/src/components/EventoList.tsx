import { Evento, StatusEvento } from "../api";
import { CARD_CLASS } from "../utils";

export const STATUS_COLORS: Record<StatusEvento, string> = {
  ORCAMENTO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  CONFIRMADO: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  REALIZADO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  CANCELADO: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const PAGO_CLASS = "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
const PENDENTE_CLASS = "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";

interface Props {
  eventos: Evento[];
  onEdit: (evento: Evento) => void;
  onDelete: (id: string) => void;
}

export function EventoList({ eventos, onEdit, onDelete }: Props) {
  if (eventos.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma festa cadastrada ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {eventos.map((evento) => {
        const valorRestante = evento.valor - evento.valorSinal;
        return (
          <div key={evento.id} className={CARD_CLASS}>
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{evento.cliente}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{evento.tipoEvento}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(evento.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[evento.status]}`}>
                {evento.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {evento.valorSinal > 0 && (
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    evento.sinalPago ? PAGO_CLASS : PENDENTE_CLASS
                  }`}
                >
                  Sinal {evento.sinalPago ? "pago" : "pendente"}: R${" "}
                  {evento.valorSinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              )}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  evento.restantePago ? PAGO_CLASS : PENDENTE_CLASS
                }`}
              >
                Restante {evento.restantePago ? "pago" : "pendente"}: R${" "}
                {valorRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                R$ {evento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(evento)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(evento.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
