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
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

interface Props {
  eventos: Evento[];
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: {
    text: string;
    bg: string;
    dot: string;
  };
  children: React.ReactNode;
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-[12px]
        font-semibold
        ${tone.bg}
        ${tone.text}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
      />

      {children}
    </span>
  );
}

export function CalendarView({ eventos }: Props) {
  const hoje = new Date();

  const [ano, setAno] = useState(
    hoje.getUTCFullYear()
  );

  const [mes, setMes] = useState(
    hoje.getUTCMonth()
  );

  const [diaSelecionado, setDiaSelecionado] =
    useState<string | null>(null);

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

  const primeiroDiaSemana = new Date(
    Date.UTC(ano, mes, 1)
  ).getUTCDay();

  const totalDias = new Date(
    Date.UTC(ano, mes + 1, 0)
  ).getUTCDate();

  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from(
      { length: totalDias },
      (_, i) => i + 1
    ),
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
    return `${ano}-${String(mes + 1).padStart(
      2,
      "0"
    )}-${String(dia).padStart(2, "0")}`;
  }

  const eventosDoDiaSelecionado = diaSelecionado
    ? eventosPorDia.get(diaSelecionado) ?? []
    : [];

  return (
    <div className="space-y-3">
      {/* CALENDÁRIO */}
      <div className={CARD_CLASS}>
        {/* CABEÇALHO */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={irParaMesAnterior}
            aria-label="Mês anterior"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-gray-500
              transition-colors
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-gray-700
            "
          >
            <ChevronLeftIcon />
          </button>

          <h3 className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
            {NOMES_MES[mes]}{" "}
            <span className="font-medium text-gray-400 dark:text-gray-500">
              {ano}
            </span>
          </h3>

          <button
            type="button"
            onClick={irParaProximoMes}
            aria-label="Próximo mês"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-gray-500
              transition-colors
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-gray-700
            "
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* DIAS DA SEMANA */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {DIAS_SEMANA.map((dia) => (
            <div
              key={dia}
              className="
                py-1.5
                text-[11px]
                font-semibold
                uppercase
                tracking-wide
                text-gray-400
                dark:text-gray-500
              "
            >
              {dia}
            </div>
          ))}

          {/* DIAS */}
          {celulas.map((dia, idx) => {
            if (dia === null) {
              return (
                <div
                  key={`vazio-${idx}`}
                  className="aspect-square"
                />
              );
            }

            const chave = chaveDia(dia);
            const eventosDia =
              eventosPorDia.get(chave) ?? [];

            const selecionado =
              diaSelecionado === chave;

            return (
              <button
                type="button"
                key={chave}
                onClick={() =>
                  setDiaSelecionado(
                    selecionado ? null : chave
                  )
                }
                className={`
                  relative
                  flex
                  aspect-square
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  text-sm
                  transition-colors
                  ${
                    selecionado
                      ? "bg-rose-50 text-rose-600 ring-1 ring-rose-500 dark:bg-rose-900/20 dark:text-rose-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
                  }
                `}
              >
                <span
                  className={
                    selecionado
                      ? "font-bold"
                      : "font-medium"
                  }
                >
                  {dia}
                </span>

                {eventosDia.length > 0 && (
                  <div className="mt-1 flex gap-0.5">
                    {eventosDia
                      .slice(0, 3)
                      .map((ev) => (
                        <span
                          key={ev.id}
                          className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${DOT_COLORS[ev.status]}
                          `}
                        />
                      ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* LEGENDA */}
        <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-yellow-400" />
              Orçamento
            </span>

            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
              Confirmado
            </span>

            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              Realizado
            </span>

            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
              Cancelado
            </span>
          </div>
        </div>
      </div>

      {/* EVENTOS DO DIA */}
      {diaSelecionado && (
        <div className={CARD_CLASS}>
          <div className="mb-3">
            <h3 className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Festas em{" "}
              {diaSelecionado
                .split("-")
                .reverse()
                .join("/")}
            </h3>

            <p className="mt-0.5 text-[12px] text-gray-400 dark:text-gray-500">
              {eventosDoDiaSelecionado.length === 1
                ? "1 festa agendada"
                : `${eventosDoDiaSelecionado.length} festas agendadas`}
            </p>
          </div>

          {eventosDoDiaSelecionado.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
              Nenhuma festa nesse dia.
            </p>
          ) : (
            <div>
              {eventosDoDiaSelecionado.map((ev) => (
                <div
                  key={ev.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-gray-100
                    py-3
                    last:border-0
                    dark:border-gray-700
                  "
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
                      {ev.cliente}
                    </p>

                    <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                      {ev.tipoEvento}
                    </p>
                  </div>

                  <Pill
                    tone={STATUS_COLORS[ev.status]}
                  >
                    {ev.status}
                  </Pill>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}