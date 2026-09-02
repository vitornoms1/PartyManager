import { useState } from "react";
import { Evento, EventoInput, StatusEvento } from "../api";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS } from "../utils";

const STATUS_OPTIONS: StatusEvento[] = ["ORCAMENTO", "CONFIRMADO", "REALIZADO", "CANCELADO"];

interface Props {
  eventoInicial?: Evento;
  onSubmit: (evento: EventoInput) => void;
  onCancel: () => void;
}

export function EventoForm({ eventoInicial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<EventoInput>({
    cliente: eventoInicial?.cliente ?? "",
    telefone: eventoInicial?.telefone ?? "",
    tipoEvento: eventoInicial?.tipoEvento ?? "",
    data: eventoInicial ? eventoInicial.data.slice(0, 10) : "",
    status: eventoInicial?.status ?? "ORCAMENTO",
    valor: eventoInicial?.valor ?? 0,
    valorSinal: eventoInicial?.valorSinal ?? 0,
    sinalPago: eventoInicial?.sinalPago ?? false,
    restantePago: eventoInicial?.restantePago ?? false,
    observacoes: eventoInicial?.observacoes ?? "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className={`${CARD_CLASS} space-y-3`}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {eventoInicial ? "Editar festa" : "Nova festa"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>Cliente</label>
          <input
            required
            className={INPUT_CLASS}
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Telefone</label>
          <input
            className={INPUT_CLASS}
            value={form.telefone ?? ""}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Tipo de evento</label>
          <input
            required
            placeholder="Aniversário, casamento..."
            className={INPUT_CLASS}
            value={form.tipoEvento}
            onChange={(e) => setForm({ ...form, tipoEvento: e.target.value })}
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

        <div>
          <label className={LABEL_CLASS}>Status</label>
          <select
            className={INPUT_CLASS}
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
          <label className={LABEL_CLASS}>Valor total (R$)</label>
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
          <label className={LABEL_CLASS}>Valor do sinal (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={INPUT_CLASS}
            value={form.valorSinal}
            onChange={(e) => setForm({ ...form, valorSinal: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={form.sinalPago}
            onChange={(e) => setForm({ ...form, sinalPago: e.target.checked })}
          />
          Sinal pago
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={form.restantePago}
            onChange={(e) => setForm({ ...form, restantePago: e.target.checked })}
          />
          Restante pago
        </label>
      </div>

      <div>
        <label className={LABEL_CLASS}>Observações</label>
        <textarea
          className={INPUT_CLASS}
          rows={2}
          value={form.observacoes ?? ""}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        />
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
