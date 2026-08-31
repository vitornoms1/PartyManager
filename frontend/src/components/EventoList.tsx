import { Evento, StatusEvento } from "../api";

const STATUS_COLORS: Record<StatusEvento, string> = {
  ORCAMENTO: "bg-yellow-100 text-yellow-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  REALIZADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

interface Props {
  eventos: Evento[];
  onDelete: (id: string) => void;
}

export function EventoList({ eventos, onDelete }: Props) {
  if (eventos.length === 0) {
    return <p className="text-gray-500 text-center py-8">Nenhuma festa cadastrada ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {eventos.map((evento) => (
        <div key={evento.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold text-gray-800">{evento.cliente}</h3>
              <p className="text-sm text-gray-500">{evento.tipoEvento}</p>
              <p className="text-sm text-gray-500">
                {new Date(evento.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[evento.status]}`}>
              {evento.status}
            </span>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="font-semibold text-gray-700">
              R$ {evento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            <button
              onClick={() => onDelete(evento.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
