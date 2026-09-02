import { useState } from "react";
import { Evento, GastoInput, TipoGasto } from "../api";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS } from "../utils";

const CATEGORIAS = ["Buffet", "Decoração", "Funcionários", "Manutenção", "Aluguel", "Outros"];

interface Props {
  eventos: Evento[];
  onSubmit: (gasto: GastoInput) => void;
  onCancel: () => void;
}

export function GastoForm({ eventos, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<GastoInput>({
    descricao: "",
    categoria: CATEGORIAS[0],
    tipo: "FIXO",
    valor: 0,
    data: "",
    eventoId: null,
  });

  function handleTipoChange(tipo: TipoGasto) {
    setForm({ ...form, tipo, eventoId: tipo === "FIXO" ? null : form.eventoId });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className={`${CARD_CLASS} space-y-3`}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Novo gasto</h2>

      <div>
        <label className={LABEL_CLASS}>Tipo de gasto</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTipoChange("FIXO")}
            className={`flex-1 px-3 py-2 rounded border dark:border-gray-600 text-sm font-medium ${
              form.tipo === "FIXO" ? "bg-rose-600 text-white border-rose-600" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Fixo do salão
          </button>
          <button
            type="button"
            onClick={() => handleTipoChange("EVENTO")}
            className={`flex-1 px-3 py-2 rounded border dark:border-gray-600 text-sm font-medium ${
              form.tipo === "EVENTO" ? "bg-rose-600 text-white border-rose-600" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            De uma festa
          </button>
        </div>
      </div>

      {form.tipo === "EVENTO" && (
        <div>
          <label className={LABEL_CLASS}>Festa</label>
          <select
            required
            className={INPUT_CLASS}
            value={form.eventoId ?? ""}
            onChange={(e) => setForm({ ...form, eventoId: e.target.value })}
          >
            <option value="" disabled>
              Selecione a festa...
            </option>
            {eventos.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.cliente} — {ev.tipoEvento} ({new Date(ev.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>Descrição</label>
          <input
            required
            className={INPUT_CLASS}
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Categoria</label>
          <select
            className={INPUT_CLASS}
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Valor (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            className={INPUT_CLASS}
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Data</label>
          <input
            required
            type="date"
            className={INPUT_CLASS}
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
