import { useEffect, useState } from "react";

import {
  api,
  Evento,
  EventoInput,
  Plano,
  PlanoInput,
  Gasto,
  GastoInput,
  Dashboard,
} from "./api";

import { EventoForm } from "./components/EventoForm";
import { EventoList } from "./components/EventoList";
import { PlanoForm } from "./components/PlanoForm";
import { PlanoList } from "./components/PlanoList";
import { GastoForm } from "./components/GastoForm";
import { GastoList } from "./components/GastoList";
import { DashboardView } from "./components/DashboardView";
import { MonthFilter } from "./components/MonthFilter";
import { LoginForm } from "./components/LoginForm";
import { CalendarView } from "./components/CalendarView";

import { chaveMes } from "./utils";
import { getToken, limparSessao } from "./auth";
import { aplicarTema, getTemaSalvo } from "./theme";

type Aba =
  | "eventos"
  | "agenda"
  | "planos"
  | "gastos"
  | "dashboard";

const ABAS: {
  id: Aba;
  label: string;
}[] = [
  { id: "eventos", label: "Festas" },
  { id: "agenda", label: "Agenda" },
  { id: "planos", label: "Planos" },
  { id: "gastos", label: "Gastos" },
  { id: "dashboard", label: "Lucro" },
];

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 14.2A8.5 8.5 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3c2 2.5 3 4.6 3 6.3a3 3 0 1 1-6 0C9 7.6 10 5.5 12 3Z" />
      <path d="M6.5 13.5a5.5 5.5 0 0 0 11 0" />
      <path d="M12 19v2" />
    </svg>
  );
}

