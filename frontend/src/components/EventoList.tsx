import { Evento, StatusEvento } from "../api";
import { CARD_CLASS } from "../utils";

export const STATUS_COLORS: Record<StatusEvento, { text: string; bg: string; dot: string }> = {
  ORCAMENTO: {
    text: "text-yellow-700 dark:text-yellow-300",
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    dot: "bg-yellow-500",
  },
  CONFIRMADO: {
    text: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    dot: "bg-blue-500",
  },
  REALIZADO: {
    text: "text-green-700 dark:text-green-300",
    bg: "bg-green-50 dark:bg-green-900/30",
    dot: "bg-green-500",
  },
  CANCELADO: {
    text: "text-red-700 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-900/30",
    dot: "bg-red-500",
  },
};

const PAGO = {
  text: "text-green-700 dark:text-green-300",
  bg: "bg-green-50 dark:bg-green-900/30",
  dot: "bg-green-500",
};
const PENDENTE = {
  text: "text-orange-700 dark:text-orange-300",
  bg: "bg-orange-50 dark:bg-orange-900/30",
  dot: "bg-orange-500",
};

function Pill({ tone, children }: { tone: { text: string; bg: string; dot: string }; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${tone.bg} ${tone.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {children}
    </span>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    </svg>
  );
}

interface Props {
  eventos: Evento[];
  onEdit: (evento: Evento) => void;
  onDelete: (id: string) => void;
}

export function EventoList({ eventos, onEdit, onDelete }: Props) {
  if (eventos.length === 0) {
    return (
      <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-10">
        Nenhuma festa cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {eventos.map((evento) => {
        const valorRestante = evento.valor - evento.valorSinal;
        return (
          <div
            key={evento.id}
            className={`${CARD_CLASS} hover:border-gray-200 dark:hover:border-gray-600 transition-colors`}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                  {evento.cliente}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">{evento.tipoEvento}</p>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  {new Date(evento.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                </p>
              </div>
              <Pill tone={STATUS_COLORS[evento.status]}>{evento.status}</Pill>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {evento.valorSinal > 0 && (
                <Pill tone={evento.sinalPago ? PAGO : PENDENTE}>
                  Sinal {evento.sinalPago ? "pago" : "pendente"}: R${" "}
                  {evento.valorSinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </Pill>
              )}
              <Pill tone={evento.restantePago ? PAGO : PENDENTE}>
                Restante {evento.restantePago ? "pago" : "pendente"}: R${" "}
                {valorRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Pill>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                R$ {evento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(evento)}
                  aria-label="Editar festa"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => onDelete(evento.id)}
                  aria-label="Excluir festa"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}