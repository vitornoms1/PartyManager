import { useMemo, useState } from "react";
import { Evento, StatusEvento } from "../api";
import { STATUS_COLORS } from "./EventoList";
import { CARD_CLASS } from "../utils";

const DOT_COLORS: Record<StatusEvento, string> = {
  ORCAMENTO: "bg-yellow-400",
  CONFIRMADO: "bg-blue-400",
  REALIZADO: "bg-green-500",
  CANCELADO: "bg-red-400",
};

const NOMES_MES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  eventos: Evento[];
}

export function CalendarView({ eventos }: Props) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getUTCFullYear());
  const [mes, setMes] = useState(hoje.getUTCMonth());
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  const eventosPorDia = useMemo(() => {
    const mapa = new Map<string, Evento[]>();
    for (const ev of eventos) {
      const chave = ev.data.slice(0, 10);
      const atual = mapa.get(chave) ?? [];
      atual.push(ev);
      mapa.set(chave, atual);
    }
    return mapa;
  }, [eventos]);

  const primeiroDiaSemana = new Date(Date.UTC(ano, mes, 1)).getUTCDay();
  const totalDias = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();

  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  function irParaMesAnterior() {
    setDiaSelecionado(null);
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  }

  function irParaProximoMes() {
    setDiaSelecionado(null);
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  }

  function chaveDia(dia: number) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  }

  const eventosDoDiaSelecionado = diaSelecionado ? eventosPorDia.get(diaSelecionado) ?? [] : [];

  return (
    <div className="space-y-4">
      <div className={CARD_CLASS}>
        <div className="flex justify-between items-center mb-3">
          <button onClick={irParaMesAnterior} className="px-3 py-1 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            ‹
          </button>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {NOMES_MES[mes]}/{ano}
          </h3>
          <button onClick={irParaProximoMes} className="px-3 py-1 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="text-xs text-gray-400 dark:text-gray-500 font-medium py-1">
              {d}
            </div>
          ))}

          {celulas.map((dia, idx) => {
            if (dia === null) return <div key={`vazio-${idx}`} />;
            const chave = chaveDia(dia);
            const eventosDia = eventosPorDia.get(chave) ?? [];
            const selecionado = diaSelecionado === chave;

            return (
              <button
                key={chave}
                onClick={() => setDiaSelecionado(selecionado ? null : chave)}
                className={`aspect-square rounded flex flex-col items-center justify-center text-sm relative ${
                  selecionado ? "ring-2 ring-rose-500" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-gray-700 dark:text-gray-300">{dia}</span>
                {eventosDia.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {eventosDia.slice(0, 3).map((ev) => (
                      <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[ev.status]}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {diaSelecionado && (
        <div className={CARD_CLASS}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Festas em {diaSelecionado.split("-").reverse().join("/")}
          </h3>
          {eventosDoDiaSelecionado.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma festa nesse dia.</p>
          ) : (
            <div className="space-y-2">
              {eventosDoDiaSelecionado.map((ev) => (
                <div key={ev.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{ev.cliente}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ev.tipoEvento}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[ev.status]}`}>
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
