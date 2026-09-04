import { useState } from "react";

import { Evento, GastoInput, TipoGasto } from "../api";
import {
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "../utils";

import { toast } from "sonner";

const CATEGORIAS = [
  "Buffet",
  "Decoração",
  "Funcionários",
  "Manutenção",
  "Aluguel",
  "Outros",
];

interface Props {
  eventos: Evento[];
  onSubmit: (gasto: GastoInput) => void;
  onCancel: () => void;
}

export function GastoForm({
  eventos,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<GastoInput>({
    descricao: "",
    categoria: CATEGORIAS[0],
    tipo: "FIXO",
    valor: 0,
    data: "",
    eventoId: null,
  });

  // Mantemos o valor como string durante a edição.
  // Assim o campo pode ser apagado sem o React inserir "0".
  const [valorInput, setValorInput] = useState("");

  function handleTipoChange(tipo: TipoGasto) {
    setForm((prev) => ({
      ...prev,
      tipo,
      eventoId:
        tipo === "FIXO" ? null : prev.eventoId,
    }));
  }

  function handleValorChange(value: string) {
    setValorInput(value);

    setForm((prev) => ({
      ...prev,
      valor: value === "" ? 0 : Number(value),
    }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const valor = Number(valorInput);

    if (form.descricao.trim() === "") {
      toast.error("Informe a descrição do gasto.");
      return;
    }

    if (form.data === "") {
      toast.error("Informe a data do gasto.");
      return;
    }

    if (valorInput.trim() === "") {
      toast.error("Informe o valor do gasto.");
      return;
    }

    if (!Number.isFinite(valor) || valor < 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    if (
      form.tipo === "EVENTO" &&
      !form.eventoId
    ) {
      toast.error("Selecione a festa relacionada ao gasto.");
      return;
    }

    onSubmit({
      ...form,
      descricao: form.descricao.trim(),
      valor,
      eventoId:
        form.tipo === "FIXO"
          ? null
          : form.eventoId,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${CARD_CLASS} space-y-4`}
    >
      <h2 className="text-[17px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
        Novo gasto
      </h2>

      <div>
        <label className={LABEL_CLASS}>
          Tipo de gasto
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTipoChange("FIXO")}
            className={`
              flex-1
              px-3 py-2
              rounded-full
              border
              text-[13.5px]
              font-semibold
              transition-all
              ${
                form.tipo === "FIXO"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }
            `}
          >
            Fixo do salão
          </button>

          <button
            type="button"
            onClick={() => handleTipoChange("EVENTO")}
            className={`
              flex-1
              px-3 py-2
              rounded-full
              border
              text-[13.5px]
              font-semibold
              transition-all
              ${
                form.tipo === "EVENTO"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }
            `}
          >
            De uma festa
          </button>
        </div>
      </div>

      {form.tipo === "EVENTO" && (
        <div>
          <label className={LABEL_CLASS}>
            Festa
          </label>

          <select
            required
            className={INPUT_CLASS}
            value={form.eventoId ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                eventoId: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Selecione a festa...
            </option>

            {eventos.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.cliente} — {ev.tipoEvento} (
                {new Date(ev.data).toLocaleDateString(
                  "pt-BR",
                  { timeZone: "UTC" }
                )}
                )
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className={LABEL_CLASS}>
            Descrição
          </label>

          <input
            required
            className={INPUT_CLASS}
            value={form.descricao}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Categoria
          </label>

          <select
            className={INPUT_CLASS}
            value={form.categoria}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                categoria: e.target.value,
              }))
            }
          >
            {CATEGORIAS.map((categoria) => (
              <option
                key={categoria}
                value={categoria}
              >
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Valor (R$)
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
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="
            px-4 py-2
            rounded-full
            border border-gray-200
            dark:border-gray-600
            text-[13.5px]
            font-semibold
            text-gray-600
            dark:text-gray-300
            hover:bg-gray-50
            dark:hover:bg-gray-700
            transition-colors
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="
            px-5 py-2
            rounded-full
            bg-rose-600
            text-white
            text-[13.5px]
            font-semibold
            hover:bg-rose-700
            active:scale-[0.98]
            transition-all
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-rose-300
            focus-visible:ring-offset-2
          "
        >
          Salvar
        </button>
      </div>
    </form>
  );
}