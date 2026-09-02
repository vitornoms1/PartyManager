import { useState } from "react";
import { PlanoInput } from "../api";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS } from "../utils";

interface Props {
  onSubmit: (plano: PlanoInput) => void;
  onCancel: () => void;
}

export function PlanoForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<PlanoInput>({
    nome: "",
    descricao: "",
    preco: 0,
    itens: "",
    ativo: true,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className={`${CARD_CLASS} space-y-3`}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Novo plano</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASS}>Nome do plano</label>
          <input
            required
            className={INPUT_CLASS}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Preço (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            className={INPUT_CLASS}
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Descrição</label>
        <input
          className={INPUT_CLASS}
          value={form.descricao ?? ""}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
      </div>

      <div>
        <label className={LABEL_CLASS}>Itens inclusos</label>
        <textarea
          rows={2}
          placeholder="Ex: decoração, buffet, som, 4 horas de festa..."
          className={INPUT_CLASS}
          value={form.itens ?? ""}
          onChange={(e) => setForm({ ...form, itens: e.target.value })}
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