function App() {
  const [autenticado, setAutenticado] = useState(
    () => !!getToken()
  );

  const [aba, setAba] = useState<Aba>("eventos");

  const [tema, setTema] = useState(
    getTemaSalvo()
  );

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);

  const [dashboard, setDashboard] =
    useState<Dashboard | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [eventoEmEdicao, setEventoEmEdicao] =
    useState<Evento | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [filtroMesEventos, setFiltroMesEventos] =
    useState("");

  const [filtroMesGastos, setFiltroMesGastos] =
    useState("");

  function alternarTema() {
    const novoTema =
      tema === "dark" ? "light" : "dark";

    aplicarTema(novoTema);
    setTema(novoTema);
  }

  async function loadEventos() {
    const { data } =
      await api.get<Evento[]>("/eventos");

    setEventos(data);
  }

  async function loadAba(target: Aba) {
    setLoading(true);
    setError(null);

    try {
      if (
        target === "eventos" ||
        target === "agenda"
      ) {
        await loadEventos();
      } else if (target === "planos") {
        const { data } =
          await api.get<Plano[]>("/planos");

        setPlanos(data);
      } else if (target === "gastos") {
        await loadEventos();

        const { data } =
          await api.get<Gasto[]>("/gastos");

        setGastos(data);
      } else if (target === "dashboard") {
        const { data } =
          await api.get<Dashboard>("/dashboard");

        setDashboard(data);
      }
    } catch {
      setError(
        "Não foi possível conectar ao servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!autenticado) return;

    setShowForm(false);
    setEventoEmEdicao(null);

    loadAba(aba);
  }, [aba, autenticado]);

  function handleLogout() {
    limparSessao();
    setAutenticado(false);
  }

  async function handleSubmitEvento(
    evento: EventoInput
  ) {
    if (eventoEmEdicao) {
      await api.put(
        `/eventos/${eventoEmEdicao.id}`,
        evento
      );
    } else {
      await api.post("/eventos", evento);
    }

    setShowForm(false);
    setEventoEmEdicao(null);

    await loadAba("eventos");
  }

  function handleEditEvento(evento: Evento) {
    setEventoEmEdicao(evento);
    setShowForm(true);
  }

  async function handleDeleteEvento(
    id: string
  ) {
    await api.delete(`/eventos/${id}`);
    await loadAba("eventos");
  }

  async function handleCreatePlano(
    plano: PlanoInput
  ) {
    await api.post("/planos", plano);

    setShowForm(false);

    await loadAba("planos");
  }

  async function handleDeletePlano(
    id: string
  ) {
    await api.delete(`/planos/${id}`);
    await loadAba("planos");
  }

  async function handleCreateGasto(
    gasto: GastoInput
  ) {
    await api.post("/gastos", gasto);

    setShowForm(false);

    await loadAba("gastos");
  }

  async function handleDeleteGasto(
    id: string
  ) {
    await api.delete(`/gastos/${id}`);
    await loadAba("gastos");
  }

  function handleNovoClick() {
    setEventoEmEdicao(null);
    setShowForm(true);
  }

  function handleTrocarAba(novaAba: Aba) {
    setAba(novaAba);
    setShowForm(false);
    setEventoEmEdicao(null);
  }

  const mesesEventos = Array.from(
    new Set(
      eventos.map((e) => chaveMes(e.data))
    )
  )
    .sort()
    .reverse();

  const eventosFiltrados = filtroMesEventos
    ? eventos.filter(
        (e) =>
          chaveMes(e.data) ===
          filtroMesEventos
      )
    : eventos;

  const mesesGastos = Array.from(
    new Set(
      gastos.map((g) => chaveMes(g.data))
    )
  )
    .sort()
    .reverse();

  const gastosFiltrados = filtroMesGastos
    ? gastos.filter(
        (g) =>
          chaveMes(g.data) ===
          filtroMesGastos
      )
    : gastos;

  const abaAtual =
    ABAS.find((a) => a.id === aba);

  if (!autenticado) {
    return (
      <LoginForm
        onLogin={() => setAutenticado(true)}
      />
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        text-gray-900
        dark:bg-gray-950
        dark:text-gray-100
      "
      style={{
        fontFamily:
          "'Archivo', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        className="
          sticky
          top-0
          z-20
          bg-gradient-to-r
          from-rose-600
          to-rose-500
          px-5
          pb-4
          pt-5
          text-white
          shadow-md
          shadow-rose-900/10
        "
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-white/15
                backdrop-blur-sm
              "
            >
              <LogoMark />
            </div>

            <div>
              <h1 className="text-[17px] font-bold leading-tight tracking-tight">
                Alecrim
              </h1>

              <p className="text-[11.5px] leading-tight text-rose-100/90">
                Casa de Festas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={alternarTema}
              aria-label="Alternar tema"
              title={
                tema === "dark"
                  ? "Mudar para modo claro"
                  : "Mudar para modo escuro"
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/15
                transition-colors
                hover:bg-white/25
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/70
              "
            >
              {tema === "dark" ? (
                <SunIcon />
              ) : (
                <MoonIcon />
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="
                h-9
                rounded-full
                px-3
                text-[13px]
                font-medium
                text-white/85
                transition-colors
                hover:bg-white/10
                hover:text-white
              "
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* NAVEGAÇÃO */}
      <nav
        className="
          sticky
          top-[68px]
          z-10
          border-b
          border-gray-200/70
          bg-gray-50/90
          px-4
          py-2.5
          backdrop-blur-sm
          dark:border-gray-800
          dark:bg-gray-950/90
        "
      >
        <div
          className="
            mx-auto
            flex
            w-fit
            max-w-full
            gap-1
            overflow-x-auto
            rounded-full
            bg-gray-200/60
            p-1
            dark:bg-gray-900
          "
        >
          {ABAS.map((a) => (
            <button
              type="button"
              key={a.id}
              onClick={() =>
                handleTrocarAba(a.id)
              }
              className={`
                whitespace-nowrap
                rounded-full
                px-4
                py-1.5
                text-[13.5px]
                font-semibold
                transition-all
                duration-200
                ${
                  aba === a.id
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }
              `}
            >
              {a.label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTEÚDO */}
      <main
        className="
          mx-auto
          max-w-2xl
          space-y-4
          p-4
        "
      >
        {/* CABEÇALHO DA ABA */}
        {!showForm && (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 px-4">
              <h2 className="text-[18px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
                {abaAtual?.label}
              </h2>
            </div>

            {aba !== "dashboard" &&
              aba !== "agenda" && (
                <button
                  type="button"
                  onClick={handleNovoClick}
                  className="
                    rounded-xl
                    bg-rose-600
                    px-4
                    py-2
                    text-[13px]
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-rose-700
                    active:scale-[0.97]
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-rose-300
                    focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-gray-950
                    mr-4
                  "
                >
                  {aba === "eventos" &&
                    "Nova festa"}

                  {aba === "planos" &&
                    "Novo plano"}

                  {aba === "gastos" &&
                    "Novo gasto"}
                </button>
              )}
          </div>
        )}

        {/* FORM EVENTO */}
        {aba === "eventos" &&
          showForm && (
            <EventoForm
              eventoInicial={
                eventoEmEdicao ?? undefined
              }
              onSubmit={
                handleSubmitEvento
              }
              onCancel={() => {
                setShowForm(false);
                setEventoEmEdicao(null);
              }}
            />
          )}

        {/* FORM PLANO */}
        {aba === "planos" &&
          showForm && (
            <PlanoForm
              onSubmit={handleCreatePlano}
              onCancel={() =>
                setShowForm(false)
              }
            />
          )}

        {/* FORM GASTO */}
        {aba === "gastos" &&
          showForm && (
            <GastoForm
              eventos={eventos}
              onSubmit={handleCreateGasto}
              onCancel={() =>
                setShowForm(false)
              }
            />
          )}

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center gap-2 py-10">
            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-rose-200
                border-t-rose-600
              "
            />

            <p className="text-sm text-gray-400 dark:text-gray-500">
              Carregando…
            </p>
          </div>
        )}

        {/* ERRO */}
        {error && (
          <p className="py-6 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* FESTAS */}
        {!loading &&
          !error &&
          aba === "eventos" &&
          !showForm &&
          mesesEventos.length > 0 && (
            <div className="flex justify-end">
              <MonthFilter
                meses={mesesEventos}
                value={filtroMesEventos}
                onChange={
                  setFiltroMesEventos
                }
              />
            </div>
          )}

        {!loading &&
          !error &&
          aba === "eventos" && (
            <EventoList
              eventos={eventosFiltrados}
              onEdit={handleEditEvento}
              onDelete={
                handleDeleteEvento
              }
            />
          )}

        {/* AGENDA */}
        {!loading &&
          !error &&
          aba === "agenda" && (
            <CalendarView
              eventos={eventos}
            />
          )}

        {/* PLANOS */}
        {!loading &&
          !error &&
          aba === "planos" && (
            <PlanoList
              planos={planos}
              onDelete={
                handleDeletePlano
              }
            />
          )}

        {/* GASTOS */}
        {!loading &&
          !error &&
          aba === "gastos" &&
          !showForm &&
          mesesGastos.length > 0 && (
            <div className="flex justify-end">
              <MonthFilter
                meses={mesesGastos}
                value={filtroMesGastos}
                onChange={
                  setFiltroMesGastos
                }
              />
            </div>
          )}

        {!loading &&
          !error &&
          aba === "gastos" && (
            <GastoList
              gastos={gastosFiltrados}
              onDelete={
                handleDeleteGasto
              }
            />
          )}

        {/* DASHBOARD */}
        {!loading &&
          !error &&
          aba === "dashboard" &&
          dashboard && (
            <DashboardView
              dashboard={dashboard}
            />
          )}
      </main>
    </div>
  );
}

export default App;