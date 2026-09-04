import { useState } from "react";

import { PlanoInput } from "../api";
import {
  CARD_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "../utils";

import { toast } from "sonner";

interface Props {
  onSubmit: (plano: PlanoInput) => void;
  onCancel: () => void;
}

export function PlanoForm({
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<PlanoInput>({
    nome: "",
    descricao: "",
    preco: 0,
    itens: "",
    ativo: true,
  });

  // Mantemos o preço como string durante a edição.
  // Assim o campo pode ser apagado completamente sem inserir "0".
  const [precoInput, setPrecoInput] = useState("");

  function handlePrecoChange(value: string) {
    setPrecoInput(value);

    setForm((prev) => ({
      ...prev,
      preco: value === "" ? 0 : Number(value),
    }));
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const preco = Number(precoInput);

    if (form.nome.trim() === "") {
      toast.error("Informe o nome do plano.");
      return;
    }

    if (precoInput.trim() === "") {
      toast.error("Informe o preço do plano.");
      return;
    }

    if (!Number.isFinite(preco) || preco < 0) {
      toast.error("Informe um preço válido.");
      return;
    }

    onSubmit({
      ...form,
      nome: form.nome.trim(),
      preco,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${CARD_CLASS} space-y-4`}
    >
      <h2 className="text-[17px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
        Novo plano
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className={LABEL_CLASS}>
            Nome do plano
          </label>

          <input
            required
            className={INPUT_CLASS}
            value={form.nome}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                nome: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>
            Preço (R$)
          </label>

          <input
            required
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            className={INPUT_CLASS}
            value={precoInput}
            onChange={(e) =>
              handlePrecoChange(e.target.value)
            }
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Descrição
        </label>

        <input
          className={INPUT_CLASS}
          value={form.descricao ?? ""}
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
          Itens inclusos
        </label>

        <textarea
          rows={2}
          placeholder="Ex: decoração, buffet, som, 4 horas de festa..."
          className={INPUT_CLASS}
          value={form.itens ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              itens: e.target.value,
            }))
          }
        />
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