import { useState } from "react";
import { EventoInput, StatusEvento } from "../api";

const STATUS_OPTIONS: StatusEvento[] = ["ORCAMENTO", "CONFIRMADO", "REALIZADO", "CANCELADO"];

interface Props {
  onSubmit: (evento: EventoInput) => void;
  onCancel: () => void;
}

export function EventoForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<EventoInput>({
    cliente: "",
    telefone: "",
    tipoEvento: "",
    data: "",
    status: "ORCAMENTO",
    valor: 0,
    observacoes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">Nova festa</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Cliente</label>
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Telefone</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.telefone ?? ""}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Tipo de evento</label>
          <input
            required
            placeholder="Aniversário, casamento..."
            className="w-full border rounded px-3 py-2"
            value={form.tipoEvento}
            onChange={(e) => setForm({ ...form, tipoEvento: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Data</label>
          <input
            required
            type="date"
            className="w-full border rounded px-3 py-2"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as StatusEvento })}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Valor (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Observações</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={2}
          value={form.observacoes ?? ""}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
