import { useEffect, useState } from "react";
import { api, Evento, EventoInput, Plano, PlanoInput, Gasto, GastoInput, Dashboard } from "./api";
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
import { getToken, getNomeUsuario, limparSessao } from "./auth";
import { aplicarTema, getTemaSalvo } from "./theme";

type Aba = "eventos" | "agenda" | "planos" | "gastos" | "dashboard";

const ABAS: { id: Aba; label: string }[] = [
  { id: "eventos", label: "Festas" },
  { id: "agenda", label: "Agenda" },
  { id: "planos", label: "Planos" },
  { id: "gastos", label: "Gastos" },
  { id: "dashboard", label: "Lucro" },
];

function App() {
  const [autenticado, setAutenticado] = useState(() => !!getToken());
  const [aba, setAba] = useState<Aba>("eventos");
  const [tema, setTema] = useState(getTemaSalvo());

  function alternarTema() {
    const novoTema = tema === "dark" ? "light" : "dark";
    aplicarTema(novoTema);
    setTema(novoTema);
  }

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [eventoEmEdicao, setEventoEmEdicao] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroMesEventos, setFiltroMesEventos] = useState("");
  const [filtroMesGastos, setFiltroMesGastos] = useState("");

  async function loadEventos() {
    const { data } = await api.get<Evento[]>("/eventos");
    setEventos(data);
  }

  async function loadAba(target: Aba) {
    setLoading(true);
    setError(null);
    try {
      if (target === "eventos" || target === "agenda") {
        await loadEventos();
      } else if (target === "planos") {
        const { data } = await api.get<Plano[]>("/planos");
        setPlanos(data);
      } else if (target === "gastos") {
        await loadEventos();
        const { data } = await api.get<Gasto[]>("/gastos");
        setGastos(data);
      } else if (target === "dashboard") {
        const { data } = await api.get<Dashboard>("/dashboard");
        setDashboard(data);
      }
    } catch {
      setError("Não foi possível conectar ao servidor.");
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

  async function handleSubmitEvento(evento: EventoInput) {
    if (eventoEmEdicao) {
      await api.put(`/eventos/${eventoEmEdicao.id}`, evento);
    } else {
      await api.post("/eventos", evento);
    }
    setShowForm(false);
    setEventoEmEdicao(null);
    loadAba("eventos");
  }

  function handleEditEvento(evento: Evento) {
    setEventoEmEdicao(evento);
    setShowForm(true);
  }

  async function handleDeleteEvento(id: string) {
    await api.delete(`/eventos/${id}`);
    loadAba("eventos");
  }

  async function handleCreatePlano(plano: PlanoInput) {
    await api.post("/planos", plano);
    setShowForm(false);
    loadAba("planos");
  }

  async function handleDeletePlano(id: string) {
    await api.delete(`/planos/${id}`);
    loadAba("planos");
  }

  async function handleCreateGasto(gasto: GastoInput) {
    await api.post("/gastos", gasto);
    setShowForm(false);
    loadAba("gastos");
  }

  async function handleDeleteGasto(id: string) {
    await api.delete(`/gastos/${id}`);
    loadAba("gastos");
  }

  function handleNovoClick() {
    setEventoEmEdicao(null);
    setShowForm(true);
  }

  const mesesEventos = Array.from(new Set(eventos.map((e) => chaveMes(e.data)))).sort().reverse();
  const eventosFiltrados = filtroMesEventos
    ? eventos.filter((e) => chaveMes(e.data) === filtroMesEventos)
    : eventos;

  const mesesGastos = Array.from(new Set(gastos.map((g) => chaveMes(g.data)))).sort().reverse();
  const gastosFiltrados = filtroMesGastos
    ? gastos.filter((g) => chaveMes(g.data) === filtroMesGastos)
    : gastos;

  const NOVO_LABEL: Record<Aba, string> = {
    eventos: "+ Nova festa",
    agenda: "",
    planos: "+ Novo plano",
    gastos: "+ Novo gasto",
    dashboard: "",
  };

  if (!autenticado) {
    return <LoginForm onLogin={() => setAutenticado(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-rose-600 text-white px-4 py-4 shadow flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">Salão de Festas</h1>
          <p className="text-rose-100 text-sm">
            {getNomeUsuario() ? `Olá, ${getNomeUsuario()}` : "Gestão completa do salão"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={alternarTema}
            aria-label="Alternar tema"
            className="text-sm text-rose-100 hover:text-white"
          >
            {tema === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={handleLogout} className="text-sm text-rose-100 hover:text-white underline">
            Sair
          </button>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex overflow-x-auto">
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              aba === a.id
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {a.label}
          </button>
        ))}
      </nav>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {aba !== "dashboard" && aba !== "agenda" && !showForm && (
          <button
            onClick={handleNovoClick}
            className="w-full bg-rose-600 text-white rounded-lg py-3 font-medium hover:bg-rose-700"
          >
            {NOVO_LABEL[aba]}
          </button>
        )}

        {aba === "eventos" && showForm && (
          <EventoForm
            eventoInicial={eventoEmEdicao ?? undefined}
            onSubmit={handleSubmitEvento}
            onCancel={() => {
              setShowForm(false);
              setEventoEmEdicao(null);
            }}
          />
        )}
        {aba === "planos" && showForm && (
          <PlanoForm onSubmit={handleCreatePlano} onCancel={() => setShowForm(false)} />
        )}
        {aba === "gastos" && showForm && (
          <GastoForm eventos={eventos} onSubmit={handleCreateGasto} onCancel={() => setShowForm(false)} />
        )}

        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Carregando...</p>}
        {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}

        {!loading && !error && aba === "eventos" && !showForm && mesesEventos.length > 0 && (
          <div className="flex justify-end">
            <MonthFilter meses={mesesEventos} value={filtroMesEventos} onChange={setFiltroMesEventos} />
          </div>
        )}
        {!loading && !error && aba === "eventos" && (
          <EventoList eventos={eventosFiltrados} onEdit={handleEditEvento} onDelete={handleDeleteEvento} />
        )}
        {!loading && !error && aba === "agenda" && <CalendarView eventos={eventos} />}
        {!loading && !error && aba === "planos" && (
          <PlanoList planos={planos} onDelete={handleDeletePlano} />
        )}
        {!loading && !error && aba === "gastos" && !showForm && mesesGastos.length > 0 && (
          <div className="flex justify-end">
            <MonthFilter meses={mesesGastos} value={filtroMesGastos} onChange={setFiltroMesGastos} />
          </div>
        )}
        {!loading && !error && aba === "gastos" && (
          <GastoList gastos={gastosFiltrados} onDelete={handleDeleteGasto} />
        )}
        {!loading && !error && aba === "dashboard" && dashboard && (
          <DashboardView dashboard={dashboard} />
        )}
      </main>
    </div>
  );
}

export default App;
