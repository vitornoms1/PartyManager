import { useEffect, useState } from "react";
import { api, Evento, EventoInput } from "./api";
import { EventoForm } from "./components/EventoForm";
import { EventoList } from "./components/EventoList";

function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEventos() {
    setLoading(true);
    try {
      const { data } = await api.get<Evento[]>("/eventos");
      setEventos(data);
      setError(null);
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventos();
  }, []);

  async function handleCreate(evento: EventoInput) {
    await api.post("/eventos", evento);
    setShowForm(false);
    loadEventos();
  }

  async function handleDelete(id: string) {
    await api.delete(`/eventos/${id}`);
    loadEventos();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-rose-600 text-white px-4 py-4 shadow">
        <h1 className="text-xl font-bold">Salão de Festas</h1>
        <p className="text-rose-100 text-sm">Controle de eventos</p>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-rose-600 text-white rounded-lg py-3 font-medium hover:bg-rose-700"
          >
            + Nova festa
          </button>
        )}

        {showForm && (
          <EventoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        )}

        {loading && <p className="text-center text-gray-500">Carregando...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && <EventoList eventos={eventos} onDelete={handleDelete} />}
      </main>
    </div>
  );
}

export default App;
