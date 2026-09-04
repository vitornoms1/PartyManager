import { useState } from "react";
import { Evento, EventoInput, StatusEvento } from "../api";
import { CARD_CLASS, INPUT_CLASS, LABEL_CLASS } from "../utils";
import { toast } from "sonner";

const STATUS_OPTIONS: StatusEvento[] = [
  "ORCAMENTO",
  "CONFIRMADO",
  "REALIZADO",
  "CANCELADO",
];

interface Props {
  eventoInicial?: Evento;
  onSubmit: (evento: EventoInput) => void;
  onCancel: () => void;
}

export function EventoForm({
  eventoInicial,
  onSubmit,
  onCancel,
}: Props) {
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

  // Mantemos os valores monetários como string durante a edição.
  // Isso permite apagar completamente o campo sem o React inserir "0".
  const [valorInput, setValorInput] = useState(
    eventoInicial?.valor ? String(eventoInicial.valor) : ""
  );

  const [valorSinalInput, setValorSinalInput] = useState(
    eventoInicial?.valorSinal
      ? String(eventoInicial.valorSinal)
      : ""
  );

  function handleValorChange(value: string) {
    setValorInput(value);

    setForm((prev) => ({
      ...prev,
      valor: value === "" ? 0 : Number(value),
    }));
  }

  function handleValorSinalChange(value: string) {
    setValorSinalInput(value);

    setForm((prev) => ({
      ...prev,
      valorSinal: value === "" ? 0 : Number(value),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const valor = Number(valorInput);
    const valorSinal = Number(valorSinalInput);

    // Valor total obrigatório
    if (valorInput.trim() === "") {
      toast.error("Informe o valor total da festa.");
      return;
    }

    // Valor total inválido
    if (!Number.isFinite(valor) || valor < 0) {
      toast.error("Informe um valor total válido.");
      return;
    }

    // Sinal inválido
    if (
      valorSinalInput !== "" &&
      (!Number.isFinite(valorSinal) || valorSinal < 0)
    ) {
      toast.error("Informe um valor de sinal válido.");
      return;
    }

    // Sinal não pode ser maior que o total
    if (valorSinal > valor) {
      toast.error(
        "O valor do sinal não pode ser maior que o valor total."
      );
      return;
    }

    onSubmit({
      ...form,
      valor,
      valorSinal: valorSinalInput === "" ? 0 : valorSinal,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${CARD_CLASS} space-y-4`}
    >
      <h2 className="text-[17px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
        {eventoInicial ? "Editar festa" : "Nova festa"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className={LABEL_CLASS}>
            Cliente
          </label>

          <input
            required
            className={INPUT_CLASS}
            value={form.cliente}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cliente: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Telefone
          </label>

          <input
            className={INPUT_CLASS}
            value={form.telefone ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                telefone: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Tipo de evento
          </label>

          <input
            required
            placeholder="Aniversário, casamento..."
            className={INPUT_CLASS}
            value={form.tipoEvento}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tipoEvento: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Data
          </label>

          <input
            required
            type="date"
            className={INPUT_CLASS}
            value={form.data}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                data: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Status
          </label>

          <select
            className={INPUT_CLASS}
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as StatusEvento,
              }))
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Valor total */}
        <div>
          <label className={LABEL_CLASS}>
            Valor total (R$)
          </label>

          <input
            required
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            className={INPUT_CLASS}
            value={valorInput}
            onChange={(e) =>
              handleValorChange(e.target.value)
            }
          />
        </div>

        {/* Valor do sinal */}
        <div>
          <label className={LABEL_CLASS}>
            Valor do sinal (R$)
          </label>

          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            className={INPUT_CLASS}
            value={valorSinalInput}
            onChange={(e) =>
              handleValorSinalChange(e.target.value)
            }
          />

          {valorSinalInput !== "" &&
            Number(valorSinalInput) > Number(valorInput || 0) && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                O sinal não pode ser maior que o valor total.
              </p>
            )}
        </div>
      </div>

      <div className="flex gap-5 pt-1">
        <label className="flex items-center gap-2 text-[13.5px] text-gray-600 dark:text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.sinalPago}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sinalPago: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded accent-rose-600 cursor-pointer"
          />
          Sinal pago
        </label>

        <label className="flex items-center gap-2 text-[13.5px] text-gray-600 dark:text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.restantePago}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                restantePago: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded accent-rose-600 cursor-pointer"
          />
          Restante pago
        </label>
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Observações
        </label>

        <textarea
          className={INPUT_CLASS}
          rows={2}
          value={form.observacoes ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              observacoes: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-[13.5px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-5 py-2 rounded-full bg-rose-600 text-white text-[13.5px] font-semibold hover:bg-rose-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}